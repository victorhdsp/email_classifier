import uvicorn

from src.shared.builder.app_builder import create_app
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Creating FastAPI application...")
app = create_app()
logger.info("FastAPI application created.")

if __name__ == "__main__":
    logger.info("Starting Uvicorn server...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
