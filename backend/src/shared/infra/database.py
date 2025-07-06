
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from src.shared.utils.logger import get_logger

logger = get_logger(__name__)

BASE = declarative_base()

class Database:
    def __init__(self, db_url: str):
        self.engine = create_engine(db_url)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        logger.info(f"Database initialized with URL: {db_url}")

    def create_tables(self):
        logger.info("Creating database tables.")
        BASE.metadata.create_all(bind=self.engine)
        logger.info("Database tables created.")

    def drop_tables(self):
        logger.info("Dropping database tables.")
        BASE.metadata.drop_all(bind=self.engine)
        logger.info("Database tables dropped.")

    def get_db(self):
        db = self.SessionLocal()
        logger.debug("Database session opened.")
        try:
            yield db
        finally:
            db.close()
            logger.debug("Database session closed.")