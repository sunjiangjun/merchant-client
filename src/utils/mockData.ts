// 模拟数据工具，用于前端独立开发

import type {
  BusinessAdmin,
  TransactionRecord,
  SignServiceConfig,
  MerchantAssets,
  MerchantUser,
  UserOrder,
  ApiKey,
  PointsInfo,
  PointsAllocation,
} from '@/types';

// 生成随机ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// 生成随机日期
const randomDate = (daysAgo = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// 模拟业务管理员数据
export const mockBusinessAdmins: BusinessAdmin[] = [
  {
    id: '1',
    account: 'business_admin_1',
    merchantDomain: 'test.yc365.com',
    permissions: ['view_assets', 'view_users', 'manage_api_keys'],
    createdAt: randomDate(90),
    status: 'active',
  },
  {
    id: '2',
    account: 'business_admin_2',
    merchantDomain: 'test.yc365.com',
    permissions: ['view_assets', 'view_users', 'manage_api_keys', 'view_points', 'allocate_points'],
    createdAt: randomDate(60),
    status: 'active',
  },
  {
    id: '3',
    account: 'business_admin_3',
    merchantDomain: 'test.yc365.com',
    permissions: ['configure_sign'],
    createdAt: randomDate(30),
    status: 'disabled',
  },
];

// 模拟交易记录
export const mockTransactions: TransactionRecord[] = [
  {
    id: '1',
    type: 'deposit',
    amount: '10000.00',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'completed',
    createdAt: randomDate(10),
    completedAt: randomDate(9),
  },
  {
    id: '2',
    type: 'withdraw',
    amount: '5000.00',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'completed',
    createdAt: randomDate(5),
    completedAt: randomDate(4),
  },
  {
    id: '3',
    type: 'deposit',
    amount: '20000.00',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    status: 'pending',
    createdAt: randomDate(1),
  },
];

// 模拟 Sign 服务配置
export const mockSignConfigs: SignServiceConfig[] = [
  {
    id: '1',
    url: 'https://sign.yc365.com',
    description: '主要 Sign 服务',
    isActive: true,
    createdAt: randomDate(90),
    updatedAt: randomDate(10),
  },
  {
    id: '2',
    url: 'https://sign-backup.yc365.com',
    description: '备用 Sign 服务',
    isActive: false,
    createdAt: randomDate(60),
    updatedAt: randomDate(30),
  },
];

// 模拟商户资产
export const mockMerchantAssets: MerchantAssets = {
  totalAssets: '500000.00',
  usedAssets: '123456.78',
  remainingAssets: '376543.22',
  walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
};

// 模拟商户用户
export const mockMerchantUsers: MerchantUser[] = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  username: `user_${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `138${String(10000000 + i).substring(0, 8)}`,
  registeredAt: randomDate(180),
  lastActiveAt: randomDate(7),
  orderCount: Math.floor(Math.random() * 50),
  totalSpent: (Math.random() * 10000).toFixed(2),
}));

// 模拟用户订单
export const mockUserOrders: UserOrder[] = Array.from({ length: 20 }, (_, i) => ({
  id: (i + 1).toString(),
  userId: '1',
  orderNo: `ORD${Date.now()}${i}`,
  amount: (Math.random() * 1000).toFixed(2),
  status: ['pending', 'completed', 'failed', 'cancelled'][Math.floor(Math.random() * 4)] as any,
  createdAt: randomDate(30),
  completedAt: Math.random() > 0.5 ? randomDate(25) : undefined,
}));

// 模拟 API Keys
export const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    key: 'yk_live_1234567890abcdefghijklmnopqrstuvwxyz1234567890',
    name: '生产环境 API Key',
    createdAt: randomDate(90),
    lastUsedAt: randomDate(1),
    traffic: 1024 * 1024 * 500, // 500MB
    status: 'active',
  },
  {
    id: '2',
    key: 'yk_test_abcdefghijklmnopqrstuvwxyz1234567890abcdefgh',
    name: '测试环境 API Key',
    createdAt: randomDate(60),
    lastUsedAt: randomDate(5),
    traffic: 1024 * 1024 * 100, // 100MB
    status: 'active',
  },
  {
    id: '3',
    key: 'yk_dev_xyz123abc456def789ghi012jkl345mno678pqr901stu',
    name: '开发环境 API Key',
    createdAt: randomDate(30),
    traffic: 1024 * 1024 * 10, // 10MB
    status: 'disabled',
  },
];

// 模拟积分信息
export const mockPointsInfo: PointsInfo = {
  totalPoints: 100000,
  usedPoints: 45000,
  remainingPoints: 55000,
};

// 模拟积分分配记录
export const mockPointsAllocations: PointsAllocation[] = Array.from({ length: 30 }, (_, i) => ({
  id: (i + 1).toString(),
  userId: String(Math.floor(Math.random() * 50) + 1),
  username: `user_${Math.floor(Math.random() * 50) + 1}`,
  points: Math.floor(Math.random() * 5000) + 100,
  allocatedAt: randomDate(60),
  allocatedBy: 'business_admin',
  note: Math.random() > 0.5 ? '活动奖励' : undefined,
}));

// 模拟延迟
export const mockDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// 分页工具
export const paginate = <T>(data: T[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    list: data.slice(start, end),
    total: data.length,
    page,
    pageSize,
  };
};

