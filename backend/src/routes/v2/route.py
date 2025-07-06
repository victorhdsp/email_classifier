from fastapi import APIRouter

from src.routes.v2.analyze.route import analyze_router
from src.routes.v2.sse.route import sse_router

v2_router = APIRouter(prefix="/v2", tags=["Versão 2"])


@v2_router.get("/health")
async def health_check():
    return {"status": "ok"}


v2_router.include_router(analyze_router)
v2_router.include_router(sse_router)
