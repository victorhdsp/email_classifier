
from sqlalchemy.orm import Session

from src.shared.repositories.autentication import AutenticationRepository


class AutenticationService:
    def __init__(self, db: Session):
        self.repository = AutenticationRepository(db)

    def newUser(
        self,
        user_token: str,
        user_agent: str,
        ip: str,
    ) -> None:
        self.repository.insert(user_token, user_agent, ip)

    def verifyUser(
        self,
        user_token: str,
        user_agent: str,
        ip: str,
    ) -> bool:
        user_data = self.repository.get_by_id(user_token)
        if not user_data:
            return False
        return user_data["user_agent"] == user_agent and user_data["ip"] == ip
    