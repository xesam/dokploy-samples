# 04 - FastAPI + MongoDB

演示 Dokploy 部署异步 Python API，使用 Motor 驱动连接 MongoDB，自带 Swagger 文档。

## 技术栈

- FastAPI + Python 3.11
- MongoDB + Motor（异步驱动）

## 环境变量

```bash
cp .env.example .env
```

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `MONGODB_URL` | MongoDB 连接串 | `mongodb://localhost:27017` |
| `DATABASE_NAME` | 数据库名称 | `dokploy_fastapi` |
| `PORT` | 监听端口 | `8000` |

## 本地验证（Docker Compose）

```bash
docker-compose up
```

服务启动后访问：
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 本地开发（无 Docker）

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### API 端点

```bash
# 健康检查（含数据库连通性）
curl http://localhost:8000/health

# 创建物品
curl -X POST http://localhost:8000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"示例物品","description":"这是一个测试物品","price":99.9,"quantity":10}'

# 获取物品列表（支持分页和名称过滤）
curl "http://localhost:8000/items?skip=0&limit=10"
curl "http://localhost:8000/items?name=示例"

# 更新物品
curl -X PUT http://localhost:8000/items/{item_id} \
  -H "Content-Type: application/json" \
  -d '{"price":88.8}'

# 删除物品
curl -X DELETE http://localhost:8000/items/{item_id}
```

## 验证要点

| 检查项 | 预期结果 |
|--------|---------|
| `GET /health` | `{"status":"healthy","database":"connected"}` |
| Swagger UI | http://localhost:8000/docs 可正常访问并测试接口 |
| `POST /items` | 返回 `201`，数据写入 MongoDB |
| `GET /items?name=示例` | 按名称模糊匹配过滤 |

## Dokploy 部署

- **Build Path**: `/04-fastapi-mongodb`
- **端口**: 8000
- **需要 Dokploy 托管的 MongoDB 数据库**
