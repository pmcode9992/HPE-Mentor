from sqlalchemy import Table, Column, MetaData, Integer, String, DateTime, ForeignKey
from models.models_user import user_table
from models.models_technology import technology_table

metadata_obj = MetaData()
enrollment_table = Table(
    "enrollment", metadata_obj,
    Column("enrollment_id", Integer, primary_key= True,nullable=False, unique=True),
    Column("user_id", Integer, ForeignKey(user_table.c.user_id),nullable=False),
    Column("technology_id", Integer, ForeignKey(technology_table.c.technology_id),nullable=False,),
    Column("enrollment_date", DateTime),
    Column("progress", Integer, default=(0)),
    Column("grade", String)
    )
