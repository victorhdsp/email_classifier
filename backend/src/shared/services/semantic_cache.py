from typing import Callable

from sqlalchemy.orm import Session

from src.analyze.models.analyze_result import AnalyzeLoadingResult
from src.shared.repositories.semantic_cache import SemanticCacheRepository


class SemanticCacheService:
    def __init__(self, db: Session):
        self.repository = SemanticCacheRepository(db)

    def generate_or_get(
        self,
        user_token: str,
        prompt: str,
        loadingResult: AnalyzeLoadingResult,
        llm_callable: Callable[[str], dict]
    ) -> dict:
        cached_result = self.repository.get_by_id(loadingResult.id)

        if cached_result:
            print(f"[SemanticCache] Cache hit for ID: {loadingResult.id}")
            self.repository.update_owners(loadingResult.id, user_token)
            return cached_result["llm_result_json"]

        print(f"[SemanticCache] Cache miss for ID: {loadingResult.id}. Calling LLM...")
        llm_response = llm_callable(prompt)
        llm_response["id"] = loadingResult.id
        llm_response["timestamp"] = loadingResult.timestamp
        self.repository.insert(loadingResult.id, loadingResult.text, user_token, llm_response)
        print(f"[SemanticCache] LLM response cached for ID: {loadingResult.id}")
        return llm_response 

    def verify_and_get(
        self, 
        user_token: str,
        cache_id: str,
    ) -> dict | None:
        cached_result = self.repository.find_owner_by_id(cache_id, user_token)
        
        if not cached_result:
            print(f"[SemanticCache] No cache found for ID: {cache_id}")
            return None

        print(f"[SemanticCache] Cache hit for ID: {cache_id}")
        return cached_result["llm_result_json"]
