from src.analyze.models.analyze_result import AnalyzeResult
from src.analyze.usecases.analize_raw_text import (
    AnalyzeRawTextUseCase,
)


class AnalyzeByTextController:
    def __init__(self, analyze_raw_text_use_case: AnalyzeRawTextUseCase):
        self.analyze_raw_text = analyze_raw_text_use_case
        pass

    async def execute(self, raw_text: str) -> AnalyzeResult:
        response = await self.analyze_raw_text.execute(raw_text)
        return response
