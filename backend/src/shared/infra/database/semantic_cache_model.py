from sqlalchemy import Column, String, JSON, DateTime
from sqlalchemy.sql import func
from src.shared.infra.database.database import Base

class SemanticCache(Base):
    __tablename__ = "semantic_cache"

    id = Column(String, primary_key=True, index=True)
    input_text = Column(String, nullable=False)
    llm_result_json = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
