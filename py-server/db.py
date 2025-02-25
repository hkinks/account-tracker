import os

from sqlalchemy import create_engine, Column, Integer, String, Numeric
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
load_dotenv()

# Database connection
db_url = os.getenv("DB_URL")
engine = create_engine(db_url)
SessionLocal = sessionmaker(engine)

if __name__ == '__main__':
    print(db_url)