from typing import List

def document_task(task):
    return {
        "_id": str(task["_id"]),
        "owner": str(task["owner"]),
        "title": str(task["title"]),
        "description": str(task["description"]),
        "status": str(task["status"])
    }

def all_tasks(tasks):
    return [document_task(task) for task in tasks]

def document_user(user):
    return {
        "_id": str(user["_id"]),
        "name": str(user["name"]),
        "email": str(user["email"]),
        "password": str(user["password"]),
        "tasks": [str(task) for task in user["tasks"]]
    }

def all_users(users):
    return [document_user(user) for user in users]
