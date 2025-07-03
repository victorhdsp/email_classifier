import json
import logging
import re

from fastapi import HTTPException

from src.email_analysis.shared.models.analysis_result import AnalysisResult
from src.email_analysis.shared.prompts.analyze_raw_text import analyze_raw_text_prompt
from src.shared.services.llm import LLMService
from src.shared.services.nlp import NLPService


class AnalyzeRawTextUseCase:
    def __init__(self, nlp_service: NLPService, llm_service: LLMService):
        self.nlp = nlp_service
        self.llm = llm_service
        pass

    def protect(self, text: str) -> None:
        if not isinstance(text, str):
            raise HTTPException(status_code=400, detail="O texto deve ser uma string.")
        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="O texto não pode ser vazio ou apenas espaços em branco.",
            )

    async def execute(self, raw_text: str) -> AnalysisResult:
        self.protect(raw_text)
        cleaned_text = self.nlp.pipeline(raw_text)
        prompt = analyze_raw_text_prompt(cleaned_text)

        for attempt in range(2):
            response = self.llm.generate(prompt)

            match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", response, re.DOTALL)
            try:
                if match:
                    response_json_str = match.group(1)
                else:
                    response_json_str = response
                response_data = json.loads(response_json_str)
                return AnalysisResult(**response_data)
            except (json.JSONDecodeError, TypeError, ValueError):
                if attempt == 1:
                    raise Exception(
                        "Falha ao parsear resposta do LLM após duas tentativas.",
                    )

        raise Exception("Falha ao gerar resposta do LLM.")
