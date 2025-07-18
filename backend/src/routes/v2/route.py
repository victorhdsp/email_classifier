from fastapi import APIRouter

from src.routes.health_doc import health_check_doc
from src.routes.v2.analyze.route import analyze_router
from src.routes.v2.sse.route import sse_router
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)

v2_router = APIRouter(prefix="/v2", tags=["Versão 2"])


@v2_router.get("/health", **health_check_doc)
async def health_check():
    logger.info("Health check requested for V2.")
    return {"status": "ok"}


v2_router.include_router(analyze_router)
v2_router.include_router(sse_router)
