# YC365 商户管理系统

<div align="center">

![YC365 Logo](https://via.placeholder.com/150x150/667eea/ffffff?text=YC365)

**面向商户的预测服务管理平台**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF.svg)](https://vitejs.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.12.0-0170FE.svg)](https://ant.design/)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](./LICENSE)

[功能特性](#核心功能) •
[快速开始](#快速开始) •
[文档](#文档) •
[技术栈](#技术栈)

</div>

---

## 📖 项目简介

YC365 商户管理系统是一个为预测服务商户打造的专业管理平台。商户可以通过此系统管理用户、资产、权限、API Key 和积分等核心业务，实现高效的商户运营。

### ✨ 主要特点

- 🎯 **双角色系统** - 系统管理员 + 业务管理员，职责分明
- 💰 **资产管理** - 实时查看资产，支持充值提现
- 👥 **用户管理** - 完整的用户信息和订单管理
- 🔑 **API 管理** - 便捷的 API Key 创建和流量统计
- ⭐ **积分系统** - 灵活的积分分配机制
- 🔒 **权限控制** - 细粒度的权限管理
- 📱 **响应式设计** - 完美适配各种设备

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0

### 安装

```bash
# 克隆项目
git clone https://github.com/yc365/merchant-client.git
cd merchant-client

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 代码检查

```bash
# ESLint 检查
npm run lint
```

## 🎯 核心功能

### 🔐 认证模块

- 支持商户域名 + 账号 + 角色登录
- JWT Token 认证机制
- 基于角色的路由守卫
- 自动 Token 刷新

### 👨‍💼 系统管理员

<details>
<summary>点击展开功能列表</summary>

#### 工作台
- 📊 业务管理员统计
- 💵 资产概览
- 📈 数据趋势

#### 业务管理员管理
- ➕ 创建业务管理员
- 🔄 重置密码
- 🔧 权限管理（6种权限）
- ⚡ 启用/禁用账号

#### 资产管理
- 💰 充值功能（Web3 钱包）
- 💸 提现功能（Web3 钱包）
- 📋 交易记录查询
- 🔍 交易状态跟踪

</details>

### 👔 业务管理员

<details>
<summary>点击展开功能列表</summary>

#### 工作台
- 📊 资产统计面板
- 👥 用户数据概览
- 🔑 API Key 使用情况
- ⭐ 积分余额

#### Sign 服务配置
- ➕ 添加/编辑配置
- 🧪 测试服务连接
- ✅ 激活配置
- 🔒 至少保留一个可用配置

#### 资产查询
- 💵 总资产、已使用、剩余
- 📊 使用率可视化
- 👛 钱包地址查看

#### 用户管理
- 📋 用户列表（支持搜索）
- 👤 用户详情
- 🛒 订单查询
- 📈 数据统计

#### API Key 管理
- 🔑 创建 Key（最多5个）
- 📋 查看和复制 Key
- 🔄 重置 Key
- ⚡ 启用/禁用
- 📊 流量统计

#### 积分管理
- ⭐ 查看积分信息
- 🎁 分配积分给用户
- 📋 分配记录
- 💡 余额检查

</details>

## 🛠 技术栈

### 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.2.0 | UI 框架 |
| TypeScript | 5.2.2 | 类型系统 |
| Vite | 5.0.8 | 构建工具 |
| Ant Design | 5.12.0 | UI 组件库 |
| React Router | 6.20.0 | 路由管理 |
| Zustand | 4.4.7 | 状态管理 |
| Axios | 1.6.2 | HTTP 客户端 |
| Day.js | 1.11.10 | 日期处理 |

### 开发工具

- ESLint - 代码检查
- TypeScript - 类型检查
- Git - 版本控制

## 📁 项目结构

```
merchant-client/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口层
│   ├── assets/            # 资源文件
│   ├── components/        # 通用组件
│   ├── layouts/           # 布局组件
│   ├── pages/             # 页面组件
│   │   ├── Login/         # 登录页
│   │   ├── SystemAdmin/   # 系统管理员
│   │   └── BusinessAdmin/ # 业务管理员
│   ├── stores/            # 状态管理
│   ├── styles/            # 全局样式
│   ├── types/             # 类型定义
│   ├── utils/             # 工具函数
│   ├── App.tsx            # 应用主组件
│   └── main.tsx           # 应用入口
├── .gitignore
├── .eslintrc.cjs
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── 文档/
    ├── README.md          # 项目说明
    ├── CHANGELOG.md       # 更新日志
    ├── DEPLOYMENT.md      # 部署指南
    ├── API_INTEGRATION.md # API 文档
    ├── USER_GUIDE.md      # 使用手册
    ├── CONTRIBUTING.md    # 开发指南
    └── PROJECT_OVERVIEW.md # 项目概览
```

## 📚 文档

| 文档 | 描述 |
|------|------|
| [项目概览](./PROJECT_OVERVIEW.md) | 项目整体介绍和架构说明 |
| [使用手册](./USER_GUIDE.md) | 详细的功能使用指南 |
| [API 对接文档](./API_INTEGRATION.md) | 后端 API 接口说明 |
| [部署指南](./DEPLOYMENT.md) | 生产环境部署步骤 |
| [开发指南](./CONTRIBUTING.md) | 开发规范和贡献指南 |
| [更新日志](./CHANGELOG.md) | 版本更新记录 |
| [模拟模式说明](./MOCK_MODE.md) | 无后端运行模式 |

## 🔐 登录说明

### 登录参数

- **商户域名**: 您的商户域名（由 YC365 提供）
- **账号**: 登录账号
- **角色**: 系统管理员 / 业务管理员
- **密码**: 登录密码

### 注册说明

商户账号注册需要联系 YC365，由 YC365 为商户注册系统管理员账号。

**联系方式**:
- 📧 邮箱: support@yc365.com
- 📞 电话: 400-xxx-xxxx

### 🎯 无需后端，开箱即用！

本项目支持**模拟数据模式**，无需后端即可运行！

- ✅ 登录无需验证，输入任意账号密码即可
- ✅ 所有功能都有模拟数据支持
- ✅ 可以正常演示和开发
- ✅ 适合前端独立开发和功能展示

### 建议测试账号

为了更好的演示效果，建议使用以下账号：

```
系统管理员：
  域名: test.yc365.com
  账号: system_admin
  密码: 123456

业务管理员：
  域名: test.yc365.com
  账号: business_admin
  密码: 123456
```

> 💡 **提示**: 实际上可以输入任意账号密码，都能成功登录！查看 [MOCK_MODE.md](./MOCK_MODE.md) 了解详情。

## 🌟 特色功能

### 🎨 现代化设计

- 基于 Ant Design 5 的现代设计语言
- 流畅的动画效果和交互体验
- 深色/浅色主题支持（计划中）

### 📱 响应式布局

- 完美适配桌面、平板、手机
- 移动端优化的操作界面

### 🔒 安全性

- JWT Token 认证
- HTTPS 加密传输
- XSS 和 CSRF 防护
- 细粒度权限控制

### ⚡ 高性能

- Vite 快速构建
- 路由级代码分割
- 懒加载优化
- 构建产物 < 500KB (gzip)

## 🤝 贡献指南

欢迎贡献代码！请查看 [开发指南](./CONTRIBUTING.md) 了解详细信息。

### 开发流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 🐛 问题反馈

如遇到问题，请通过以下方式反馈：

- 📧 技术支持: tech@yc365.com
- 📞 客服电话: 400-xxx-xxxx
- 💬 在线客服: [链接]

## 📄 许可证

Copyright © 2025 YC365. All rights reserved.

---

<div align="center">

**Built with ❤️ by YC365 Team**

[官网](https://yc365.com) • [文档](./PROJECT_OVERVIEW.md) • [支持](mailto:support@yc365.com)

</div>

