from typing import Optional
from sqlalchemy.orm import Session
from src.shared.infra.database.semantic_cache_model import SemanticCache

class SemanticCacheRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, cache_id: str) -> Optional[dict]:
        cache_entry = self.db.query(SemanticCache).filter(SemanticCache.id == cache_id).first()
        if cache_entry:
            return {
                "id": cache_entry.id,
                "input_text": cache_entry.input_text,
                "llm_result_json": cache_entry.llm_result_json,
                "created_at": cache_entry.created_at.isoformat()
            }
        return None

    def insert(self, cache_id: str, input_text: str, llm_result_json: dict) -> None:
        new_cache_entry = SemanticCache(
            id=cache_id,
            input_text=input_text,
            llm_result_json=llm_result_json
        )
        self.db.add(new_cache_entry)
        self.db.commit()
        self.db.refresh(new_cache_entry)
