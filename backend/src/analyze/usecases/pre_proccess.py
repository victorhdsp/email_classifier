import hashlib
import re

from dateutil import parser
from fastapi import HTTPException

from src.analyze.models.analyze_result import AnalyzeLoadingResult
from src.shared.services.nlp import NLPService

DATE_PATTERNS = [
    r"\d{1,2} de \w+ de \d{4} às \d{1,2}:\d{2}",  # 2 de julho de 2025 às 17:03
    r"\d{2}/\d{2}/\d{4} \d{2}:\d{2}",  # 02/07/2025 17:03
    r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z",  # 2025-07-02T17:03:00Z
]


class PreProccessUseCase:
    def __init__(
        self,
        nlp_service: NLPService
    ):
        self.nlp = nlp_service
        pass

    def protect(self, text: str) -> None:
        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="O texto não pode ser vazio ou apenas espaços em branco.",
            )

    def _generate_hash(self, text: str) -> str:
        return hashlib.sha256(text.encode('utf-8')).hexdigest()

    def extract_first_valid_date(self, text: str) -> str | None:
        for pattern in DATE_PATTERNS:
            match = re.search(pattern, text)
            if match:
                try:
                    dt = parser.parse(match.group(), fuzzy=True, dayfirst=True)
                    return dt.isoformat()
                except Exception:
                    continue
        return None

    def execute(self, raw_text: str) -> AnalyzeLoadingResult:
        self.protect(raw_text)
        cleaned_text = self.nlp.pipeline(raw_text)
        timestamp = self.extract_first_valid_date(raw_text)

        result = AnalyzeLoadingResult(
            id=self._generate_hash(cleaned_text),
            text=cleaned_text,
            timestamp=timestamp
        )

        return result

