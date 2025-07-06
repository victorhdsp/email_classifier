from typing import Optional

from sqlalchemy.orm import Session

from src.shared.models.semantic_cache_dto import SemanticCacheDto
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)


class SemanticCacheRepository:
    def __init__(self, db: Session):
        self.db = db
        logger.info("SemanticCacheRepository initialized.")

    def get_by_id(self, cache_id: str) -> Optional[dict]:
        logger.info(f"Attempting to get cache entry by ID: {cache_id}")
        cache_entry = self.db.query(SemanticCacheDto).filter(SemanticCacheDto.id == cache_id).first()
        if cache_entry:
            logger.info(f"Cache entry found for ID: {cache_id}")
            return {
                "id": cache_entry.id,
                "input_text": cache_entry.input_text,
                "llm_result_json": cache_entry.llm_result_json,
                "created_at": cache_entry.created_at.isoformat()
            }
        logger.info(f"No cache entry found for ID: {cache_id}")
        return None

    def insert(self, cache_id: str, input_text: str, owner: str, llm_result_json: dict) -> None:
        logger.info(f"Inserting new cache entry with ID: {cache_id} for owner: {owner}")
        new_cache_entry = SemanticCacheDto(
            id=cache_id,
            input_text=input_text,
            owners=[owner],
            llm_result_json=llm_result_json
        )
        self.db.add(new_cache_entry)
        self.db.commit()
        self.db.refresh(new_cache_entry)
        logger.info(f"Cache entry {cache_id} inserted successfully.")

    def find_owner_by_id(self, cache_id: str, owner: str) -> Optional[dict]:
        logger.info(f"Searching for cache ID: {cache_id} with owner: {owner}")
        cache_entry = self.db.query(SemanticCacheDto).filter(SemanticCacheDto.id == cache_id).first()
        if cache_entry:
            logger.debug(f"[SemanticCacheRepository] Searching for cache ID: {cache_id} with owner: {owner}, found: {cache_entry.owners}")
            if owner in cache_entry.owners:
                logger.info(f"Cache ID: {cache_id} found with owner: {owner}")
                return {
                    "id": cache_entry.id,
                    "input_text": cache_entry.input_text,
                    "llm_result_json": cache_entry.llm_result_json,
                    "created_at": cache_entry.created_at.isoformat()
                }
        logger.info(f"Cache ID: {cache_id} not found or owner {owner} not associated.")
        return None

    def update_owners(self, cache_id: str, owner: str) -> None:
        logger.info(f"Attempting to update owners for cache ID: {cache_id}, adding owner: {owner}")
        cache_entry = self.db.query(SemanticCacheDto).filter(SemanticCacheDto.id == cache_id).first()
        if cache_entry:
            if owner not in cache_entry.owners:
                cache_entry.owners.append(owner)
                self.db.commit()
                logger.info(f"Updated owners for cache ID: {cache_id}, added owner: {owner}")
            else:
                logger.info(f"Owner {owner} already exists for cache ID: {cache_id}")
        else:
            logger.warning(f"Cache entry with ID {cache_id} not found for owner update.")
