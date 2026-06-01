# 03 - Express + PostgreSQL

演示 Dokploy 部署 Express RESTful API，使用 Prisma ORM 连接 PostgreSQL，包含完整的用户和文章 CRUD。

## 技术栈

- Express + TypeScript
- PostgreSQL + Prisma ORM

## 环境变量

```bash
cp .env.example .env
```

| 变量 | 说明 | 示例 |
|------|------|------|
| `DATABASE_URL` | PostgreSQL 连接串 | `postgresql://postgres:postgres@localhost:5432/dokploy_express` |
| `PORT` | 监听端口 | `3000` |
| `NODE_ENV` | 运行环境 | `development` |

## 本地验证（Docker Compose）

```bash
docker-compose up
```

服务启动后访问 http://localhost:3000。

### 本地开发（无 Docker）

```bash
npm install
npm run prisma:migrate   # 初始化数据库表
npm run dev
```

### API 端点

```bash
# 健康检查（含数据库连通性）
curl http://localhost:3000/api/health

# 创建用户
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"测试用户","age":25}'

# 获取用户列表
curl http://localhost:3000/api/users

# 获取单个用户
curl http://localhost:3000/api/users/1

# 创建文章
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"第一篇文章","content":"内容...","authorId":1}'

# 获取文章列表
curl http://localhost:3000/api/posts
```

## 验证要点

| 检查项 | 预期结果 |
|--------|---------|
| `GET /api/health` | `{"status":"healthy","database":"connected"}` |
| `POST /api/users` | 返回 `201`，数据持久化到 PostgreSQL |
| `GET /api/users` | 返回用户列表，含关联文章 |
| 重复邮箱 | 返回 `400`，提示邮箱已被使用 |

## Dokploy 部署

- **Build Path**: `/03-express-postgres`
- **端口**: 3000
- **需要 Dokploy 托管的 PostgreSQL 数据库**
