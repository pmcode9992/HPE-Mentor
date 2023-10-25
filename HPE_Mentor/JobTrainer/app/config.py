from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()
URI = os.getenv('DATABASE_URI')

def get_engine():
    engine = create_engine(URI,echo= True)
    return engine

