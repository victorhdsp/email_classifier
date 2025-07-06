import asyncio
from asyncio import Queue

from src.dependences import create_data_use_case


class ProcessingQueueService:
    def __init__(self):
        self.queue = Queue()
        self.worker_task = None

    async def start_worker(self):
        async def worker():
            while True:
                user_token, loading_data = await self.queue.get()
                try:
                    await create_data_use_case.execute(user_token, loading_data)
                finally:
                    self.queue.task_done()
        
        self.worker_task = asyncio.create_task(worker())

    async def enqueue(self, user_token, loading_data):
        await self.queue.put((user_token, loading_data))

processing_queue_service = ProcessingQueueService()