from sqlalchemy import insert, update, select
from fastapi import APIRouter
from config import get_engine
from fastapi import HTTPException
from datetime import datetime
from pydantic import BaseModel
from models.models_enrolled import metadata_obj, enrollment_table


class Enroll_Student(BaseModel):
    e_id : int
    tech_id : int
    user_id : int


enrollment_router = APIRouter(tags=["enroll"], responses={404:{"description" : "Not found"}}, prefix="")
engine = get_engine()
now = datetime.now()
metadata_obj.create_all(engine)

#Enroll User
@enrollment_router.post('/enroll')
async def enroll_user(e : Enroll_Student):
    stmt = insert(enrollment_table).values(
        enrollment_id = e.e_id,
        user_id = e.user_id,
        enrollment_date = datetime.now().strftime("%Y-%m-%d"),
        technology_id = e.tech_id
    )
    try:
        with engine.begin() as conn:
            return conn.execute(stmt)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database Error / ID might already exist")
