
from sqlalchemy import insert, select, update, delete
from config import get_engine
from datetime import datetime
from fastapi import APIRouter, HTTPException
from utils import technology_toJSON
from pydantic import BaseModel
from models.models_technology import metadata_obj, technology_table

class Create_Tech(BaseModel):
    technology_name: str
    technology_id : int
    creator : int

class Delete_Tech(BaseModel):
    technology_id: int

# class Enroll_Student(BaseModel):
#     tech_id : int
#     user_id: int


technology_router = APIRouter(tags=["technology"], responses={404: {"description" : "Not found"}},prefix='/admin')


engine = get_engine()
now = datetime.now()
metadata_obj.create_all(engine)

#Create New Technology
@technology_router.post('/create/technology')
async def add_technology(tech : Create_Tech):
    stmt = insert(technology_table).values(
        technology_id = tech.technology_id,
        created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        technology_name = tech.technology_name,
        is_active = True,
        is_deleted = False,
        created_by = tech.creator
    )
    try:
        with engine.begin() as conn:
            return conn.execute(stmt)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Datbase Error")

#Read All Technologies
@technology_router.get("/read/technology/all")
async def get_technologys():
    results = []
    stmt = select(technology_table).where(technology_table.c.is_deleted == False)
    try:
        with engine.connect() as conn:
            for row in conn.execute(stmt):
                results.append(row)
            return technology_toJSON(results)
    except:
        raise HTTPException(status_code=500, detail="Datbase Error")
    
#Read Technology By ID
@technology_router.get("/read/technology/byID")
async def get_technologys(techid : int):
    results = []
    stmt = select(technology_table).where(technology_table.c.technology_id == techid)
    try:
        with engine.connect() as conn:
            for row in conn.execute(stmt):
                results.append(row)
            return technology_toJSON(results)
    except:
        raise HTTPException(status_code=500, detail="Datbase Error")

#Delete Technology
@technology_router.post('/technology/delete')
async def delete_technology_by_name(tech : Delete_Tech):
    result = None
    delete_val = select(technology_table.c.deleted_at).where(technology_table.c.technology_id == tech.technology_id)
    with engine.begin() as conn:
        for row in conn.execute(delete_val):
            result = row
    if(result[0] == None):
        stmt = update(technology_table).where(technology_table.c.technology_id == tech.technology_id).values(deleted_at = datetime.now()).values(updated_at = datetime.now()).values(is_deleted = True).values(is_active = False)
        with engine.begin() as conn:
            return conn.execute(stmt)
    else:
        return {"Message": "Already Deleted"}

#Deactivate Technology
@technology_router.get('technology/is_active/toggle')
async def deactive_technology(techid: int, is_active:bool):
    stmt = update(technology_table).where(technology_table.c.technology_id == techid).values(is_active= is_active)
    try:
        with engine.begin() as conn:
            return conn.execute(stmt)
    except:
        raise HTTPException(status_code=500, detail="Datbase Error")
#Get Tech name
@technology_router.get('technology/getname')
async def get_technology_name(techid: int):
    stmt = select(technology_table.c.technology_name).where(technology_table.c.technology_id == techid)
    try:
        with engine.connect() as conn:
            for row in  conn.execute(stmt):
                for i in row:
                    return i
    except:
        raise HTTPException(status_code=500, detail="Datbase Error")

# #Read
# @technology_router.get("/gettechnology")
# async def get_technology_by_name(sname):
#     results = []
#     stmt = select(technology_table).where(technology_table.c.technology_name == sname).where(technology_table.c.deleted_at == None)
#     print(stmt)
#     with engine.connect() as conn:
#         for row in conn.execute(stmt):
#             results.append(row)
#     print(technology_toJSON(results))
#     return technology_toJSON(results)