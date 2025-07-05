from src.email_analysis.shared.models.analysis_result import AnalysisResult
from src.email_analysis.shared.usecases.analize_raw_text import (
    AnalyzeRawTextUseCase,
)


class AnalyzeByTextController:
    def __init__(self, analyze_raw_text_use_case: AnalyzeRawTextUseCase):
        self.analyze_raw_text = analyze_raw_text_use_case
        pass

    async def execute(self, raw_text: str) -> AnalysisResult:
        response = await self.analyze_raw_text.execute(raw_text)
        return response
