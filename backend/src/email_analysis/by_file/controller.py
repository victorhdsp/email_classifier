from fastapi import UploadFile

from src.email_analysis.shared.models.analysis_result import AnalysisResult
from src.email_analysis.shared.usecases.analize_raw_text import AnalyzeRawTextUseCase
from src.email_analysis.shared.usecases.extract_file import ExtractFileUseCase


class AnalyzeByFileController:
    def __init__(
        self,
        analyze_raw_text_use_case: AnalyzeRawTextUseCase,
        extract_file_use_case: ExtractFileUseCase,
    ):
        self.analyze_raw_text = analyze_raw_text_use_case
        self.extract_file = extract_file_use_case
        pass

    async def execute(self, file: UploadFile) -> AnalysisResult:
        raw_text = await self.extract_file.execute(file)
        response = await self.analyze_raw_text.execute(raw_text)
        return response
