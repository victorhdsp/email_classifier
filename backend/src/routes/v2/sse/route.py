import asyncio
import json

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse

user_queues: dict[str, asyncio.Queue] = {}

sse_router = APIRouter()

@sse_router.get("/sse")
async def sse_endpoint(request: Request):
    user_token = request.query_params.get("user_token")
    if not user_token:
        raise HTTPException(400, "Missing user_token")

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
            del user_queues[user_token]

    return StreamingResponse(event_stream(), media_type="text/event-stream")
