from sqlalchemy import MetaData, Table, Column, Integer, String, ForeignKey
from models.models_assessments import assessment_table

metadata_obj = MetaData()
assessment_question_table = Table(
    "assessment_questions", metadata_obj,
    Column("assessment_id", Integer,ForeignKey(assessment_table.c.assessment_id),unique=True,nullable= False),
    Column("question_loc", String, nullable= False),
    Column("solution_loc", String, nullable= False)
)

