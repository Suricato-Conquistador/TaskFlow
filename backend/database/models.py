from pydantic import BaseModel, validator
from datetime import datetime
from enum import Enum
from typing import List


class Status(Enum):
    NOTSTARTED = 0
    STARTED = 1
    COMPLETED = 2


class Task(BaseModel):
    owner: str
    title: str
    description: str
    status: Status = Status.NOTSTARTED
    is_deleted: bool = False
    updated_at: int = int(datetime.timestamp(datetime.now()))
    created_at: int = int(datetime.timestamp(datetime.now()))
    
    @validator("status", pre=True)
    def convert_status_int(cls, value):
        if isinstance(value, int):
            return Status(value)
        return value


class User(BaseModel):
    name: str
    email: str
    password: str
    tasks: List[str] = []
    is_deleted: bool = False
    updated_at: int = int(datetime.timestamp(datetime.now()))
    created_at: int = int(datetime.timestamp(datetime.now()))
