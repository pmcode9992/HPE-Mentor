from sqlalchemy import Table, Column, MetaData, Integer, String, DateTime, ForeignKey, ARRAY, Boolean
from models.models_user import user_table
from models.models_assessments import assessment_table

metadata_obj = MetaData()
assessment_attempt_table = Table(
    "assessment_attempt", metadata_obj,
    Column("attempt_id", Integer, primary_key=True),
    Column("attempt_date", DateTime, nullable=False),
    Column("submitted_at",DateTime),
    Column("submitted",Boolean, nullable=False, default=False),
    Column("viewed_solution",Boolean, nullable=False, default=False),
    Column("user_id", Integer, ForeignKey(user_table.c.user_id), nullable=False),
    Column("assessment_id", Integer, ForeignKey(assessment_table.c.assessment_id),nullable=False)
)
