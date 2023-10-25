from sqlalchemy import Table, Column, MetaData, Integer, String, DateTime, ForeignKey, ARRAY
from models.models_user import user_table
from models.models_quiz import quiz_table

metadata_obj = MetaData()
quiz_attempt_table = Table(
    "quiz_attempt", metadata_obj,
    Column("attempt_date", DateTime),
    Column("user_id", Integer, ForeignKey(user_table.c.user_id), primary_key=True, nullable=False),
    Column("quiz_id", Integer, ForeignKey(quiz_table.c.quiz_id),primary_key=True,nullable=False),
    Column("score", Integer),
    Column("max_score", Integer),
    Column("wrong_ans", ARRAY(Integer))
)
