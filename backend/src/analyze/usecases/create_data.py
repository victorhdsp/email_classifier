import json
import re

from src.analyze.models.analyze_result import AnalyzeFullResult, AnalyzeLoadingResult
from src.analyze.prompts.analyze_raw_text import analyze_raw_text_prompt
from src.shared.services.llm import LLMService
from src.shared.services.semantic_cache import SemanticCacheService
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)


class CreateDataUseCase:
    def __init__(
        self,
        llm_service: LLMService,
        semantic_cache_service: SemanticCacheService,
    ):
        self.llm = llm_service
        self.semantic_cache = semantic_cache_service
        logger.info("CreateDataUseCase initialized.")

    def llm_callable(self, prompt: str) -> dict:
        logger.info("Calling LLM for data creation.")
        for attempt in range(2):
            try:
                response = self.llm.generate(prompt)
                match = re.search(
                    r"```(?:json)?\s*(\{.*?\})\s*```", response, re.DOTALL
                )

                if match:
                    response_json_str = match.group(1)
                else:
                    response_json_str = response

                response_data = json.loads(response_json_str)
                logger.info(f"LLM response parsed successfully on attempt {attempt + 1}.")
                return response_data

            except (json.JSONDecodeError, TypeError, ValueError) as e:
                logger.warning(f"Failed to parse LLM response on attempt {attempt + 1}: {e}")
                if attempt == 1:
                    logger.error("Failed to parse LLM response after two attempts.")
                    raise Exception(
                        "Falha ao parsear resposta do LLM após duas tentativas.",
                    )
        logger.error("Failed to generate LLM response.")
        raise Exception("Falha ao gerar resposta do LLM.")

    async def execute(self, user_token: str, loadingResult: AnalyzeLoadingResult) -> AnalyzeFullResult:
        logger.info(f"Executing CreateDataUseCase for user {user_token} and data ID {loadingResult.id}.")
        prompt = analyze_raw_text_prompt(loadingResult.text)
        logger.info("LLM prompt generated.")

        response_data = self.semantic_cache.generate_or_get(
            loadingResult= loadingResult,
            prompt= prompt,
            llm_callable= self.llm_callable,
            user_token= user_token,
        )
        logger.info("Data generated or retrieved from semantic cache.")

        result = AnalyzeFullResult(
            **response_data,
        )
        logger.info(f"CreateDataUseCase completed for data ID {loadingResult.id}.")
        return result

