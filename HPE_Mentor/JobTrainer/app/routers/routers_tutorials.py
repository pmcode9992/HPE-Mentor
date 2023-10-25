from sqlalchemy import Table, Column, MetaData, Boolean, Integer, String, ARRAY, DateTime,ForeignKey,insert, update, select, delete
from fastapi import APIRouter
from config import get_engine
from datetime import datetime
from models.models_technology import technology_table
from fastapi import HTTPException
from utils import tutorial_toJSON
from models.models_user import user_table
from typing import List
from models.models_tutorial import metadata_obj, tutorial_table

from pydantic import BaseModel

class Create_Tutorial(BaseModel):
    tut_name: str
    tut_id : int
    tech_id : int
    creator : int
    link : str


tutorial_router = APIRouter(tags=["tutorial"], responses={404:{"description" : "Not found"}}, prefix="/admin")

engine = get_engine()
now = datetime.now()

metadata_obj.create_all(engine)

# #CRUD CODES
# Create
@tutorial_router.post('/createtopic')
async def create_topic(tutorial : Create_Tutorial):
    res = None
    stmt = insert(tutorial_table).values(
        technology_id = tutorial.tech_id,
        topic_id = tutorial.tut_id,
        topic_name = tutorial.tut_name,
        created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        created_by = tutorial.creator,
        links = tutorial.link,
        is_active = True,
        is_deleted = False,
    )
    compiled = stmt.compile()
    try:
        with engine.connect() as conn:
            res = conn.execute(stmt)
            conn.commit()
            return res
    except:
        raise HTTPException(status_code=500, detail="Datbase Error")


#Read
@tutorial_router.get('/gettopics')
async def get_tutorials(techid :int):
    res = []
    stmt = select(tutorial_table).where(tutorial_table.c.is_deleted == False).where(tutorial_table.c.technology_id == techid)
    try:
        with engine.begin() as conn:
            for row in conn.execute(stmt):
                res.append(row)
            return tutorial_toJSON(res)
    except:
        raise HTTPException(status_code=500, detail="Datbase Error")

# # @tutorial_router.get('/topicsbytechnology')
# # async def topic_bytechnology(sname):
# #     res = []
# #     sid = getSID(sname)
# #     stmt = select(tutorial_table).where(tutorial_table.c.technology_id == sid).where(tutorial_table.c.deleted_at == None)
# #     with engine.begin() as conn:
# #         for row in conn.execute(stmt):
# #             res.append(row)
# #     return tutorial_toJSON(res)


# # def getSID(sname):
# #     getsid = select(technology_table.c.technology_id).where(technology_table.c.technology_name == sname)
# #     try:
# #         with engine.begin() as conn:
# #             result = conn.execute(getsid)
# #             row = result.fetchone()
# #             if row:
# #                 sid = row[0]
# #                 return sid
# #             else:
# #                 raise HTTPException(status_code=404, detail="technology not found")
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail="Database error")






# # #Update
# # @tutorial_router.post("/addlinks")
# # async def add_link(sname: str, tname: str, link: str):    
# #     #Get the technology_id based on technology name
# #     sid = getSID(sname)
# #     #Get the current list of links for the tutorial
# #     try:
# #         get_links_stmt = select(tutorial_table.c.links).where(
# #             tutorial_table.c.topic_name == tname
# #         ).where(tutorial_table.c.technology_id == sid)

# #         with engine.begin() as conn:
# #             result = conn.execute(get_links_stmt)
# #             row = result.fetchone()
# #             if row:
# #                 current_links = row[0] or []  # If links are None, initialize as an empty list
# #             else:
# #                 raise HTTPException(status_code=404, detail="Tutorial not found")
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail="Database error")

# #     #Append the new link and update the tutorial table
# #     try:
# #         updated_links = current_links + [link]  # Append the new link
# #         stmt = (
# #             update(tutorial_table)
# #             .where(tutorial_table.c.topic_name == tname)
# #             .where(tutorial_table.c.technology_id == sid)
# #             .values(links=updated_links)
# #         )
        
# #         with engine.begin() as conn:
# #             res = conn.execute(stmt)
# #             return {"message": "Link added successfully"}
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail="Database error")

#Delete
@tutorial_router.post('/deletetutorial')
async def delete_tutorial_by_name(tutid : int, techid: int):
    stmt = delete(tutorial_table).where(tutorial_table.c.technology_id == techid).where(tutorial_table.c.topic_id == tutid)
    try:
        with engine.begin() as conn:
            return conn.execute(stmt) 
    except:
        raise HTTPException(status_code=500, detail="Database error")
