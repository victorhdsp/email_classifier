from fastapi import APIRouter

from src.api.v1.email_analysis.route import email_analysis_router

v1_router = APIRouter(prefix="/v1")


@v1_router.get("/health")
async def health_check():
    return {"status": "ok"}


v1_router.include_router(email_analysis_router)
