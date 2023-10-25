from sqlalchemy import MetaData, Table, Column, Integer, String, Boolean, DateTime, ARRAY, ForeignKey, insert, select, update, delete
from config import get_engine
from datetime import datetime
from fastapi import APIRouter, HTTPException
from utils import problem_toJSON
from pydantic import BaseModel
from typing import List
from models.models_assessments import metadata_obj, assessment_table
import os

class Create_Test(BaseModel):
    tech_id :int
    assessment_id:int
    assessment_name : str
    creator : int

class Toggle(BaseModel):
    assessment_id:int
    active: bool

class Delete_Assessment(BaseModel):
    assessment_id : int

assessment_router = APIRouter(tags=["assessment"], responses={404:{"description" : "Not found"}}, prefix="/admin")
engine = get_engine()
now = datetime.now()
metadata_obj.create_all(engine)
assement_dir = "/Users/pranav/HP_Intern/JobTrainer/app/assessments"

#CRUD Codes
# Create
@assessment_router.post('/createtest')
async def create_problem(test : Create_Test):
    res = None
    stmt = insert(assessment_table).values(
        technology_id = test.tech_id,
        assessment_id = test.assessment_id,
        assessment_name= test.assessment_name,
        created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        created_by = test.creator,
        is_active = True,
        is_deleted = False,
    )
    compiled = stmt.compile()
    
    
    os.makedirs(os.path.join(assement_dir,str(test.assessment_id)), exist_ok=True)
    os.makedirs(os.path.join(assement_dir,str(test.assessment_id),"submissions"), exist_ok=True)

    try:
        with engine.connect() as conn:
            res = conn.execute(stmt)
            conn.commit()
        return res
    except:
        raise HTTPException(status_code=500, detail="Database Error")

#Read
@assessment_router.get('/getproblems')
async def get_problems(techid : int):
    res = []
    stmt = select(assessment_table).where(assessment_table.c.deleted_at == None, assessment_table.c.technology_id == techid)
    try:
        with engine.begin() as conn:
            for row in conn.execute(stmt):
                res.append(row)
            
        return problem_toJSON(res)
    except:
        raise HTTPException(status_code=500, detail="Database Error")

#Activate/Deactivate
@assessment_router.post('/assessment/activity')
async def toggle_activity(assessment : Toggle):
    stmt = update(assessment_table).where(assessment_table.c.assessment_id == assessment.assessment_id).values(is_active = assessment.active, updated_at = datetime.now())
    try:
        with engine.begin() as conn:
            return conn.execute(stmt)
    except:
        raise HTTPException(status_code=500, detail="Database Error")
    
# Delete
@assessment_router.post('/delete/assessment')
async def delete_assessment(assessment : Delete_Assessment):
    stmt = update(assessment_table).where( assessment_table.c.assessment_id == assessment.assessment_id ).values(is_deleted = True, deleted_at = datetime.now(), updated_at= datetime.now(), is_active = False)
    try:

        with engine.begin() as conn:
            return conn.execute(stmt)
        
    except:
        raise HTTPException(status_code=500, detail="Database Error")
    
