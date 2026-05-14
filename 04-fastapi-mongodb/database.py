from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config import get_settings

settings = get_settings()

client: AsyncIOMotorClient = None
db: AsyncIOMotorDatabase = None


async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    print(f"✅ MongoDB 连接成功: {settings.database_name}")


async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("MongoDB 连接已关闭")


def get_database() -> AsyncIOMotorDatabase:
    return db