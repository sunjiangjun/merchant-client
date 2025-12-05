# 部署指南

## 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0

## 开发环境部署

### 1. 安装依赖

```bash
npm install
```

或使用 yarn:

```bash
yarn install
```

### 2. 配置环境变量

复制 `.env.example` 文件为 `.env.development`:

```bash
cp .env.example .env.development
```

修改 `.env.development` 中的配置：

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=YC365 商户管理系统 (开发)
VITE_APP_ENV=development
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 生产环境部署

### 1. 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录。

### 2. 配置生产环境变量

修改 `.env.production` 中的配置：

```env
VITE_API_BASE_URL=https://api.yc365.com/api
VITE_APP_TITLE=YC365 商户管理系统
VITE_APP_ENV=production
```

### 3. 部署到 Nginx

#### 配置示例

```nginx
server {
    listen 80;
    server_name merchant.yc365.com;

    root /var/www/merchant-client/dist;
    index index.html;

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_vary on;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend-server:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### HTTPS 配置

使用 Let's Encrypt 获取免费 SSL 证书：

```bash
certbot --nginx -d merchant.yc365.com
```

### 4. 使用 Docker 部署

#### Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 构建和运行

```bash
# 构建镜像
docker build -t merchant-client:latest .

# 运行容器
docker run -d -p 3000:80 --name merchant-client merchant-client:latest
```

#### Docker Compose

```yaml
version: '3.8'

services:
  merchant-client:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### 5. 使用 Vercel 部署

#### vercel.json

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### 部署命令

```bash
npm install -g vercel
vercel --prod
```

## 性能优化

### 1. 代码分割

项目已配置路由级别的代码分割，无需额外配置。

### 2. CDN 加速

将静态资源上传到 CDN：

```bash
# 上传 dist/assets 到 CDN
aws s3 sync dist/assets s3://your-bucket/assets
```

修改 `vite.config.ts`:

```typescript
export default defineConfig({
  base: 'https://cdn.yc365.com/',
  // ...
})
```

### 3. 启用 HTTP/2

在 Nginx 中启用 HTTP/2：

```nginx
server {
    listen 443 ssl http2;
    # ...
}
```

## 监控和日志

### 1. 错误监控

集成 Sentry：

```bash
npm install @sentry/react @sentry/tracing
```

### 2. 性能监控

使用 Google Analytics 或自定义埋点。

### 3. 日志收集

配置 Nginx 访问日志：

```nginx
access_log /var/log/nginx/merchant-client.access.log;
error_log /var/log/nginx/merchant-client.error.log;
```

## 回滚策略

保留最近 3 个版本的构建产物：

```bash
# 备份当前版本
cp -r dist dist-$(date +%Y%m%d-%H%M%S)

# 回滚到上一个版本
rm -rf dist
cp -r dist-20231205-120000 dist
```

## 安全建议

1. 启用 HTTPS
2. 设置 CSP (Content Security Policy)
3. 配置 CORS 策略
4. 定期更新依赖
5. 使用环境变量管理敏感信息
6. 启用 Nginx 安全头

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

## 故障排查

### 常见问题

1. **白屏问题**：检查 API 地址配置
2. **路由 404**：确认 Nginx 配置 `try_files`
3. **资源加载失败**：检查 CDN 配置
4. **登录失败**：验证后端 API 可访问性

### 日志查看

```bash
# Nginx 日志
tail -f /var/log/nginx/error.log

# Docker 日志
docker logs -f merchant-client
```

## 联系支持

如有部署问题，请联系技术支持团队。

