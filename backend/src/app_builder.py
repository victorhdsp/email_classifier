from fastapi import APIRouter, FastAPI

from src.api.route import api_router


class AppBuilder:
    def __init__(self) -> None:
        self.app = FastAPI()

    def with_routes(self, routes: APIRouter) -> "AppBuilder":
        self.app.include_router(routes)
        return self

    def with_exception_handlers(self) -> "AppBuilder":
        from src.shared.middleware.error import generic_exception_handler

        self.app.add_exception_handler(Exception, generic_exception_handler)
        return self

    def build(self) -> FastAPI:
        return self.app


def create_app() -> FastAPI:
    app_builder = AppBuilder()

    app = app_builder.with_exception_handlers().with_routes(api_router).build()

    return app
