from sqlalchemy import MetaData, Table, Column, Integer, Boolean,String, DateTime, ARRAY, insert, select, update, delete, ForeignKey, UniqueConstraint
from config import get_engine
from datetime import datetime
from fastapi import APIRouter, HTTPException
import json
from utils import quiz_toJSON, quizcard_toJSON
from pydantic import BaseModel
from typing import List
from models.models_technology import technology_table
from models.models_quiz import metadata_obj, quiz_table

class Create_Quiz(BaseModel):
    tech_id : int
    quiz_id : int
    quiz_name :str
    creator : int

class Delete_Quiz(BaseModel):
    quiz_id : int

class Toggle(BaseModel):
    quiz_id:int
    active: bool


quiz_router = APIRouter(tags=["quiz"], responses={404:{"description" : "Not found"}}, prefix="/admin")
engine = get_engine()
now = datetime.now()
metadata_obj.create_all(engine)

# #CRUD Codes
#Create
@quiz_router.post('/createquiz')
async def create_quiz(quiz : Create_Quiz):
    res = []
    stmt = insert(quiz_table).values(
        technology_id = quiz.tech_id,
        quiz_id = quiz.quiz_id,
        quiz_name = quiz.quiz_name,
        is_active = True,
        is_deleted = False,
        created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        created_by = quiz.creator
    )
    compiled = stmt.compile()
    try:
        with engine.connect() as conn:
            res = conn.execute(stmt)
            conn.commit()
    except:
        raise HTTPException(status_code=500, detail="Database Error")
    return res

#Read
@quiz_router.get('/getallquizzes')
async def get_quiz(techid :int):
    res = []
    stmt = select(quiz_table).where(quiz_table.c.is_deleted == False).where(quiz_table.c.technology_id == techid)
    try:
        with engine.begin() as conn:
            for row in conn.execute(stmt):
                res.append(row)
        
        return quiz_toJSON(res)
    except:
        raise HTTPException(status_code=500, detail="Database Error")

@quiz_router.get('/getallquizcards')
async def get_quiz(techid :int):
    res = []
    stmt = select(quiz_table.c.technology_id, quiz_table.c.quiz_name, quiz_table.c.quiz_id, quiz_table.c.is_active,quiz_table.c.created_by).where(quiz_table.c.is_deleted == False, quiz_table.c.technology_id == techid).group_by(quiz_table.c.quiz_name, quiz_table.c.technology_id, quiz_table.c.quiz_id, quiz_table.c.created_by)
    try:
        with engine.begin() as conn:
            for row in conn.execute(stmt):
                res.append(row)
        
            return quizcard_toJSON(res)
    except:
        raise HTTPException(status_code=500, detail="Database Error")

# Delete
@quiz_router.post('/deletequiz')
async def delete_quiz(quiz : Delete_Quiz):
    stmt = update(quiz_table).where( quiz_table.c.quiz_id == quiz.quiz_id ).values(is_deleted = True, deleted_at = datetime.now(), updated_at= datetime.now(), is_active = False)
    try:
        with engine.begin() as conn:
            return conn.execute(stmt)
    except:
        raise HTTPException(status_code=500, detail="Database Error")

#Activate/Deactivate
@quiz_router.post('toggle/activity')
async def toggle_activity(quiz : Toggle):
    stmt = update(quiz_table).where(quiz_table.c.quiz_id == quiz.quiz_id).values(is_active = quiz.active, updated_at = datetime.now())
    try:
        with engine.begin() as conn:
            return conn.execute(stmt)
    except:
        raise HTTPException(status_code=500, detail="Database Error")
            
