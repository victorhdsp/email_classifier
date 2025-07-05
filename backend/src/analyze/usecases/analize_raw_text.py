import json
import re

from dateutil import parser
from fastapi import HTTPException

from src.analyze.models.analyze_result import AnalyzeResult
from src.analyze.prompts.analyze_raw_text import analyze_raw_text_prompt
from src.semantic_cache.service import SemanticCacheService
from src.shared.services.llm import LLMService
from src.shared.services.nlp import NLPService

DATE_PATTERNS = [
    r"\d{1,2} de \w+ de \d{4} às \d{1,2}:\d{2}",  # 2 de julho de 2025 às 17:03
    r"\d{2}/\d{2}/\d{4} \d{2}:\d{2}",  # 02/07/2025 17:03
    r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z",  # 2025-07-02T17:03:00Z
]


class AnalyzeRawTextUseCase:
    def __init__(
        self,
        nlp_service: NLPService,
        llm_service: LLMService,
        semantic_cache_service: SemanticCacheService,
    ):
        self.nlp = nlp_service
        self.llm = llm_service
        self.semantic_cache = semantic_cache_service
        pass

    def protect(self, text: str) -> None:
        if not isinstance(text, str):
            raise HTTPException(status_code=400, detail="O texto deve ser uma string.")
        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="O texto não pode ser vazio ou apenas espaços em branco.",
            )

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

    async def execute(self, raw_text: str) -> AnalyzeResult:
        self.protect(raw_text)
        cleaned_text = self.nlp.pipeline(raw_text)
        prompt = analyze_raw_text_prompt(cleaned_text)

        def llm_callable(p: str) -> dict:
            for attempt in range(2):
                response = self.llm.generate(p)
                match = re.search(
                    r"```(?:json)?\s*(\{.*?\})\s*```", response, re.DOTALL
                )

                try:
                    if match:
                        response_json_str = match.group(1)
                    else:
                        response_json_str = response

                    response_data = json.loads(response_json_str)
                    return response_data

                except (json.JSONDecodeError, TypeError, ValueError):
                    if attempt == 1:
                        raise Exception(
                            "Falha ao parsear resposta do LLM após duas tentativas.",
                        )
            raise Exception("Falha ao gerar resposta do LLM.")

        # Remover daqui
        response_data = self.semantic_cache.get_or_generate(
            input_text= cleaned_text,
            prompt= prompt,
            llm_callable= llm_callable
        )

        if not response_data.get("timestamp"):
            timestamp = self.extract_first_valid_date(raw_text)
            if timestamp:
                response_data["timestamp"] = timestamp

        return AnalyzeResult(**response_data)

