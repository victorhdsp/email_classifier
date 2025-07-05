from fastapi import APIRouter, BackgroundTasks, File, HTTPException, UploadFile

from src.analyze.models.analyze_by_text_request import AnalyzeByTextRequest
from src.analyze.models.analyze_result import AnalyzeFullResult, AnalyzeLoadingResult
from src.dependences import (
    collect_data_use_case,
    create_data_use_case,
    extract_file_use_case,
    pre_proccess_use_case,
)

analyze_router = APIRouter(prefix="/email")

@analyze_router.post("/analyze/file")
async def handle_file(background_tasks: BackgroundTasks, file: UploadFile = File(...)) -> AnalyzeLoadingResult:
    raw_text = await extract_file_use_case.execute(file)
    loading_data = pre_proccess_use_case.execute(raw_text)

    background_tasks.add_task(create_data_use_case.execute, loading_data)
    return loading_data


@analyze_router.post("/analyze/json")
async def handle_text(background_tasks: BackgroundTasks, data: AnalyzeByTextRequest) -> AnalyzeLoadingResult:
    loading_data = pre_proccess_use_case.execute(data.text)
    background_tasks.add_task(create_data_use_case.execute, loading_data)
    return loading_data


@analyze_router.get("/{email_id}")
async def get_email_analysis(email_id: str) -> AnalyzeFullResult:
    result = await collect_data_use_case.execute(email_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Email analysis with ID {email_id} not found."
        )
    return result