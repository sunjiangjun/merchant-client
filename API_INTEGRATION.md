# API 对接文档

## 概述

本文档描述了 YC365 商户管理系统前端与后端 API 的对接规范。

## 基础配置

### API 基础地址

```
开发环境: http://localhost:8080/api
生产环境: https://api.yc365.com/api
```

### 请求头

所有请求都需要包含以下请求头：

```
Content-Type: application/json
Authorization: Bearer {token}
```

### 响应格式

统一响应格式：

```typescript
{
  code: number,      // 状态码：0 或 200 表示成功
  message: string,   // 响应消息
  data: any         // 响应数据
}
```

## 认证相关 API

### 1. 用户登录

**接口**: `POST /auth/login`

**请求参数**:
```typescript
{
  merchantDomain: string;  // 商户域名
  account: string;         // 账号
  role: 'system_admin' | 'business_admin';  // 角色
  password: string;        // 密码
}
```

**响应数据**:
```typescript
{
  token: string;  // JWT Token
  user: {
    id: string;
    account: string;
    merchantDomain: string;
    role: string;
    permissions: string[];
    createdAt: string;
  }
}
```

### 2. 登出

**接口**: `POST /auth/logout`

**响应**: 无数据返回

### 3. 获取当前用户信息

**接口**: `GET /auth/current`

**响应数据**: User 对象

### 4. 修改密码

**接口**: `POST /auth/change-password`

**请求参数**:
```typescript
{
  oldPassword: string;
  newPassword: string;
}
```

## 系统管理员 API

### 1. 业务管理员管理

#### 创建业务管理员

**接口**: `POST /system-admin/business-admins`

**请求参数**:
```typescript
{
  account: string;
  password: string;
  permissions: string[];
}
```

#### 获取业务管理员列表

**接口**: `GET /system-admin/business-admins`

**查询参数**:
```typescript
{
  page?: number;
  pageSize?: number;
}
```

**响应数据**:
```typescript
{
  list: BusinessAdmin[];
  total: number;
  page: number;
  pageSize: number;
}
```

#### 重置业务管理员密码

**接口**: `POST /system-admin/business-admins/{id}/reset-password`

**请求参数**:
```typescript
{
  newPassword: string;
}
```

#### 更新业务管理员权限

**接口**: `PUT /system-admin/business-admins/{id}/permissions`

**请求参数**:
```typescript
{
  permissions: string[];
}
```

#### 启用/禁用业务管理员

**接口**: `PATCH /system-admin/business-admins/{id}/status`

**请求参数**:
```typescript
{
  status: 'active' | 'disabled';
}
```

### 2. 资产管理

#### 充值

**接口**: `POST /system-admin/deposit`

**请求参数**:
```typescript
{
  amount: string;
  walletAddress: string;
}
```

#### 提现

**接口**: `POST /system-admin/withdraw`

**请求参数**:
```typescript
{
  amount: string;
  walletAddress: string;
}
```

#### 获取充值记录

**接口**: `GET /system-admin/deposits`

**查询参数**: `{ page, pageSize }`

#### 获取提现记录

**接口**: `GET /system-admin/withdraws`

**查询参数**: `{ page, pageSize }`

## 业务管理员 API

### 1. Sign 服务配置

#### 获取配置列表

**接口**: `GET /business-admin/sign-configs`

**响应数据**: `SignServiceConfig[]`

#### 添加配置

**接口**: `POST /business-admin/sign-configs`

**请求参数**:
```typescript
{
  url: string;
  description: string;
}
```

#### 更新配置

**接口**: `PUT /business-admin/sign-configs/{id}`

**请求参数**:
```typescript
{
  url: string;
  description: string;
}
```

#### 删除配置

**接口**: `DELETE /business-admin/sign-configs/{id}`

#### 激活配置

**接口**: `POST /business-admin/sign-configs/{id}/activate`

#### 测试连接

**接口**: `POST /business-admin/sign-configs/test`

**请求参数**:
```typescript
{
  url: string;
}
```

**响应数据**:
```typescript
{
  success: boolean;
  message: string;
}
```

### 2. 资产查询

