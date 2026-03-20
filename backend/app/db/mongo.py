from pymongo import MongoClient
from app.core.config import MONGO_URL, DB_NAME, COLLECTION_NAME

client = MongoClient(MONGO_URL)
db = client[DB_NAME]
superhero_collection = db[COLLECTION_NAME]
