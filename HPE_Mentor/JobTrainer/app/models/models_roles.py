from sqlalchemy import Table, Column, MetaData, Boolean, Integer, String
from fastapi import APIRouter
from config import get_engine
from datetime import datetime

metadata_obj = MetaData()
roles_table = Table(
    "roles", metadata_obj,
    Column("role", Integer,nullable=False, primary_key=True, default=(2)),
    Column("name", String,unique=True, nullable= False),
    )

user_router = APIRouter(tags=["roles"], responses={404:{"description" : "Not found"}})

engine = get_engine()
now = datetime.now()

metadata_obj.create_all(engine)
