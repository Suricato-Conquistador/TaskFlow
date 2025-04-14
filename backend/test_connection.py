import os

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
IP = os.environ["IP"] #Não está atualizando o ip
USER = os.environ["USER"]
PASSWORD = os.environ["PASSWORD"]

mongo_uri = f"mongodb://{USER}:{PASSWORD}@3.86.232.13:27017"

client = MongoClient(mongo_uri)

db = client.taskflow

#Para TESTE
# for db_name in client.list_database_names():
#     print(db_name)
# print("Connection realized successfully")

for col_name in db.list_collection_names():
    print(col_name)
print("Connection realized successfully")

client.close()
