from fastapi import APIRouter

from src.routes.v1.route import v1_router
from src.routes.v2.route import v2_router

api_router = APIRouter()

api_router.include_router(v1_router)
api_router.include_router(v2_router)
