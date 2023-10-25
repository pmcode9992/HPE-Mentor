from sqlalchemy import MetaData, Table, Column, Integer, Boolean, String, DateTime, ARRAY, ForeignKey,insert, select, update, delete
from config import get_engine
from datetime import datetime
from fastapi import APIRouter, HTTPException
import json
from utils import technology_toJSON
from models.models_user import user_table
from pydantic import BaseModel


metadata_obj = MetaData()

technology_table = Table(
    "technology",
    metadata_obj,
    Column("technology_id", Integer, primary_key = True, nullable = False),
    Column("created_at",DateTime, nullable=False),
    Column("updated_at",DateTime),
    Column("deleted_at",DateTime),
    Column("is_active",Boolean, nullable=False),
    Column("is_deleted",Boolean, nullable=False),
    Column("technology_name", String, nullable = False),
    Column("created_by", Integer,ForeignKey(user_table.c.user_id), nullable=False)
)
