from fastapi import FastAPI, APIRouter, HTTPException
from configurations import tasks, users 
from database.schemas import all_tasks, all_users
from database.models import Task, User
from bson.objectid import ObjectId
import bcrypt

app = FastAPI()
router = APIRouter()

#Task routes
@router.get("/tasks/")
async def get_all_tasks():
    data = tasks.find({"is_deleted": False})
    return all_tasks(data)

@router.get("/tasksByUser/{owner_id}")
async def get_tasks_by_user(owner_id: str):
    data = tasks.find({"is_deleted": False, "owner": owner_id})
    return all_tasks(data)

@router.post("/task/")
async def create_task(new_task: Task):
    try:
        task_dict = new_task.model_dump()
        existing_owner = users.find_one({"_id": ObjectId(task_dict["owner"])})
        if not existing_owner:
            return HTTPException(status_code=404, detail=f"Owner does not exist")
        task_dict["status"] = new_task.status.value
        response = tasks.insert_one(dict(task_dict))
        response2 = users.update_one({"_id": ObjectId(task_dict["owner"])}, {"$push": {"tasks": ObjectId(response.inserted_id)}})
        return {"status_code": 200, "_id": str(response.inserted_id)}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}")

@router.put("/task/{task_id}")
async def update_task(task_id: str, updated_task: Task):
    try:
        id = ObjectId(task_id)
        task_dict = updated_task.model_dump()
        existing_doc = tasks.find_one({"_id": id, "is_deleted": False})
        if not existing_doc:
            return HTTPException(status_code=404, detail=f"Task does not exist")
        existing_owner = users.find_one({"_id": ObjectId(existing_doc["owner"])})
        if not existing_owner:
            return HTTPException(status_code=404, detail=f"Owner does not exist")
        task_dict["status"] = updated_task.status.value
        response = tasks.update_one({"_id": id}, {"$set": dict(task_dict)})
        return {"status_code": 200, "message": "Task updated successfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}") 

@router.delete("/task/{task_id}")
async def delete_task(task_id: str):
    try:
        id = ObjectId(task_id)
        existing_doc = tasks.find_one({"_id": id, "is_deleted": False})
        if not existing_doc:
            return HTTPException(status_code=404, detail=f"Task does not exist")
        existing_user = users.find_one({"_id": ObjectId(existing_doc["owner"])})
        response2 = users.update_one({"_id": ObjectId(existing_doc["owner"])}, {"$pull": {"tasks": id}})
        response = tasks.delete_one({"_id": id})
        return {"status_code": 200, "message": "Task deleted successfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}") 


#User routes
@router.get("/users/")
async def get_all_users():
    data = users.find({"is_deleted": False})
    return all_users(data)

@router.post("/user/")
async def create_user(new_user: User):
    try:
        user_dict = new_user.model_dump()
        hashed = bcrypt.hashpw(user_dict["password"].encode("utf-8"), bcrypt.gensalt())
        user_dict["password"] = hashed.decode("utf-8")
        response = users.insert_one(user_dict)
        return {"status_code": 200, "_id": str(response.inserted_id)}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}") 

@router.put("/user/{user_id}")
async def update_user(user_id: str, updated_user: User):
    try:
        id = ObjectId(user_id)
        user_dict = updated_user.model_dump()
        existing_doc = users.find_one({"_id": id, "is_deleted": False})
        if not existing_doc:
            return HTTPException(status_code=404, detail=f"User does not exist")

        if not bcrypt.checkpw(user_dict["password"].encode("utf-8"), existing_doc["password"].encode("utf-8")):
            hashed = bcrypt.hashpw(user_dict["password"].encode("utf-8"), bcrypt.gensalt())
            user_dict["password"] = hashed.decode("utf-8")

        response = users.update_one({"_id": id}, {"$set": dict(user_dict)})
        return {"status_code": 200, "message": "User updated successfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}") 

@router.delete("/user/{user_id}")
async def delete_user(user_id: str):
    try:
        id = ObjectId(user_id)
        existing_doc = users.find_one({"_id": id, "is_deleted": False})
        if not existing_doc:
            return HTTPException(status_code=404, detail=f"User does not exist")
        response = tasks.delete_many({"is_deleted": False, "owner": id})
        response2 = users.delete_one({"_id": id})
        return {"status_code": 200, "message": "User deleted successfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}") 

@router.post("/login")
async def login(login: str, password: str):
    try:
        user = users.find_one({"email": login, "is_deleted": False})

        if not user:
            return HTTPException(status_code=403, detail=f"Invalid credentials") 
        
        pw = password.encode("utf-8")

        if verifyUser(login, pw, user):
            return {"status_code": 200, "message": "Login successfull"}
        else:
            return HTTPException(status_code=403, detail=f"Invalid credentials")

    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}")

def verifyUser(login: str, hash: str, user: User):
    return login == user["email"] and bcrypt.checkpw(hash, user["password"].encode("utf-8"))

#Apagar todos os dados
@router.delete("/clear")
async def clear_database():
    response = tasks.delete_many({})
    response2 = users.delete_many({})
    return {"status_code": 200, "message": f"Apagadas {response.deleted_count} tasks e {response2.deleted_count} users"}

app.include_router(router)
