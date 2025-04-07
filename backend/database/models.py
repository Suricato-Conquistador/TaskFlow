from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class Status(Enum):
    NOTSTARTED = 0
    STARTED = 1
    COMPLETED = 2

class Task(BaseModel):
    title: str
    description: str
    status: Status

class User(BaseModel):
    name: str
    email: str
    password: str
