import asyncio
import json

from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import StreamingResponse

from src.routes.v2.sse.sse_doc import sse_endpoint_doc

user_queues: dict[str, asyncio.Queue] = {}

sse_router = APIRouter()


@sse_router.get("/sse", **sse_endpoint_doc)
async def sse_endpoint(request: Request):
    user_token = getattr(request.state, "user_token", "")
    if not user_token or user_token.strip() == "":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não autenticado.")

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
