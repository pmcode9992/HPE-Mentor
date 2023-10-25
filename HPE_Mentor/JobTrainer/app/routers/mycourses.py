from typing import List
from sqlalchemy import Table, Column, MetaData, Boolean, Integer, String, ARRAY, DateTime, ForeignKey,insert, update, select
from fastapi import APIRouter, HTTPException
from config import get_engine
from datetime import datetime
from models.models_enrolled import enrollment_table
from models.models_user import user_table
from models.models_technology import technology_table
from models.models_quiz import quiz_table
from models.models_assessments import assessment_table
from utils import myassessmenttoJSON, mycoursestoJSON, myquiztoJSON

mycourses_router = APIRouter(tags=["mycourses"], responses={404:{"description" : "Not found"}}, prefix="/admin")

engine = get_engine()
now = datetime.now()




    



#Enrolled Courses
@mycourses_router.get('user/mycourses')
async def get_courses(uid :int):
    results = []
    stmt = select(enrollment_table).where(enrollment_table.c.user_id == uid)
    with engine.connect() as conn:
        for row in conn.execute(stmt):
            results.append(row)
    # results = mycoursestoJSON(results)
    techids = []
    stmt1 = select(enrollment_table.c.technology_id).where(enrollment_table.c.user_id == uid)
    with engine.connect() as conn:
        for row in conn.execute(stmt1):
            for i in row:
                techids.append(i)
    res = []
    c =0
    for item in techids:
        stmt = select(technology_table.c.technology_name).where(technology_table.c.technology_id == item)
        with engine.connect() as conn:
            for row in conn.execute(stmt):
                for i in row:
                    res.append(i)
    return mycoursestoJSON(results, res)



@mycourses_router.post('user/myquizzes')
async def get_quizzes(techids : List[int]):
    res = []
    for item in techids:

        stmt = select(quiz_table.c.technology_id,quiz_table.c.is_active, quiz_table.c.quiz_id, quiz_table.c.quiz_name).where(quiz_table.c.technology_id == item, quiz_table.c.is_deleted == False)
        with engine.connect() as conn:
                for row in conn.execute(stmt):
                    res.append(row)
    return myquiztoJSON(res)



@mycourses_router.post('user/myassessments')
async def get_assessments(techids : List[int]):
    res = []
    for item in techids:

        stmt = select(assessment_table.c.technology_id,assessment_table.c.is_active, assessment_table.c.assessment_id, assessment_table.c.assessment_name).where(assessment_table.c.technology_id == item, assessment_table.c.is_deleted == False)
        with engine.connect() as conn:
                for row in conn.execute(stmt):
                    res.append(row)
    return myassessmenttoJSON(res)
