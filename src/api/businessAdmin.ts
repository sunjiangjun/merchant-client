import { http } from '@/utils/request';
import type {
  SignServiceConfig,
  MerchantAssets,
  MerchantUser,
  UserOrder,
  ApiKey,
  PointsInfo,
  PointsAllocation,
  PaginationParams,
  PaginatedResponse,
} from '@/types';

// ==================== Sign 服务配置 ====================

// 获取 Sign 服务配置列表
export const getSignConfigs = (): Promise<SignServiceConfig[]> => {
  return http.get('/business-admin/sign-configs');
};

// 添加 Sign 服务配置
export const addSignConfig = (data: {
  url: string;
  description: string;
}): Promise<SignServiceConfig> => {
  return http.post('/business-admin/sign-configs', data);
};

// 更新 Sign 服务配置
export const updateSignConfig = (
  id: string,
  data: { url: string; description: string }
): Promise<SignServiceConfig> => {
  return http.put(`/business-admin/sign-configs/${id}`, data);
};

// 删除 Sign 服务配置
export const deleteSignConfig = (id: string): Promise<void> => {
  return http.delete(`/business-admin/sign-configs/${id}`);
};

// 激活 Sign 服务配置
export const activateSignConfig = (id: string): Promise<void> => {
  return http.post(`/business-admin/sign-configs/${id}/activate`);
};

// 测试 Sign 服务连接
export const testSignConfig = (url: string): Promise<{ success: boolean; message: string }> => {
  return http.post('/business-admin/sign-configs/test', { url });
};

// ==================== 资产管理 ====================

// 获取商户资产
export const getMerchantAssets = (): Promise<MerchantAssets> => {
  return http.get('/business-admin/assets');
};

// ==================== 用户管理 ====================

// 获取商户用户列表
export const getMerchantUsers = (
  params?: PaginationParams & { keyword?: string }
): Promise<PaginatedResponse<MerchantUser>> => {
  return http.get('/business-admin/users', { params });
};

// 获取用户详情
export const getMerchantUserDetail = (userId: string): Promise<MerchantUser> => {
  return http.get(`/business-admin/users/${userId}`);
};

// 获取用户订单
export const getUserOrders = (
  userId: string,
  params?: PaginationParams
): Promise<PaginatedResponse<UserOrder>> => {
  return http.get(`/business-admin/users/${userId}/orders`, { params });
};

// ==================== API Key 管理 ====================

// 获取 API Key 列表
export const getApiKeys = (): Promise<ApiKey[]> => {
  return http.get('/business-admin/api-keys');
};

// 创建 API Key
export const createApiKey = (name: string): Promise<ApiKey> => {
  return http.post('/business-admin/api-keys', { name });
};

// 删除 API Key
export const deleteApiKey = (id: string): Promise<void> => {
  return http.delete(`/business-admin/api-keys/${id}`);
};

// 启用/禁用 API Key
export const toggleApiKeyStatus = (
  id: string,
  status: 'active' | 'disabled'
): Promise<void> => {
  return http.patch(`/business-admin/api-keys/${id}/status`, { status });
};

// 重置 API Key
export const regenerateApiKey = (id: string): Promise<ApiKey> => {
  return http.post(`/business-admin/api-keys/${id}/regenerate`);
};

// 获取 API Key 流量统计
export const getApiKeyTraffic = (id: string): Promise<{ traffic: number; details: any }> => {
  return http.get(`/business-admin/api-keys/${id}/traffic`);
};

// ==================== 积分管理 ====================

// 获取商户积分信息
export const getPointsInfo = (): Promise<PointsInfo> => {
  return http.get('/business-admin/points');
};

// 获取积分分配记录
export const getPointsAllocations = (
  params?: PaginationParams
): Promise<PaginatedResponse<PointsAllocation>> => {
  return http.get('/business-admin/points/allocations', { params });
};

// 分配积分给用户
export const allocatePoints = (data: {
  userId: string;
  points: number;
  note?: string;
}): Promise<PointsAllocation> => {
  return http.post('/business-admin/points/allocate', data);
};

