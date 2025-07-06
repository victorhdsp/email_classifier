from sqlalchemy import Column, DateTime, String
from sqlalchemy.sql import func

from src.shared.infra.database import BASE


class AutenticationDto(BASE):
    __tablename__ = "autentication"

    id = Column(String, primary_key=True, index=True)
    ip = Column(String, nullable=False)
    user_agent = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
