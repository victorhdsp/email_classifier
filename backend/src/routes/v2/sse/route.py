import asyncio
import json

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse

user_queues: dict[str, asyncio.Queue] = {}

sse_router = APIRouter()

@sse_router.get(
    "/sse",
    summary="Servidor de Eventos de Streaming (SSE)",
    description="Endpoint para receber eventos de streaming via Server-Sent Events (SSE).",
    responses={
        401: {
            "description": "Usuário não autenticado.",
            "content": {
                "application/json": {
                    "example": {"detail": "Usuário não autenticado."}
                }
            },
        },
    },
)
async def sse_endpoint(request: Request):
    user_token = getattr(request.state, "user_token", "")
    if not user_token or user_token.strip() == "":
            raise HTTPException(status_code=401, detail="Usuário não autenticado.")

    queue = asyncio.Queue()
    user_queues[user_token] = queue

    async def event_stream():
        try:
            while True:
                if await request.is_disconnected():
                    break

                data = await queue.get()
                yield f"data: {json.dumps(data)}\n\n"
        finally:
            user_queues.pop(user_token, None)

    return StreamingResponse(event_stream(), media_type="text/event-stream")
