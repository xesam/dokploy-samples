# 05 - Node.js Worker（队列任务处理）

演示 Dokploy 双容器部署模式：API 容器接收任务请求，Worker 容器通过 Bull + Redis 异步处理任务。

## 技术栈

- Express + TypeScript（API 服务）
- Bull Queue + Redis（任务队列）
- 双 Dockerfile：`Dockerfile`（API）、`Dockerfile.worker`（Worker）

## 架构说明

```
客户端 → API 容器 → Redis 队列 → Worker 容器
                               ↳ emailQueue
                               ↳ processingQueue
                               ↳ reportQueue
```

## 环境变量

```bash
cp .env.example .env
```

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `REDIS_URL` | Redis 连接串 | `redis://localhost:6379` |
| `PORT` | API 监听端口 | `3000` |
| `NODE_ENV` | 运行环境 | `development` |

## 本地验证（Docker Compose）

```bash
docker-compose up
```

启动后包含：API 服务（:3000）、Worker 进程、Redis。

### 本地开发（无 Docker，需先启动 Redis）

```bash
npm install
npm run dev        # 终端 1：启动 API
npm run worker     # 终端 2：启动 Worker
```

### API 端点

```bash
# 健康检查
curl http://localhost:3000/health

# 提交邮件任务
curl -X POST http://localhost:3000/jobs/email \
  -H "Content-Type: application/json" \
  -d '{"to":"user@example.com","subject":"测试邮件","body":"邮件内容"}'

# 提交数据处理任务
curl -X POST http://localhost:3000/jobs/processing \
  -H "Content-Type: application/json" \
  -d '{"taskType":"data-transform","data":{"records":100}}'

# 提交报告任务
curl -X POST http://localhost:3000/jobs/report \
  -H "Content-Type: application/json" \
  -d '{"reportType":"monthly","dateRange":{"start":"2024-01-01","end":"2024-01-31"}}'

# 查询任务状态（queueName: email / processing / report）
curl http://localhost:3000/jobs/email/{jobId}

# 查看队列统计
curl http://localhost:3000/stats
```

## 验证要点

| 检查项 | 预期结果 |
|--------|---------|
| `GET /health` | `{"status":"running"}` |
| 提交任务 | 返回 `201` 及 `jobId` |
| 查询任务状态 | `state` 从 `waiting` → `completed` |
| Worker 日志 | 控制台输出任务处理记录 |
| `GET /stats` | 三个队列的任务计数统计 |

## Dokploy 部署

- **Build Path**: `/05-node-worker`
- **端口**: 3000（API 容器）
- **Worker 容器无需暴露端口**
- **需要 Dokploy 托管的 Redis**
- `dokploy.yaml` 中声明了两个容器：`api` 和 `worker`
