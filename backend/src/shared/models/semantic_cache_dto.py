from sqlalchemy import ARRAY, JSON, Column, DateTime, String
from sqlalchemy.sql import func

from src.shared.infra.database import BASE


class SemanticCacheDto(BASE):
    __tablename__ = "semantic_cache"

    id = Column(String, primary_key=True, index=True)
    input_text = Column(String, nullable=False)
    llm_result_json = Column(JSON, nullable=False)
    owners = Column(ARRAY(String), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
