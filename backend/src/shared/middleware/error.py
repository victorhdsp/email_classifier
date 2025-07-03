import logging

from fastapi import Request
from fastapi.responses import JSONResponse


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logging.error(f"Erro inesperado: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500, content={"detail": "Erro interno desconhecido"}
    )
