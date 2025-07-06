import asyncio
from asyncio import Queue

from src.dependences import create_data_use_case
from src.routes.v2.sse.route import user_queues
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)


class ProcessingQueueService:
    def __init__(self):
        self.queue = Queue()
        self.worker_task = None
        logger.info("ProcessingQueueService initialized.")

    async def start_worker(self):
        logger.info("Starting processing queue worker.")

        async def worker():
            while True:
                user_token, loading_data = await self.queue.get()
                logger.info(f"Processing data for user {user_token}, ID: {loading_data.id}")
                sse_queue = user_queues.get(user_token)
                
                if not sse_queue:
                    logger.warning(f"No SSE queue found for user {user_token}, skipping data.")

                try:
                    full_content = await create_data_use_case.execute(user_token, loading_data)
                    logger.info(f"Data processed successfully for user {user_token}, ID: {loading_data.id}")
                    
                    if sse_queue:
                        sse_queue.put_nowait(full_content.__dict__)
                        logger.info(f"SSE data sent for user {user_token}, ID: {loading_data.id}")
                except Exception as e:
                    logger.error(f"Error processing data for user {user_token}, ID: {loading_data.id}: {e}")
                    if sse_queue:
                        try:
                            sse_queue.put_nowait({"error": str(e)})
                            logger.info(f"Error message sent via SSE for user {user_token}, ID: {loading_data.id}")
                        except asyncio.QueueFull:
                            logger.warning(f"Queue for user {user_token} is full, skipping error message for ID: {loading_data.id}.")
                finally:
                    self.queue.task_done()
                    logger.info(f"Finished processing data for user {user_token}, ID: {loading_data.id}.")
        
        self.worker_task = asyncio.create_task(worker())

    async def enqueue(self, user_token, loading_data):
        logger.info(f"Enqueuing data for user {user_token}, ID: {loading_data.id}")
        await self.queue.put((user_token, loading_data))
        logger.info(f"Data enqueued for user {user_token}, ID: {loading_data.id}")

processing_queue_service = ProcessingQueueService()