#### 获取商户资产

**接口**: `GET /business-admin/assets`

**响应数据**:
```typescript
{
  totalAssets: string;
  usedAssets: string;
  remainingAssets: string;
  walletAddress?: string;
}
```

### 3. 用户管理

#### 获取用户列表

**接口**: `GET /business-admin/users`

**查询参数**:
```typescript
{
  page?: number;
  pageSize?: number;
  keyword?: string;  // 搜索关键词
}
```

#### 获取用户详情

**接口**: `GET /business-admin/users/{userId}`

#### 获取用户订单

**接口**: `GET /business-admin/users/{userId}/orders`

**查询参数**: `{ page, pageSize }`

### 4. API Key 管理

#### 获取 API Key 列表

**接口**: `GET /business-admin/api-keys`

**响应数据**: `ApiKey[]`

#### 创建 API Key

**接口**: `POST /business-admin/api-keys`

**请求参数**:
```typescript
{
  name: string;
}
```

#### 删除 API Key

**接口**: `DELETE /business-admin/api-keys/{id}`

#### 重置 API Key

**接口**: `POST /business-admin/api-keys/{id}/regenerate`

#### 启用/禁用 API Key

**接口**: `PATCH /business-admin/api-keys/{id}/status`

**请求参数**:
```typescript
{
  status: 'active' | 'disabled';
}
```

#### 获取流量统计

**接口**: `GET /business-admin/api-keys/{id}/traffic`

**响应数据**:
```typescript
{
  traffic: number;
  details: any;
}
```

### 5. 积分管理

#### 获取积分信息

**接口**: `GET /business-admin/points`

**响应数据**:
```typescript
{
  totalPoints: number;
  usedPoints: number;
  remainingPoints: number;
}
```

#### 获取分配记录

**接口**: `GET /business-admin/points/allocations`

**查询参数**: `{ page, pageSize }`

#### 分配积分

**接口**: `POST /business-admin/points/allocate`

**请求参数**:
```typescript
{
  userId: string;
  points: number;
  note?: string;
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0/200  | 成功 |
| 400    | 请求参数错误 |
| 401    | 未授权/登录过期 |
| 403    | 无权限访问 |
| 404    | 资源不存在 |
| 500    | 服务器内部错误 |

## 分页参数

所有列表接口统一使用以下分页参数：

```typescript
{
  page: number;      // 页码，从 1 开始
  pageSize: number;  // 每页数量
}
```

分页响应格式：

```typescript
{
  list: T[];         // 数据列表
  total: number;     // 总数
  page: number;      // 当前页
  pageSize: number;  // 每页数量
}
```

## 日期格式

所有日期时间字段统一使用 ISO 8601 格式：

```
2023-12-05T12:30:00.000Z
```

## 权限列表

```typescript
enum Permission {
  VIEW_ASSETS = 'view_assets',           // 查看资产
  VIEW_USERS = 'view_users',             // 查看用户
  MANAGE_API_KEYS = 'manage_api_keys',   // 管理 API Key
  VIEW_POINTS = 'view_points',           // 查看积分
  ALLOCATE_POINTS = 'allocate_points',   // 分配积分
  CONFIGURE_SIGN = 'configure_sign',     // 配置 Sign 服务
}
```

## Mock 数据

开发阶段可以使用 Mock 数据进行测试。Mock 服务器配置参考：

```javascript
// mock/index.js
export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: () => {
      return {
        code: 0,
        message: 'success',
        data: {
          token: 'mock-token-123456',
          user: {
            id: '1',
            account: 'admin',
            merchantDomain: 'test.com',
            role: 'system_admin',
            permissions: [],
            createdAt: new Date().toISOString(),
          }
        }
      }
    }
  }
]
```

## 测试账号

```
系统管理员：
  域名: test.yc365.com
  账号: system_admin
  密码: Admin@123

业务管理员：
  域名: test.yc365.com
  账号: business_admin
  密码: Admin@123
```

## 联系方式

如有 API 对接问题，请联系：
- 技术支持邮箱: tech@yc365.com
- 技术支持电话: 400-xxx-xxxx

