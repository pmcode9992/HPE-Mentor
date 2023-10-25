from sqlalchemy import Table, Column, MetaData, Boolean, Integer, String, DateTime, ForeignKey
from models.models_roles import roles_table


metadata_obj = MetaData()
user_table = Table(
    "users", metadata_obj,
    Column("user_id", Integer, primary_key= True,nullable=False, unique=True),
    Column("role", Integer,ForeignKey(roles_table.c.role),nullable=False, default=(2)),
    Column("created_at",DateTime, nullable=False),
    Column("updated_at",DateTime),
    Column("deleted_at",DateTime),
    Column("is_active",Boolean, nullable=False),
    Column("is_deleted",Boolean, nullable=False),
    Column("first_name", String, nullable= False),
    Column("last_name", String)
    )
