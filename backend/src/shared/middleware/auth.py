import hashlib
import uuid

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from src.dependences import autentication_service
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)

def generate_token(ip: str, user_agent: str) -> str:
    base = f"{ip}-{user_agent}-{uuid.uuid4()}"
    generated_token = hashlib.sha256(base.encode()).hexdigest()
    logger.info(f"Generated new token for IP: {ip}, User-Agent: {user_agent}")
    return generated_token

class AutenticationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        token = request.cookies.get("user_token")
        ip = request.client.host if request.client else "unknown_ip"
        user_agent = request.headers.get("user-agent", "")

        if not token:
            logger.info("No user token found in cookies. Generating new token.")
            token = generate_token(ip, user_agent)
            autentication_service.newUser(
                user_token=token,
                user_agent=user_agent,
                ip=ip,
            )
        
        validUser = autentication_service.verifyUser(
            user_token=token,
            user_agent=user_agent,
            ip=ip,
        )

        if not validUser:
            logger.warning("Existing user token is invalid. Generating new token.")
            token = generate_token(ip, user_agent)
            autentication_service.newUser(
                user_token=token,
                user_agent=user_agent,
                ip=ip,
            )

        request.state.user_token = token
        logger.debug(f"User token set in request state: {token}")

        response: Response = await call_next(request)

        response.set_cookie(
            key="user_token",
            value=token,
            max_age=60*60*24*30,  # 30 dias
            httponly=True,
            samesite="none",
            secure=True if request.url.scheme == "https" else False,
        )
        logger.info(f"User token cookie set for token: {token}")
        return response