from fastapi import Request
from fastapi.responses import JSONResponse

from src.shared.utils.logger import get_logger

logger = get_logger(__name__)


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(f"Unexpected error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500, content={"detail": "Unknown internal error"}
    )
