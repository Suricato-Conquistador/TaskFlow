import os

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()
IP = os.environ["IP"] #Não está atualizando o ip
USER = os.environ["USER"]
PASSWORD = os.environ["PASSWORD"]

mongo_uri = f"mongodb://{USER}:{PASSWORD}@54.175.105.224:27017"

client = MongoClient(mongo_uri, server_api=ServerApi('1'))

db = client.taskflow
tasks = db["tasks"]
users = db["users"]
