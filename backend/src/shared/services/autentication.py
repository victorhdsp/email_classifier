
from sqlalchemy.orm import Session

from src.shared.repositories.autentication import AutenticationRepository
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)


class AutenticationService:
    def __init__(self, db: Session):
        self.repository = AutenticationRepository(db)
        logger.info("AutenticationService initialized.")

    def newUser(
        self,
        user_token: str,
        user_agent: str,
        ip: str,
    ) -> None:
        logger.info(f"Attempting to create new user: {user_token} from IP: {ip}")
        self.repository.insert(user_token, user_agent, ip)
        logger.info(f"New user {user_token} created successfully.")

    def verifyUser(
        self,
        user_token: str,
        user_agent: str,
        ip: str,
    ) -> bool:
        logger.info(f"Attempting to verify user: {user_token} from IP: {ip}")
        user_data = self.repository.get_by_id(user_token)
        if not user_data:
            logger.warning(f"User {user_token} not found in database.")
            return False
        
        if user_data["user_agent"] == user_agent and user_data["ip"] == ip:
            logger.info(f"User {user_token} verified successfully.")
            return True
        else:
            logger.warning(f"User {user_token} verification failed: User-Agent or IP mismatch.")
            return False
    