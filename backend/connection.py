import os

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGODB_URI = os.environ["MONGODB_URI"]

client = MongoClient(MONGODB_URI)

db = client.taskflow
tasks = db["tasks"]
users = db["users"]

#Para TESTE
#for db_name in client.list_database_names():
#    print(db_name)

client.close()
