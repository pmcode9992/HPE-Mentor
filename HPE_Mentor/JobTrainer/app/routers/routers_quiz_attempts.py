from typing import List
from sqlalchemy import insert, select
from fastapi import APIRouter
from utils import quiz_scoretoJSON
from config import get_engine
from fastapi import HTTPException
from datetime import datetime
from pydantic import BaseModel
from models.models_quiz_attempts import metadata_obj, quiz_attempt_table




class Record_Attempt(BaseModel):
    quiz_id : int
    user_id : int
    scored: int
    max: int
    wrong_ans: List[int]



quiz_attempt_router = APIRouter(tags=["attempt"], responses={404:{"description" : "Not found"}}, prefix="")
engine = get_engine()
now = datetime.now()
metadata_obj.create_all(engine)

#Record Attempt
@quiz_attempt_router.post('/record/quiz/attempt')
async def record_quiz_attempt(e : Record_Attempt):
    stmt = insert(quiz_attempt_table).values(
        user_id = e.user_id,
        attempt_date = datetime.now().strftime("%Y-%m-%d"),
        quiz_id = e.quiz_id,
        score = e.scored,
        max_score = e.max,
        wrong_ans = e.wrong_ans
    )
    try:
        with engine.begin() as conn:
            return conn.execute(stmt)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database Error / ID might already exist")

#Get Score
@quiz_attempt_router.get("/get/score")
async def get_quiz_score(userid : int, quizid : int):
    results = []
    stmt = select(quiz_attempt_table.c.score, quiz_attempt_table.c.max_score, quiz_attempt_table.c.wrong_ans).where(quiz_attempt_table.c.user_id == userid, quiz_attempt_table.c.quiz_id == quizid)
    try:
        with engine.connect() as conn:
            for row in conn.execute(stmt):
                results.append(row)
            return quiz_scoretoJSON(results)[0]
    except:
        raise HTTPException(status_code=500, detail="Datbase Error")
    
@quiz_attempt_router.get("/get/score")
async def get_quiz_score(userid : int, quizid : int):
    results = []
    stmt = select(quiz_attempt_table.c.score, quiz_attempt_table.c.max_score, quiz_attempt_table.c.wrong_ans).where(quiz_attempt_table.c.user_id == userid, quiz_attempt_table.c.quiz_id == quizid)
    try:
        with engine.connect() as conn:
            for row in conn.execute(stmt):
                results.append(row)
            return quiz_scoretoJSON(results)[0]
    except:
        raise HTTPException(status_code=500, detail="Datbase Error")