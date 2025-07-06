import asyncio
from asyncio import Queue

from src.dependences import create_data_use_case
from src.routes.v2.sse.route import user_queues


class ProcessingQueueService:
    def __init__(self):
        self.queue = Queue()
        self.worker_task = None

    async def start_worker(self):
        async def worker():
            while True:
                user_token, loading_data = await self.queue.get()
                sse_queue = user_queues.get(user_token)
                
                if not sse_queue:
                    print(f"No SSE queue found for user {user_token}, skipping data.")

                try:
                    full_content = await create_data_use_case.execute(user_token, loading_data)
                    
                    if sse_queue:
                        sse_queue.put_nowait(full_content.__dict__)
                except Exception as e:
                    print(f"Error processing data for user {user_token}: {e}")
                    if sse_queue:
                        try:
                            sse_queue.put_nowait({"error": str(e)})
                        except asyncio.QueueFull:
                            print(f"Queue for user {user_token} is full, skipping error message.")
                finally:
                    self.queue.task_done()
        
        self.worker_task = asyncio.create_task(worker())

    async def enqueue(self, user_token, loading_data):
        await self.queue.put((user_token, loading_data))

processing_queue_service = ProcessingQueueService()