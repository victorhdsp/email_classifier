
from fastapi import (
    APIRouter,
    BackgroundTasks,
    File,
    HTTPException,
    Request,
    UploadFile,
    status,
)

from src.analyze.models.analyze_by_text_request import AnalyzeByTextRequest
from src.analyze.models.analyze_result import AnalyzeFullResult, AnalyzeLoadingResult
from src.dependences import (
    collect_data_use_case,
    extract_file_use_case,
    pre_proccess_use_case,
)
from src.routes.v2.analyze.analyze_doc import (
    get_email_analysis_doc,
    handle_file_doc,
    handle_text_doc,
)
from src.shared.services.processing_queue import processing_queue_service

analyze_router = APIRouter(prefix="/email")


@analyze_router.post("/analyze/file", **handle_file_doc)
async def handle_file(
    request: Request, background_tasks: BackgroundTasks, file: UploadFile = File(...)
) -> AnalyzeLoadingResult:
    user_token = getattr(request.state, "user_token", "")
    if not user_token or user_token.strip() == "":
        raise HTTPException(status_code=401, detail="Usuário não autenticado.")

    raw_text = await extract_file_use_case.execute(file)
    loading_data = pre_proccess_use_case.execute(raw_text)

    await processing_queue_service.enqueue(user_token, loading_data)

    return loading_data


@analyze_router.post("/analyze/json", **handle_text_doc)
async def handle_text(
    request: Request, background_tasks: BackgroundTasks, data: AnalyzeByTextRequest
) -> AnalyzeLoadingResult:
    user_token = getattr(request.state, "user_token", "")
    print(f"[Analyze] User ID: {user_token} - Request State: {request.state}")
    if not user_token or user_token.strip() == "":
        raise HTTPException(status_code=401, detail="Usuário não autenticado.")

    loading_data = pre_proccess_use_case.execute(data.text)

    await processing_queue_service.enqueue(user_token, loading_data)

    return loading_data


@analyze_router.get("/{email_id}", **get_email_analysis_doc)
async def get_email_analysis(request: Request, email_id: str) -> AnalyzeFullResult:
    user_token = getattr(request.state, "user_token", "")
    if not user_token or user_token.strip() == "":
        raise HTTPException(status_code=401, detail="Usuário não autenticado.")

    print(f"[Analyze] Result for email ID {user_token}: {request.state}")
    result = await collect_data_use_case.execute(user_token, email_id)
    if not result:
        raise HTTPException(
            detail="Análise não encontrada ou você não tem autorização para acessar este resultado.",
            status_code=400,
        )
    return result
