from sqlalchemy import MetaData, Table, Column, Integer, String, Boolean, DateTime, ARRAY, ForeignKey, insert, select, update, delete
from utils import assessment_attempttoJSON
from config import get_engine
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from models.models_assessment_attempts import metadata_obj, assessment_attempt_table
import os

assessment_attempt_router = APIRouter(tags=["assessment/attempt"], responses={404:{"description" : "Not found"}}, prefix="")
engine = get_engine()
now = datetime.now()
metadata_obj.create_all(engine)

class Session(BaseModel):
    assessment_id : int
    user_id : int



@assessment_attempt_router.post('/create/attempt')
async def create_attempt(session : Session):
    res = None
    stmt = insert(assessment_attempt_table).values(
        assessment_id = session.assessment_id,
        user_id = session.user_id,
        attempt_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        attempt_id = int(str(session.user_id)+str(session.assessment_id))
    )
    try:
        with engine.begin() as conn:
            res = conn.execute(stmt)
            return res
    except: 
        raise HTTPException(status_code=500, detail="Database Error")

@assessment_attempt_router.post('/viewedsolution')
async def viewed_solution(userid: int, assessmentid: int):
    res = None
    stmt = update(assessment_attempt_table).where(assessment_attempt_table.c.user_id ==userid, assessment_attempt_table.c.assessment_id == assessmentid).values(viewed_solution = True)
    try:
        with engine.begin() as conn:
            res = conn.execute(stmt)
            return res
    except: 
        raise HTTPException(status_code=500, detail="Database Error")

@assessment_attempt_router.post('/submit/attempt')
async def submit_attempt(userid: int, assessmentid: int):
    res = None
    stmt = update(assessment_attempt_table).where(assessment_attempt_table.c.user_id ==userid, assessment_attempt_table.c.assessment_id == assessmentid).values(submitted = True, submitted_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    try:
        with engine.begin() as conn:
            res = conn.execute(stmt)
            return res
    except: 
        raise HTTPException(status_code=500, detail="Database Error")


@assessment_attempt_router.get('/get/attempt/data')
async def get_attempt(userid: int, assessmentid:int):
    res = []
    stmt = select(assessment_attempt_table).where(assessment_attempt_table.c.assessment_id == assessmentid, assessment_attempt_table.c.user_id == userid)
    try:
        with engine.begin() as conn:
            for row in conn.execute(stmt):
                res.append(row)
        return assessment_attempttoJSON(res)[0]
    except:
        raise HTTPException(status_code=500, detail="Database Error")
    


