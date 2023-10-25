from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from routers.router_users import user_router
from routers.router_technology import technology_router
from routers.routers_tutorials import tutorial_router
from routers.routers_quiz import quiz_router
from routers.routers_assessments import assessment_router
from routers.routers_enrolled import enrollment_router
from routers.routers_quizquestions import qquestion_router
from routers.mycourses import mycourses_router
from routers.router_assessmentquestions import assessment_question_router
from routers.router_assessment_files import assessment_file_router
from routers.quiz_marking import quiz_marking_router
from routers.routers_quiz_attempts import quiz_attempt_router
from routers.router_assessment_attempt import assessment_attempt_router
origins = [
    'http://localhost:3000'
]
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(technology_router)
app.include_router(tutorial_router)
app.include_router(quiz_router)
app.include_router(assessment_router)
app.include_router(user_router)
app.include_router(enrollment_router)
app.include_router(mycourses_router)
app.include_router(qquestion_router)
app.include_router(assessment_question_router)
app.include_router(assessment_file_router)
app.include_router(quiz_marking_router)
app.include_router(quiz_attempt_router)
app.include_router(assessment_attempt_router)



@app.get('/')
async def root():
    return{"welcome" : "Admin"}