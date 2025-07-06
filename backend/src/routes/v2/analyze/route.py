
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
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)

analyze_router = APIRouter(prefix="/email")


@analyze_router.post("/analyze/file", **handle_file_doc)
async def handle_file(
    request: Request, background_tasks: BackgroundTasks, file: UploadFile = File(...)
) -> AnalyzeLoadingResult:
    logger.info(f"[V2] Request received to analyze file: {file.filename}")
    user_token = getattr(request.state, "user_token", "")
    if not user_token or user_token.strip() == "":
        logger.error("[V2] Unauthorized access attempt to /analyze/file: Missing user token.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não autenticado.")

    try:
        raw_text = await extract_file_use_case.execute(file)
        logger.info("[V2] File extracted successfully.")
    except Exception as e:
        logger.error(f"[V2] Error extracting file: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Falha ao extrair o arquivo.")

    loading_data = pre_proccess_use_case.execute(raw_text)
    logger.info(f"[V2] Pre-processing completed for data ID: {loading_data.id}")

    await processing_queue_service.enqueue(user_token, loading_data)
    logger.info(f"[V2] Data enqueued for processing. Data ID: {loading_data.id}")

    return loading_data


@analyze_router.post("/analyze/json", **handle_text_doc)
async def handle_text(
    request: Request, background_tasks: BackgroundTasks, data: AnalyzeByTextRequest
) -> AnalyzeLoadingResult:
    logger.info("[V2] Request received to analyze text.")
    user_token = getattr(request.state, "user_token", "")
    logger.info(f"[V2] User ID: {user_token} - Request State: {request.state}")
    if not user_token or user_token.strip() == "":
        logger.error("[V2] Unauthorized access attempt to /analyze/json: Missing user token.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não autenticado.")

    loading_data = pre_proccess_use_case.execute(data.text)
    logger.info(f"[V2] Pre-processing completed for data ID: {loading_data.id}")

    await processing_queue_service.enqueue(user_token, loading_data)
    logger.info(f"[V2] Data enqueued for processing. Data ID: {loading_data.id}")

    return loading_data


@analyze_router.get("/{email_id}", **get_email_analysis_doc)
async def get_email_analysis(request: Request, email_id: str) -> AnalyzeFullResult:
    logger.info(f"[V2] Request received to get analysis for email ID: {email_id}")
    user_token = getattr(request.state, "user_token", "")
    if not user_token or user_token.strip() == "":
        logger.error("[V2] Unauthorized access attempt to /{email_id}: Missing user token.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não autenticado.")

    logger.info(f"[V2] Collecting data for email ID {email_id} and user {user_token}.")
    result = await collect_data_use_case.execute(user_token, email_id)
    if not result:
        logger.error(f"[V2] Analysis not found or unauthorized for email ID: {email_id}")
        raise HTTPException(
            detail="Análise não encontrada ou você não tem autorização para acessar este resultado.",
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    logger.info(f"[V2] Analysis retrieved successfully for email ID: {email_id}")
    return result
