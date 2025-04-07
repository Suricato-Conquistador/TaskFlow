def document_task(task):
    return {
        "id": str(task["id"]),
        "title": str(task["title"]),
        "description": str(task["description"]),
        "status": str(task["status"])
    }

def all_tasks(tasks):
    return [document_task(task) for task in tasks]

def document_user(user):
    return {
        "id": str(user["id"]),
        "name": str(user["name"]),
        "email": str(user["email"]),
        "password": str(user["password"])
    }

def all_users(users):
    return [document_user(user) for user in users]
