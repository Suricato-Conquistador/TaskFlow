import os

import bcrypt
from fastapi import FastAPI, APIRouter, HTTPException
from bson.objectid import ObjectId 
from database.models import User
from database.schemas import all_users
from connection import users 

app = FastAPI()
router = APIRouter()

@router.get("/users/")
async def get_all_users():
    data = users.find({"is_deleted": False})
    return all_users(data)

@router.post("/user/")
async def create_user(new_user: User):
    try:
        response = users.insert_one(dict(new_user))
        return {"status_code": 200, "id": str(response.inserted_id)}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}") 

@router.put("/user/{user_id}")
async def update_user(user_id: str, updated_user: User):
    try:
        id = ObjectId(user_id)
        existing_doc = users.find_one({"id": id, "is_deleted": False})
        if not existing_doc:
            return HTTPException(status_code=404, detail=f"User does not exist") 
        response = users.update_one({"id": id}, {"$set": dict(updated_user)})
        return {"status_code": 200, "message": "User updated successfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Some error occured {e}") 

@router.delete("/user/{user_id}")
async def delete_user(user_id: str):
    try:
        id = ObjectId(user_id)
        existing_doc = users.find_one({"id": id, "is_deleted": False})
        if not existing_doc:
            return HTTPException(status_code=404, detail=f"User does not exist")
        response = users.delete_one({"id": id})
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

