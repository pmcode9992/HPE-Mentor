from sqlalchemy import MetaData, Table, Column, Integer, String, Boolean, DateTime, ForeignKey
from models.models_technology import technology_table
from models.models_user import user_table

metadata_obj = MetaData()
assessment_table = Table(
    "assessments", metadata_obj,
    Column("technology_id", Integer, ForeignKey(technology_table.c.technology_id),nullable=False),
    Column("created_at",DateTime, nullable=False),
    Column("updated_at",DateTime),
    Column("deleted_at",DateTime),
    Column("is_deleted",Boolean, nullable=False),
    Column("is_active",Boolean, nullable=False),
    Column("assessment_id", Integer,primary_key=True, nullable= False),
    Column("assessment_name", String, nullable= False),
    Column("created_by", Integer,ForeignKey(user_table.c.user_id), nullable=False)
)