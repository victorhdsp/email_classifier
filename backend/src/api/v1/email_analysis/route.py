from fastapi import APIRouter, File, UploadFile

from src.dependences import analyze_by_file_controller, analyze_raw_text_use_case
from src.email_analysis.by_text.request_model import EmailAnalysisByTextRequest
from src.email_analysis.shared.models.analysis_result import AnalysisResult

email_analysis_router = APIRouter(prefix="/email")


@email_analysis_router.post("/analyze/file")
async def handle_file(file: UploadFile = File(...)) -> AnalysisResult:
    return await analyze_by_file_controller.execute(file)


@email_analysis_router.post("/analyze/json")
async def handle_text(data: EmailAnalysisByTextRequest) -> AnalysisResult:
    return await analyze_raw_text_use_case.execute(data.text)
