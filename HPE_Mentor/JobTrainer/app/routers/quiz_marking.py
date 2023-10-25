from typing import List
from pydantic import BaseModel
from sqlalchemy import Table, Column, MetaData, Boolean, Integer, String, ARRAY, DateTime, ForeignKey,insert, update, select
from fastapi import APIRouter, HTTPException
from config import get_engine
from datetime import datetime
from models.models_enrolled import enrollment_table
from models.models_user import user_table
from models.models_technology import technology_table
from models.models_quiz import quiz_table
from models.models_quiz_questions import quiz_qs_table
from utils import mycoursestoJSON, myquiztoJSON

quiz_marking_router = APIRouter(tags=["quizmarking"], responses={404:{"description" : "Not found"}}, prefix="/admin")

engine = get_engine()
now = datetime.now()

class Attempt(BaseModel):
    question_id : int
    choice : str

class AttemptList(BaseModel):
     attempts : List[Attempt]


#Get Submittion
@quiz_marking_router.post('user/submit/quiz')
async def evaluate_attempt(attempt : AttemptList, quizid : int):
    res = []
    wrong_ans = []
    mark = 0
    for item in attempt:
        #Get correct ans
        stmt = select(quiz_qs_table.c.question_id,quiz_qs_table.c.correct_option).where(quiz_qs_table.c.quiz_id == quizid)
        with engine.connect() as conn:
                for row in conn.execute(stmt):
                    res.append(row)
        solution = {}
        max_mark = len(res)
        for item in res:
             solution[item[0]] = item[1]
        for i in attempt:
            for a in i[1]:
                if a.choice == solution[a.question_id]:
                      mark = mark + 1
                else:
                    wrong_ans.append(a.question_id)
                     
        
    return {"scored": mark, "max_mark":max_mark, "wrong_ans": wrong_ans}

#FROM DB
# [(1, 'Programming Language'), (3, 'Java is a platform-independent programming language'), (4, '.java')]
#FROM USER
# question_id=1 choice='Programming Language'
# question_id=4 choice='Wrong'