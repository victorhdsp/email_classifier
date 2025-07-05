
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

BASE = declarative_base()

class Database:
    def __init__(self, db_url: str):
        self.engine = create_engine(db_url)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

    def create_tables(self):
        BASE.metadata.create_all(bind=self.engine)

    def drop_tables(self):
        BASE.metadata.drop_all(bind=self.engine)

    def get_db(self):
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()