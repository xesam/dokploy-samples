from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
import time
import os

from database import connect_to_mongo, close_mongo_connection, get_database
from models import ItemCreate, ItemUpdate, ItemInDB, HealthResponse
from config import get_settings

start_time = time.time()
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title="Dokploy FastAPI 示例",
    description="异步 API + MongoDB 示例项目",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health_check():
    db = get_database()
    try:
        await db.command("ping")
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return HealthResponse(
        status="healthy" if db_status == "connected" else "unhealthy",
        timestamp=datetime.utcnow().isoformat(),
        database=db_status,
        uptime=time.time() - start_time
    )


@app.get("/items", response_model=list[ItemInDB])
async def list_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    name: str | None = None
):
    db = get_database()
    query = {}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}

    items = []
    cursor = db.items.find(query).skip(skip).limit(limit).sort("created_at", -1)
    async for item in cursor:
        item["id"] = str(item.pop("_id"))
        items.append(ItemInDB(**item))
    return items


@app.get("/items/{item_id}", response_model=ItemInDB)
async def get_item(item_id: str):
    db = get_database()
    item = await db.items.find_one({"_id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="物品不存在")
    item["id"] = str(item.pop("_id"))
    return ItemInDB(**item)


@app.post("/items", response_model=ItemInDB, status_code=201)
async def create_item(item: ItemCreate):
    db = get_database()
    now = datetime.utcnow()
    item_dict = item.model_dump()
    item_dict.update({
        "created_at": now,
        "updated_at": now
    })
    result = await db.items.insert_one(item_dict)
    item_dict["id"] = str(result.inserted_id)
    return ItemInDB(**item_dict)


@app.put("/items/{item_id}", response_model=ItemInDB)
async def update_item(item_id: str, item_update: ItemUpdate):
    db = get_database()
    existing = await db.items.find_one({"_id": item_id})
    if not existing:
        raise HTTPException(status_code=404, detail="物品不存在")

    update_data = {k: v for k, v in item_update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="没有提供更新数据")

    update_data["updated_at"] = datetime.utcnow()
    await db.items.update_one({"_id": item_id}, {"$set": update_data})

    updated = await db.items.find_one({"_id": item_id})
    updated["id"] = str(updated.pop("_id"))
    return ItemInDB(**updated)


@app.delete("/items/{item_id}")
async def delete_item(item_id: str):
    db = get_database()
    result = await db.items.delete_one({"_id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="物品不存在")
    return {"message": "物品已删除", "id": item_id}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.port)