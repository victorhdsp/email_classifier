from fastapi import APIRouter

from src.routes.health_doc import health_check_doc
from src.routes.v1.analyze.route import analyze_router

v1_router = APIRouter(prefix="/v1")


@v1_router.get("/health", **health_check_doc)
async def health_check():
    return {"status": "ok"}


v1_router.include_router(analyze_router)
