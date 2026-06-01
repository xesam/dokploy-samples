# 06 - Cron Job（定时任务）

演示 Dokploy 部署后台定时任务服务，无需暴露 HTTP 端口，通过容器日志观察运行状态。

## 技术栈

- Node.js + TypeScript
- node-cron（任务调度）

## 预置任务

| 任务名 | 调度规则 | 说明 |
|--------|---------|------|
| `healthCheck` | 每分钟 | 检查系统健康状态（CPU / 内存 / 磁盘） |
| `heartbeat` | 每 30 分钟 | 发送心跳 ping |
| `backup` | 每 6 小时 | 模拟数据备份 |
| `dailyReport` | 每天 08:00 | 生成每日报告 |
| `cleanup` | 每天 02:00 | 清理临时文件 |

## 环境变量

```bash
cp .env.example .env
```

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `LOG_LEVEL` | 日志级别 | `info` |

## 本地验证

```bash
npm install
npm run dev
```

启动后立即可在控制台看到任务注册日志，`healthCheck` 任务约 1 分钟后首次触发。

### 预期输出示例

```
🚀 启动 Cron 任务调度器...

   📋 注册任务: heartbeat (*/30 * * * *)
   📋 注册任务: dailyReport (0 8 * * *)
   ...

✅ 所有任务已注册

[2024-01-01T08:00:00.000Z] ⏰ 任务开始: healthCheck
   🔍 检查系统健康状态...
   🖥️  CPU: 23.5%
   💿 内存: 45.2%
[2024-01-01T08:00:00.001Z] ✅ 任务完成: healthCheck
```

## 验证要点

| 检查项 | 预期结果 |
|--------|---------|
| 启动日志 | 列出 5 个已注册任务及其 cron 表达式 |
| 1 分钟后 | `healthCheck` 任务触发，输出系统状态指标 |
| 容器持续运行 | 进程不退出，定时触发任务 |

## Dokploy 部署

- **Build Path**: `/06-cron-job`
- **无需暴露端口**
- **无需数据库**
- 通过 Dokploy 的日志面板查看任务执行记录
