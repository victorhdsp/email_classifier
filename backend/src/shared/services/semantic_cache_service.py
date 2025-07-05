import hashlib
import json
from typing import Callable, Optional
from sqlalchemy.orm import Session
from src.shared.infra.database.semantic_cache_repository import SemanticCacheRepository

class SemanticCacheService:
    def __init__(self, db: Session):
        self.repository = SemanticCacheRepository(db)

    def _generate_hash(self, text: str) -> str:
        return hashlib.sha256(text.encode('utf-8')).hexdigest()

    def get_or_generate(
        self, 
        input_text: str,
        prompt: str,
        llm_callable: Callable[[str], dict],
    ) -> dict:
        cache_id = self._generate_hash(input_text)
        cached_result = self.repository.get_by_id(cache_id)

        if cached_result:
            print(f"[SemanticCache] Cache hit for ID: {cache_id}")
            return cached_result["llm_result_json"]
        else:
            print(f"[SemanticCache] Cache miss for ID: {cache_id}. Calling LLM...")
            llm_response = llm_callable(prompt)
            llm_response["id"] = cache_id
            self.repository.insert(cache_id, input_text, llm_response)
            print(f"[SemanticCache] LLM response cached for ID: {cache_id}")
            return llm_response 
