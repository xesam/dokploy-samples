# 01 - 静态网站

演示 Dokploy 部署纯静态网站（HTML + CSS + JS），通过 Nginx 提供服务。

## 技术栈

- HTML / CSS / JavaScript
- Nginx（Docker 镜像）

## 本地验证

```bash
docker build -t static-website .
docker run -p 8080:80 static-website
```

浏览器打开 http://localhost:8080，页面加载后点击"获取服务器信息"按钮，确认交互正常。

## 验证要点

| 检查项 | 预期结果 |
|--------|---------|
| 页面加载 | 显示"欢迎使用 Dokploy"标题 |
| 按钮交互 | 点击"获取服务器信息"返回数据 |
| 访问计数 | 刷新页面，底部计数递增 |

## Dokploy 部署

- **Build Path**: `/01-static-website`
- **端口**: 80
- **无需数据库**
