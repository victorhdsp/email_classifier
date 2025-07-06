import json
import re

from src.analyze.models.analyze_result import AnalyzeFullResult, AnalyzeLoadingResult
from src.analyze.prompts.analyze_raw_text import analyze_raw_text_prompt
from src.shared.services.llm import LLMService
from src.shared.services.semantic_cache import SemanticCacheService


class CreateDataUseCase:
    def __init__(
        self,
        llm_service: LLMService,
        semantic_cache_service: SemanticCacheService,
    ):
        self.llm = llm_service
        self.semantic_cache = semantic_cache_service
        pass

    def llm_callable(self, prompt: str) -> dict:
        for attempt in range(2):
            response = self.llm.generate(prompt)
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

    async def execute(self, user_token: str, loadingResult: AnalyzeLoadingResult) -> AnalyzeFullResult:
        prompt = analyze_raw_text_prompt(loadingResult.text)

        response_data = self.semantic_cache.generate(
            loadingResult= loadingResult,
            prompt= prompt,
            llm_callable= self.llm_callable,
            user_token= user_token,
        )

        if not response_data:
            raise Exception(
                "Este dado já foi processado anteriormente."
            )

        result = AnalyzeFullResult(
            **response_data,
            id=loadingResult.id,
            text=loadingResult.text,
            timestamp=loadingResult.timestamp,
        )

        return result

