from fastapi import APIRouter

from src.routes.health_doc import health_check_doc
from src.routes.v1.analyze.route import analyze_router
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)

v1_router = APIRouter(prefix="/v1", tags=["Versão 1"])


@v1_router.get("/health", **health_check_doc)
async def health_check():
    logger.info("Health check requested.")
    return {"status": "ok"}


v1_router.include_router(analyze_router)
