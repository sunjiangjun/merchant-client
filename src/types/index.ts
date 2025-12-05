// 用户角色
export enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  BUSINESS_ADMIN = 'business_admin',
}

// 权限类型
export enum Permission {
  VIEW_ASSETS = 'view_assets',
  VIEW_USERS = 'view_users',
  MANAGE_API_KEYS = 'manage_api_keys',
  VIEW_POINTS = 'view_points',
  ALLOCATE_POINTS = 'allocate_points',
  CONFIGURE_SIGN = 'configure_sign',
}

// 登录请求
export interface LoginRequest {
  merchantDomain: string;
  account: string;
  role: UserRole;
  password: string;
}

// 用户信息
export interface User {
  id: string;
  account: string;
  merchantDomain: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: string;
  lastLoginAt?: string;
}

// 业务管理员
export interface BusinessAdmin {
  id: string;
  account: string;
  merchantDomain: string;
  permissions: Permission[];
  createdAt: string;
  status: 'active' | 'disabled';
}

// 商户资产
export interface MerchantAssets {
  totalAssets: string;
  usedAssets: string;
  remainingAssets: string;
  walletAddress?: string;
}

// 商户用户
export interface MerchantUser {
  id: string;
  username: string;
  email: string;
  phone?: string;
  registeredAt: string;
  lastActiveAt?: string;
  orderCount: number;
  totalSpent: string;
}

// 用户订单
export interface UserOrder {
  id: string;
  userId: string;
  orderNo: string;
  amount: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

// API Key
export interface ApiKey {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  lastUsedAt?: string;
  traffic: number; // 流量统计
  status: 'active' | 'disabled';
}

// Sign 服务配置
export interface SignServiceConfig {
  id: string;
  url: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 积分信息
export interface PointsInfo {
  totalPoints: number;
  usedPoints: number;
  remainingPoints: number;
}

// 积分分配记录
export interface PointsAllocation {
  id: string;
  userId: string;
  username: string;
  points: number;
  allocatedAt: string;
  allocatedBy: string;
  note?: string;
}

// 充值/提现记录
export interface TransactionRecord {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: string;
  walletAddress: string;
  txHash?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

// API 响应
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

