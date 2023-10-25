from sqlalchemy import  insert, select, update, delete
from pydantic import BaseModel
from config import get_engine
from datetime import datetime
from fastapi import APIRouter, HTTPException, UploadFile
from models.models_assessment_questions import metadata_obj, assessment_question_table
from routers.router_assessment_files import get_file, upload_file
import os

assessment_question_router = APIRouter(tags=["assessment/questions"], responses={404:{"description" : "Not found"}}, prefix="/admin")
engine = get_engine()
now = datetime.now()
metadata_obj.create_all(engine)

class Assessment(BaseModel):
    assessment_id : int
    question_loc : str
    solution_loc : str

#Create
@assessment_question_router.post('/problem/create')
async def create_problem(assessment : Assessment):
    res = None
    stmt = insert(assessment_question_table).values(
        assessment_id = assessment.assessment_id,
        question_loc = assessment.question_loc,
        solution_loc = assessment.solution_loc
    )
    compiled = stmt.compile()
    with engine.connect() as conn:
        res = conn.execute(stmt)
        conn.commit()
    return res

#Get Problem
@assessment_question_router.get('/problem/getsolution')
async def get_problem(assessment_id: int):
    res = ''
    stmt = select(assessment_question_table.c.question_loc).where(assessment_question_table.c.assessment_id == assessment_id)
    try:
        with engine.begin() as conn:
            for row in conn.execute(stmt):
                for i in row:
                    res = i
            return res
    except:
        raise HTTPException(status_code=500, detail="Database Error")

#Get Solution
@assessment_question_router.get('/problem/getproblem')
async def get_problem(assessment_id: int):
    res = ''
    stmt = select(assessment_question_table.c.solution_loc).where(assessment_question_table.c.assessment_id == assessment_id)
    try:
        with engine.begin() as conn:
            for row in conn.execute(stmt):
                for i in row:
                    res = i
            return res
            
    except:
        raise HTTPException(status_code=500, detail="Database Error")