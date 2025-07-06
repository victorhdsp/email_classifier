from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.dependences import db, FRONTEND_URL
from src.routes.route import api_router
from src.shared.middleware.auth import AutenticationMiddleware
from src.shared.middleware.error import generic_exception_handler
from src.shared.services.processing_queue import processing_queue_service

openapi_tags = [
    {
        "name": "Versão 1",
        "description": "Endpoints da versão 1 da API, incluindo análise de e-mails sincronas.",
    },
    {
        "name": "Versão 2",
        "description": "Endpoints da versão 2 da API, incluindo análise de e-mails assíncronas com SSE.",
    },
]


class AppBuilder:
    def __init__(self) -> None:
        self.app = FastAPI(
            title="API de Classificação de E-mail",
            description="API para classificar e analisar o conteúdo de e-mails, determinando se são produtivos ou não.",
            version="1.0.0",
            contact={
                "name": "Suporte",
                "email": "suporte@example.com",
            },
            openapi_tags=openapi_tags,
        )
        self.processing_queue_service = processing_queue_service

    def with_routes(self, routes: APIRouter) -> "AppBuilder":
        self.app.include_router(routes)
        return self

    def with_middleware(self) -> "AppBuilder":
        self.app.add_middleware(AutenticationMiddleware)
        return self

    def with_exception_handlers(self) -> "AppBuilder":
        self.app.add_exception_handler(Exception, generic_exception_handler)
        return self

    def with_cors(self) -> "AppBuilder":
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=[FRONTEND_URL.split(",")],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        return self

    def with_queue(self) -> "AppBuilder":
        @asynccontextmanager
        async def lifespan(app: FastAPI):
            await self.processing_queue_service.start_worker()
            yield
        self.app.router.lifespan_context = lifespan
        return self

    def build(self) -> FastAPI:
        return self.app


def create_app() -> FastAPI:
    db.create_tables()
    app_builder = AppBuilder()

    app = app_builder\
        .with_exception_handlers()\
        .with_cors()\
        .with_middleware()\
        .with_routes(api_router)\
        .with_queue()\
        .build()

    return app