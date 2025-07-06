from typing import Callable

from sqlalchemy.orm import Session

from src.analyze.models.analyze_result import AnalyzeLoadingResult
from src.shared.repositories.semantic_cache import SemanticCacheRepository
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)


class SemanticCacheService:
    def __init__(self, db: Session):
        self.repository = SemanticCacheRepository(db)
        logger.info("SemanticCacheService initialized.")

    def generate_or_get(
        self,
        user_token: str,
        prompt: str,
        loadingResult: AnalyzeLoadingResult,
        llm_callable: Callable[[str], dict]
    ) -> dict:
        logger.info(f"Attempting to generate or get data for ID: {loadingResult.id}")
        cached_result = self.repository.get_by_id(loadingResult.id)

        if cached_result:
            logger.info(f"Cache hit for ID: {loadingResult.id}. Updating owners.")
            self.repository.update_owners(loadingResult.id, user_token)
            return cached_result["llm_result_json"]

        logger.info(f"Cache miss for ID: {loadingResult.id}. Calling LLM...")
        llm_response = llm_callable(prompt)
        llm_response["id"] = loadingResult.id
        llm_response["timestamp"] = loadingResult.timestamp
        self.repository.insert(loadingResult.id, loadingResult.text, user_token, llm_response)
        logger.info(f"LLM response cached for ID: {loadingResult.id}")
        return llm_response 

    def verify_and_get(
        self, 
        user_token: str,
        cache_id: str,
    ) -> dict | None:
        logger.info(f"Verifying and getting cache for ID: {cache_id} and user: {user_token}")
        cached_result = self.repository.find_owner_by_id(cache_id, user_token)
        if not cached_result:
            logger.info(f"No cache found for ID: {cache_id} for user: {user_token}")
            return None

        logger.info(f"Cache hit for ID: {cache_id} for user: {user_token}")
        return cached_result["llm_result_json"]
