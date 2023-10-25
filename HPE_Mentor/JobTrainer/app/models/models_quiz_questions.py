from sqlalchemy import MetaData, Table, Column, Integer,String, ARRAY, ForeignKey
from models.models_quiz import quiz_table


metadata_obj = MetaData()
quiz_qs_table = Table(
    "quiz_questions", metadata_obj,
    Column("quiz_id", Integer,ForeignKey(quiz_table.c.quiz_id), primary_key=True,nullable= False),
    Column("question_id", Integer,primary_key=True ,unique=True, nullable= False),
    Column("question", String, nullable=False),
    Column("options", ARRAY(String), nullable=False),
    Column("correct_option", String, nullable=True),
)
