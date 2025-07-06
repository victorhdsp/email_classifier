from typing import Optional

from sqlalchemy.orm import Session

from src.shared.models.autentication_dto import AutenticationDto
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)


class AutenticationRepository:
    def __init__(self, db: Session):
        self.db = db
        logger.info("AutenticationRepository initialized.")

    def get_by_id(self, user_token: str) -> Optional[dict]:
        logger.info(f"Attempting to get authentication entry by user token: {user_token}")
        auth_entry = self.db.query(AutenticationDto).filter(AutenticationDto.id == user_token).first()
        if auth_entry:
            logger.info(f"Authentication entry found for user token: {user_token}")
            return {
                "id": auth_entry.id,
                "user_agent": auth_entry.user_agent,
                "ip": auth_entry.ip,
                "created_at": auth_entry.created_at.isoformat()
            }
        logger.info(f"No authentication entry found for user token: {user_token}")
        return None

    def insert(self, user_token: str, user_agent: str, ip: str) -> None:
        logger.info(f"Inserting new authentication entry for user token: {user_token}")
        new_auth_entry = AutenticationDto(
            id=user_token,
            user_agent=user_agent,
            ip=ip
        )
        self.db.add(new_auth_entry)
        self.db.commit()
        self.db.refresh(new_auth_entry)
        logger.info(f"Authentication entry for {user_token} inserted successfully.")

    def remove(self, user_token: str) -> None:
        logger.info(f"Attempting to remove authentication entry for user token: {user_token}")
        auth_entry = self.db.query(AutenticationDto).filter(AutenticationDto.id == user_token).first()
        if auth_entry:
            self.db.delete(auth_entry)
            self.db.commit()
            logger.info(f"Authentication entry for {user_token} removed successfully.")
        else:
            logger.warning(f"No authentication entry found for user_token: {user_token} to remove.")
