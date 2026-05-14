# Dokploy Samples

展示 Dokploy 平台各种功能的示例项目集合。

## 项目列表

### 01 - 静态网站
- **技术栈**: HTML + CSS + JavaScript + Nginx
- **演示功能**: 静态网站部署、自动 HTTPS、自定义域名

### 02 - Next.js 全栈应用
- **技术栈**: Next.js 14 + TypeScript
- **演示功能**: SSR、API Routes、环境变量、多环境部署

### 03 - Express + PostgreSQL
- **技术栈**: Express + TypeScript + PostgreSQL + Prisma
- **演示功能**: RESTful API、数据库集成、ORM 迁移

### 04 - FastAPI + MongoDB
- **技术栈**: FastAPI + MongoDB + Motor
- **演示功能**: 异步 API、NoSQL 数据库、Swagger 文档

### 05 - Node.js Worker
- **技术栈**: Bull Queue + Redis + Express
- **演示功能**: 队列任务处理、多进程架构、任务监控

### 06 - Cron Job
- **技术栈**: Node.js + node-cron
- **演示功能**: 定时任务调度、日志管理

## 快速开始

### 方式 1：独立部署

每个项目可作为独立的 Dokploy 项目部署，使用同一个 Git 仓库：

```
Git 仓库: https://github.com/xesam/dokploy-samples
```

| 项目 | Build Path | 端口 |
|------|-----------|------|
| 01-static-website | /01-static-website | 80 |
| 02-nextjs-app | /02-nextjs-app | 3000 |
| 03-express-postgres | /03-express-postgres | 3000 |
| 04-fastapi-mongodb | /04-fastapi-mongodb | 8000 |
| 05-node-worker | /05-node-worker | 3000 |
| 06-cron-job | /06-cron-job | - |

详细部署说明请查看 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### 方式 2：本地开发

```bash
# Express + PostgreSQL
cd 03-express-postgres
docker-compose up

# FastAPI + MongoDB
cd 04-fastapi-mongodb
docker-compose up

# Node.js Worker
cd 05-node-worker
docker-compose up
```

## 项目结构

```
dokploy-samples/
├── 01-static-website/          # 静态网站
├── 02-nextjs-app/              # Next.js 应用
├── 03-express-postgres/        # Express + PostgreSQL
├── 04-fastapi-mongodb/         # FastAPI + MongoDB
├── 05-node-worker/             # Bull Queue + Redis
├── 06-cron-job/                # Cron 定时任务
├── docker-compose.yml          # 组合部署
├── DEPLOYMENT_GUIDE.md         # 部署指南
└── dokploy.yaml                # Dokploy 组合配置
```

## 技术栈覆盖

| 类别 | 技术 |
|------|------|
| 前端 | HTML, CSS, JavaScript, Next.js |
| 后端 | Express, FastAPI, Node.js Worker |
| 数据库 | PostgreSQL, MongoDB, Redis |
| 部署 | Docker, Dokploy |
| 任务 | Bull Queue, Cron |