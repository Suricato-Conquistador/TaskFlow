from fastapi import FastAPI, APIRouter, HTTPException
from configurations import tasks 
from database.schemas import all_tasks
from database.models import Task
from bson.objectid import ObjectId 

app = FastAPI()
router = APIRouter()

@router.get("/tasks")
async def get_all_tasks():
    data = tasks.find({"is_deleted": False})
    return all_tasks(data)

@router.post("/task")
async def create_task(new_task: Task):
    try:
        response = tasks.insert_one(dict(new_task))
        return {"status_code": 200, "id": str(response.inserted_id)}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}") 

@router.put("/task/{task_id}")
async def update_task(task_id: str, updated_task: Task):
    try:
        id = ObjectId(task_id)
        existing_doc = tasks.find_one({"id": id, "is_deleted": False})
        if not existing_doc:
            return HTTPException(status_code=404, detail=f"Task does not exist") 
        response = tasks.update_one({"id": id}, {"$set": dict(updated_task)})
        return {"status_code": 200, "message": "Task updated successfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}") 

@router.delete("/task/{task_id}")
async def delete_task(task_id: str):
    try:
        id = ObjectId(task_id)
        existing_doc = tasks.find_one({"id": id, "is_deleted": False})
        if not existing_doc:
            return HTTPException(status_code=404, detail=f"Task does not exist")
        response = tasks.delete_one({"id": id})
        return {"status_code": 200, "message": "Task deleted successfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}") 

app.include_router(router)
