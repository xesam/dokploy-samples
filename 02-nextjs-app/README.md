# 02 - Next.js 全栈应用

演示 Dokploy 部署 Next.js 14 应用，包含 SSR 页面和 API Routes，支持多环境配置。

## 技术栈

- Next.js 14 + TypeScript
- API Routes（无数据库，使用 mock 数据）

## 环境变量

```bash
cp .env.example .env
```

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `APP_ENV` | 环境标识 | `production` |
| `NEXT_PUBLIC_APP_NAME` | 应用名称 | `Dokploy Next.js App` |
| `NEXT_PUBLIC_VERSION` | 版本号 | `1.0.0` |

## 本地验证

```bash
npm install
npm run dev
```

服务启动后访问 http://localhost:3000。

### API 端点

```bash
# 获取 Hello 信息
curl http://localhost:3000/api/hello

# 获取用户列表
curl http://localhost:3000/api/users

# 创建用户
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"测试用户","email":"test@example.com"}'
```

## 验证要点

| 检查项 | 预期结果 |
|--------|---------|
| 首页 SSR | 页面正常渲染，显示应用名称 |
| `GET /api/hello` | 返回环境变量 `APP_ENV` 和时间戳 |
| `GET /api/users` | 返回 4 个 mock 用户列表 |
| `POST /api/users` | 返回 `201`，携带新用户对象 |

## Dokploy 部署

- **Build Path**: `/02-nextjs-app`
- **端口**: 3000
- **无需数据库**
