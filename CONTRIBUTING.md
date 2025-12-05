# 开发指南

## 开发环境设置

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0
- Git

### 克隆项目

```bash
git clone https://github.com/yc365/merchant-client.git
cd merchant-client
```

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
merchant-client/
├── public/                 # 静态资源
│   └── vite.svg
├── src/
│   ├── api/               # API 接口层
│   │   ├── auth.ts        # 认证相关接口
│   │   ├── systemAdmin.ts # 系统管理员接口
│   │   └── businessAdmin.ts # 业务管理员接口
│   ├── assets/            # 资源文件
│   ├── components/        # 通用组件
│   │   └── PrivateRoute.tsx # 路由守卫
│   ├── layouts/           # 布局组件
│   │   └── MainLayout.tsx # 主布局
│   ├── pages/             # 页面组件
│   │   ├── Login/         # 登录页
│   │   ├── SystemAdmin/   # 系统管理员页面
│   │   │   ├── Dashboard.tsx
│   │   │   ├── BusinessAdmins.tsx
│   │   │   └── Transactions.tsx
│   │   └── BusinessAdmin/ # 业务管理员页面
│   │       ├── Dashboard.tsx
│   │       ├── SignConfig.tsx
│   │       ├── Assets.tsx
│   │       ├── Users.tsx
│   │       ├── ApiKeys.tsx
│   │       └── Points.tsx
│   ├── stores/            # 状态管理
│   │   └── authStore.ts   # 认证状态
│   ├── styles/            # 全局样式
│   │   └── index.css
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/             # 工具函数
│   │   ├── request.ts     # HTTP 请求封装
│   │   ├── auth.ts        # 认证工具
│   │   └── format.ts      # 格式化工具
│   ├── App.tsx            # 应用主组件
│   ├── main.tsx           # 应用入口
│   └── vite-env.d.ts      # Vite 类型声明
├── .gitignore
├── .eslintrc.cjs          # ESLint 配置
├── index.html             # HTML 入口
├── package.json
├── tsconfig.json          # TypeScript 配置
├── tsconfig.node.json
├── vite.config.ts         # Vite 配置
├── README.md              # 项目说明
├── CHANGELOG.md           # 更新日志
├── DEPLOYMENT.md          # 部署指南
├── API_INTEGRATION.md     # API 对接文档
└── USER_GUIDE.md          # 使用手册
```

## 开发规范

### 代码规范

1. **TypeScript**: 使用 TypeScript 进行类型安全开发
2. **ESLint**: 遵循 ESLint 规则
3. **命名规范**:
   - 组件文件: PascalCase (例: `UserList.tsx`)
   - 工具函数: camelCase (例: `formatDate.ts`)
   - 常量: UPPER_SNAKE_CASE (例: `API_BASE_URL`)
   - 组件命名: PascalCase (例: `UserList`)
   - 函数命名: camelCase (例: `getUserList`)

### 组件开发规范

#### 函数式组件模板

```typescript
import { useState } from 'react';
import { Card, Button } from 'antd';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  const [state, setState] = useState<string>('');

  const handleAction = () => {
    // 逻辑处理
    onAction?.();
  };

  return (
    <Card title={title}>
      <Button onClick={handleAction}>Action</Button>
    </Card>
  );
};
```

#### Hooks 使用规范

```typescript
// 自定义 Hook
export const useCustomHook = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Effect logic
  }, []);

  return { data, loading };
};
```

### API 调用规范

```typescript
// api/example.ts
import { http } from '@/utils/request';
import type { ResponseType } from '@/types';

export const getData = (params: any): Promise<ResponseType> => {
  return http.get('/endpoint', { params });
};

export const postData = (data: any): Promise<void> => {
  return http.post('/endpoint', data);
};
```

### 状态管理规范

使用 Zustand 进行状态管理：

```typescript
import { create } from 'zustand';

interface StoreState {
  data: any;
  setData: (data: any) => void;
}

export const useStore = create<StoreState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
```

### 样式规范

1. 使用 Ant Design 内置样式
2. 自定义样式使用 CSS Module 或全局 CSS
3. 响应式设计使用 Ant Design Grid 系统

```css
/* 全局样式 */
.custom-class {
  padding: 16px;
  margin-bottom: 24px;
}

/* 响应式 */
@media (max-width: 768px) {
  .custom-class {
    padding: 8px;
  }
}
```

## Git 工作流

### 分支管理

- `main`: 主分支，生产环境代码
- `develop`: 开发分支，测试环境代码
- `feature/*`: 功能分支
- `bugfix/*`: Bug 修复分支
- `hotfix/*`: 紧急修复分支

### 提交规范

使用 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**:

```bash
git commit -m "feat(login): add remember me function"
git commit -m "fix(api): fix user list pagination bug"
git commit -m "docs(readme): update installation guide"
```

### 开发流程

1. 从 `develop` 分支创建功能分支

```bash
git checkout develop
git pull origin develop
git checkout -b feature/new-feature
```

2. 开发功能并提交

```bash
git add .
git commit -m "feat: add new feature"
```

3. 推送到远程仓库

```bash
git push origin feature/new-feature
```

4. 创建 Pull Request 到 `develop` 分支

5. Code Review 通过后合并

## 测试

### 单元测试

```bash
npm run test
```

### E2E 测试

```bash
npm run test:e2e
```

## 调试

### VS Code 调试配置

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### 浏览器开发工具

- React Developer Tools
- Redux DevTools (如使用 Redux)

## 性能优化

### 代码分割

使用 React.lazy 进行路由级别代码分割：

```typescript
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
```

### 图片优化

- 使用 WebP 格式
- 懒加载图片
- 使用 CDN

### 打包优化

查看打包分析：

```bash
npm run build
npm run analyze
```

## 常见问题

### 开发环境问题

**Q: 启动失败，端口被占用**

```bash
# 查找占用端口的进程
lsof -i :3000
# 杀死进程
kill -9 [PID]
```

**Q: 依赖安装失败**

```bash
# 清除缓存
npm cache clean --force
# 删除 node_modules
rm -rf node_modules
# 重新安装
npm install
```

### TypeScript 类型错误

确保安装了所有类型定义：

```bash
npm install --save-dev @types/react @types/react-dom
```

## 贡献流程

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 代码审查清单

- [ ] 代码符合规范
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 通过了所有测试
- [ ] 没有 console.log 等调试代码
- [ ] 没有 TypeScript 错误
- [ ] 没有 ESLint 警告

## 发布流程

1. 更新版本号 (`package.json`)
2. 更新 `CHANGELOG.md`
3. 创建 Git tag
4. 推送到远程仓库
5. 创建 GitHub Release

```bash
npm version patch  # 或 minor, major
git push origin main --tags
```

## 联系方式

- 项目负责人: dev@yc365.com
- 技术交流群: [链接]

## License

Copyright © 2025 YC365

