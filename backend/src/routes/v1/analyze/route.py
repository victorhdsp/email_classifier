from fastapi import APIRouter, File, UploadFile

from src.analyze.models.analyze_by_text_request import AnalyzeByTextRequest
from src.analyze.models.analyze_result import AnalyzeResult
from src.dependences import analyze_by_file_controller, analyze_raw_text_use_case

analyze_router = APIRouter(prefix="/email")


@analyze_router.post("/analyze/file")
async def handle_file(file: UploadFile = File(...)) -> AnalyzeResult:
    return await analyze_by_file_controller.execute(file)


@analyze_router.post("/analyze/json")
async def handle_text(data: AnalyzeByTextRequest) -> AnalyzeResult:
    return await analyze_raw_text_use_case.execute(data.text)
