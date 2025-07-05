from fastapi import APIRouter, File, UploadFile

from src.analyze.models.analyze_by_text_request import AnalyzeByTextRequest
from src.analyze.models.analyze_result import AnalyzeFullResult
from src.dependences import (
    collect_data_use_case,
    create_data_use_case,
    extract_file_use_case,
    pre_proccess_use_case,
)

analyze_router = APIRouter(prefix="/email")


@analyze_router.post("/analyze/file")
async def handle_file(file: UploadFile = File(...)) -> AnalyzeFullResult:
    raw_text = await extract_file_use_case.execute(file)
    loading_data = pre_proccess_use_case.execute(raw_text)

    result_data = await collect_data_use_case.execute(loading_data.id)
    if not result_data:
        result_data = await create_data_use_case.execute(loading_data)
    if not result_data:
        raise Exception("Failed to create or collect data.")
    return result_data


@analyze_router.post("/analyze/json")
async def handle_text(data: AnalyzeByTextRequest) -> AnalyzeFullResult:
    loading_data = pre_proccess_use_case.execute(data.text)
    
    result_data = await collect_data_use_case.execute(loading_data.id)
    if not result_data:
        result_data = await create_data_use_case.execute(loading_data)
    if not result_data:
        raise Exception("Failed to create or collect data.")
    return result_data
