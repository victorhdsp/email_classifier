from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.route import api_router
from src.shared.infra.database.database import Base, engine
from src.shared.middleware.error import generic_exception_handler


class AppBuilder:
    def __init__(self) -> None:
        self.app = FastAPI()

    def with_routes(self, routes: APIRouter) -> "AppBuilder":
        self.app.include_router(routes)
        return self

    def with_exception_handlers(self) -> "AppBuilder":
        self.app.add_exception_handler(Exception, generic_exception_handler)
        return self

    def with_cors(self) -> "AppBuilder":
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        return self

    def build(self) -> FastAPI:
        return self.app


def create_app() -> FastAPI:
    Base.metadata.create_all(bind=engine)  # Create database tables

    app_builder = AppBuilder()

    app = app_builder.\
        with_exception_handlers()\
        .with_cors()\
        .with_routes(api_router)\
        .build()

    return app
