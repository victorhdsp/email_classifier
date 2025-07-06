from typing import Optional

from sqlalchemy.orm import Session

from src.shared.models.autentication_dto import AutenticationDto


class AutenticationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_token: str) -> Optional[dict]:
        auth_entry = self.db.query(AutenticationDto).filter(AutenticationDto.id == user_token).first()
        if auth_entry:
            return {
                "id": auth_entry.id,
                "user_agent": auth_entry.user_agent,
                "ip": auth_entry.ip,
                "created_at": auth_entry.created_at.isoformat()
            }
        return None

    def insert(self, user_token: str, user_agent: str, ip: str) -> None:
        new_auth_entry = AutenticationDto(
            id=user_token,
            user_agent=user_agent,
            ip=ip
        )
        self.db.add(new_auth_entry)
        self.db.commit()
        self.db.refresh(new_auth_entry)

    def remove(self, user_token: str) -> None:
        auth_entry = self.db.query(AutenticationDto).filter(AutenticationDto.id == user_token).first()
        if auth_entry:
            self.db.delete(auth_entry)
            self.db.commit()
        else:
            print(f"[AutenticationRepository] No entry found for user_token: {user_token}")
