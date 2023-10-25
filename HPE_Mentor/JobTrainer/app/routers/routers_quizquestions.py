from sqlalchemy import MetaData, Table, Column, Integer, Boolean,String, DateTime, ARRAY, insert, select, update, delete, ForeignKey, UniqueConstraint
from config import get_engine
from datetime import datetime
from fastapi import APIRouter, HTTPException
import json
from utils import qquestion_toJSON, quiz_solutions, quizcard_toJSON, quiz_questions
from pydantic import BaseModel
from typing import List
from models.models_technology import technology_table
from models.models_quiz import quiz_table
from models.models_quiz_questions import metadata_obj, quiz_qs_table


class Quiz_Questions(BaseModel):
    quiz_id : int
    question_id : int
    question : str
    options : List[str]
    correct_option : str
    creator : int

class Delete_Question(BaseModel):
    quiz_id : int
    question_id : int

qquestion_router = APIRouter(tags=["qquestions"], responses={404:{"description" : "Not found"}}, prefix="/admin")
engine = get_engine()
now = datetime.now()
metadata_obj.create_all(engine)

#CRUD Codes
#Create
@qquestion_router.post('/create_question')
async def create_quiz(quiz : Quiz_Questions):
    res = None
    stmt = insert(quiz_qs_table).values(
        quiz_id = quiz.quiz_id,
        question = quiz.question,
        question_id = quiz.question_id,
        options = quiz.options,
        correct_option = quiz.correct_option,
    )
    compiled = stmt.compile()
    with engine.connect() as conn:
        res = conn.execute(stmt)
        conn.commit()
    return res

#Read
@qquestion_router.get('/quiz/questions')
async def get_quiz(quizid: int):
    res = []
    stmt = select(quiz_qs_table).where(quiz_qs_table.c.quiz_id == quizid)
    try:
        with engine.begin() as conn:
            for row in conn.execute(stmt):
                res.append(row)
            return qquestion_toJSON(res)
    except:
        raise HTTPException(status_code=500, detail="Database Error")
    

# Delete
@qquestion_router.post('/deletequestion')
async def delete_quiz(quiz : Delete_Question):
    stmt = delete(quiz_qs_table).where(quiz_qs_table.c.quiz_id == quiz.quiz_id , quiz_qs_table.c.question_id == quiz.question_id)
    try:
        with engine.begin() as conn:
            return conn.execute(stmt)
    except:
        raise HTTPException(status_code=500, detail="Database Error")
    
#Get Quiz
@qquestion_router.get('/get/quiz/questions')
async def get_questions(quizid :int):
    res = []
    stmt = select(quiz_qs_table.c.question_id,quiz_qs_table.c.question,quiz_qs_table.c.options).where(quiz_qs_table.c.quiz_id == quizid)
    try:
        with engine.begin() as conn:
            for row in conn.execute(stmt):
                res.append(row)
        
        return quiz_questions(res)
    except:
        raise HTTPException(status_code=500, detail="Database Error")
    
#Get Solutions
@qquestion_router.get('/get/quiz/solution')
async def get_questions(quizid :int):
    res = []
    stmt = select(quiz_qs_table.c.question_id,quiz_qs_table.c.question, quiz_qs_table.c.options, quiz_qs_table.c.correct_option).where(quiz_qs_table.c.quiz_id == quizid)
    try:
        with engine.begin() as conn:
            for row in conn.execute(stmt):
                res.append(row)
        
        return quiz_solutions(res)
    except:
        raise HTTPException(status_code=500, detail="Database Error")

    
