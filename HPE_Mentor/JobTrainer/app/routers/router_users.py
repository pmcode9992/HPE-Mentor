from sqlalchemy import insert, update, select
from fastapi import APIRouter
from config import get_engine
from datetime import datetime
from fastapi import HTTPException
from utils import user_toJSON
from pydantic import BaseModel
from models.models_user import metadata_obj, user_table
from models.models_enrolled import enrollment_table
from models.models_quiz_attempts import quiz_attempt_table
from routers.mycourses import get_courses
from models.models_assessment_attempts import assessment_attempt_table

class Create_User(BaseModel):
    user_id: int
    role : int
    first_name : str
    last_name : str


user_router = APIRouter(tags=["user"], responses={404:{"description" : "Not found"}}, prefix="/admin")

engine = get_engine()
now = datetime.now()

metadata_obj.create_all(engine)

#Create New User
@user_router.post('/user/create')
async def create_user(user : Create_User):
    stmt = insert(user_table).values(
        user_id = user.user_id,
        created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        is_active = True,
        is_deleted = False,
        first_name = user.first_name,
        last_name = user.last_name,
        role = user.role
    )
    try:
        with engine.begin() as conn:
            return conn.execute(stmt)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database Error / ID might already exist")

@user_router.get('/user/getdets')
async def get_user_details(userid :int):
    results = []
    stmt = select(user_table.c.role).where(user_table.c.user_id == userid)
    try:
        with engine.connect() as conn:
            for row in conn.execute(stmt):
                for i in row:
                    results.append(i)
            if results[0]==1:
                results[0] = "ADMIN"
            elif results[0] ==2:
                results[0] = "USER"
        stmt = select(enrollment_table).where(enrollment_table.c.user_id == userid)
        with engine.connect() as conn:
            for row in conn.execute(stmt):
                results.append(row)
        # results = mycoursestoJSON(results)
        techids = []
        stmt1 = select(enrollment_table.c.technology_id).where(enrollment_table.c.user_id == userid)
        with engine.connect() as conn:
            for row in conn.execute(stmt1):
                for i in row:
                    techids.append(i)
        stmt2 = select(quiz_attempt_table.c.quiz_id).where(quiz_attempt_table.c.user_id == userid)
        quizids = []
        with engine.connect() as conn:
            for row in conn.execute(stmt2):
                for i in row:
                    quizids.append(i)
        res = {"user_id": userid,"role": results[0], "enrollments":techids, "quiz_attempts": quizids}
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail ="User does not exist")
    
@user_router.get('/all/users')
async def get_all_users():
    res = []
    stmt = select(user_table).where(user_table.c.role == 2)
    with engine.connect() as conn:
        for row in conn.execute(stmt):
            res.append(row)
    
    return user_toJSON(res)
