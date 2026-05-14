# Dokploy 部署指南 - 方式 1：独立部署

每个项目作为独立的 Dokploy 项目，使用同一个 Git 仓库，通过不同的 Build Path 构建。

---

## 项目 1: 静态 HTML 网站

```
项目名称: dokploy-static-website
Git 仓库: https://github.com/xesam/dokploy-samples
构建路径: /01-static-website
Dockerfile: Dockerfile
暴露端口: 80
```

**Dokploy 配置项:**
- `build.context`: `.`
- `build.dockerfile_path`: `./Dockerfile`

---

## 项目 2: Next.js 全栈应用

```
项目名称: dokploy-nextjs-app
Git 仓库: https://github.com/xesam/dokploy-samples
构建路径: /02-nextjs-app
Dockerfile: Dockerfile
暴露端口: 3000
```

**环境变量:**
```
NODE_ENV = production
NEXT_PUBLIC_VERSION = 1.0.0
```

---

## 项目 3: Express + PostgreSQL

```
项目名称: dokploy-express-postgres
Git 仓库: https://github.com/xesam/dokploy-samples
构建路径: /03-express-postgres
Dockerfile: Dockerfile
暴露端口: 3000
```

**环境变量:**
```
NODE_ENV = production
DATABASE_URL = <PostgreSQL连接字符串>
PORT = 3000
```

**数据库:** 需要先在 Dokploy 创建 PostgreSQL 数据库

---

## 项目 4: FastAPI + MongoDB

```
项目名称: dokploy-fastapi-mongodb
Git 仓库: https://github.com/xesam/dokploy-samples
构建路径: /04-fastapi-mongodb
Dockerfile: Dockerfile
暴露端口: 8000
```

**环境变量:**
```
MONGODB_URL = <MongoDB连接字符串>
DATABASE_NAME = dokploy_fastapi
PORT = 8000
```

**数据库:** 需要先在 Dokploy 创建 MongoDB 数据库

---

## 项目 5: Node.js Worker

```
项目名称: dokploy-node-worker
Git 仓库: https://github.com/xesam/dokploy-samples
构建路径: /05-node-worker
Dockerfile: Dockerfile
暴露端口: 3000
```

**环境变量:**
```
REDIS_URL = <Redis连接字符串>
PORT = 3000
```

**注意:** 这个项目包含 API 服务和 Worker，需要两个容器：
- API: Dockerfile (端口 3000)
- Worker: Dockerfile.worker (无端口)

**数据库:** 需要先在 Dokploy 创建 Redis 数据库

---

## 项目 6: Cron Job

```
项目名称: dokploy-cron-job
Git 仓库: https://github.com/xesam/dokploy-samples
构建路径: /06-cron-job
Dockerfile: Dockerfile
暴露端口: 无 (后台任务)
```

**环境变量:**
```
NODE_ENV = production
LOG_LEVEL = info
```

**注意:** 这是纯后台任务，不需要暴露端口

---

## 快速复制配置

| 项目 | Build Path | Dockerfile | 端口 | 必需数据库 |
|------|------------|------------|------|-----------|
| 01-static-website | /01-static-website | Dockerfile | 80 | - |
| 02-nextjs-app | /02-nextjs-app | Dockerfile | 3000 | - |
| 03-express-postgres | /03-express-postgres | Dockerfile | 3000 | PostgreSQL |
| 04-fastapi-mongodb | /04-fastapi-mongodb | Dockerfile | 8000 | MongoDB |
| 05-node-worker | /05-node-worker | Dockerfile | 3000 | Redis |
| 06-cron-job | /06-cron-job | Dockerfile | - | - |

---

## 部署步骤

1. 在 Dokploy 中创建新项目
2. 关联 Git 仓库
3. 设置构建路径 (Build Path)
4. 设置 Dockerfile 路径
5. 配置环境变量 (如需要)
6. 创建所需数据库 (PostgreSQL/MongoDB/Redis)
7. 配置域名 (可选)
8. 点击部署

---

## 验证部署

部署完成后，可通过以下方式验证：

- **项目 1**: 访问域名，应显示欢迎页面
- **项目 2**: 访问域名/api/hello，应返回 JSON
- **项目 3**: 访问 /api/health，应返回数据库连接状态
- **项目 4**: 访问 /health，应返回健康状态
- **项目 5**: 访问 /stats，应返回队列统计
- **项目 6**: 查看日志，应看到定时任务执行记录