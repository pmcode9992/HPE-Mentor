from sqlalchemy import Table, Column, MetaData, Boolean, Integer, String, DateTime,ForeignKey
from models.models_technology import technology_table
from models.models_user import user_table

metadata_obj = MetaData()
tutorial_table = Table(
    "tutorial", metadata_obj,
    Column("technology_id", Integer,ForeignKey(technology_table.c.technology_id), primary_key= True,nullable=False),
    Column("created_at",DateTime, nullable=False),
    Column("updated_at",DateTime),
    Column("deleted_at",DateTime),
    Column("is_active",Boolean, nullable=False),
    Column("is_deleted",Boolean, nullable=False),
    Column("topic_id", Integer,primary_key=True, nullable= False),
    Column("topic_name", String, nullable=False),
    Column("links", String),
    Column("created_by", Integer, ForeignKey(user_table.c.user_id),nullable=False)
)

