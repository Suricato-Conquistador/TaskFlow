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
        task_dict["status"] = new_task.status.value
        response = tasks.insert_one(dict(task_dict))
        response2 = users.insert_one({"owner": {"$push": task_dict["_id"]}}) #Testar se funciona assim o operator push 
        return {"status_code": 200, "_id": str(response.inserted_id)}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}") 

@router.put("/task/{task_id}")
async def update_task(task_id: str, updated_task: Task):
    try:
        id = ObjectId(task_id)
        existing_doc = tasks.find_one({"_id": id, "is_deleted": False})
        if not existing_doc:
            return HTTPException(status_code=404, detail=f"Task does not exist") 
        response = tasks.update_one({"_id": id}, {"$set": dict(updated_task)})
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
        #Delete the _id in tasks field of users collection
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
        response = users.insert_one(dict(new_user))
        return {"status_code": 200, "_id": str(response.inserted_id)}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}") 

@router.put("/user/{user_id}")
async def update_user(user_id: str, updated_user: User):
    try:
        id = ObjectId(user_id)
        existing_doc = users.find_one({"_id": id, "is_deleted": False})
        if not existing_doc:
            return HTTPException(status_code=404, detail=f"User does not exist") 
        response = users.update_one({"_id": id}, {"$set": dict(updated_user)})
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
        response = users.delete_one({"_id": id})
        return {"status_code": 200, "message": "User deleted successfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}") 

@router.post("/login")
async def login(login: str, password: str):
    try:
        pw = password.encode("utf-8")
        salt = bcrypt.gensalt()
        hash = bcrypt.hashpw(pw, salt)

        user = users.find_one({"name": user, "is_deleted": False})
        if not user:
            return HTTPException(status_code=404, detail=f"User does not exist") 
        
        if verifyUser(login, hash, user):
            return {"status_code": 200, "message": "Login successfull"}
        else:
            return HTTPException(status_code=403, detail=f"Invalid credentials")

    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}")

def verifyUser(login: str, hash: str, user: User):
    print(login == user["name"])
    print(login == user["email"])
    bcrypt.checkpw(user.password, hash)
    return login == user["name"] or login == user["email"] and bcrypt.checkpw(user.password, hash)

app.include_router(router)
