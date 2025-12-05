import { http } from '@/utils/request';
import type {
  BusinessAdmin,
  Permission,
  TransactionRecord,
  PaginationParams,
  PaginatedResponse,
} from '@/types';

// 创建业务管理员
export const createBusinessAdmin = (data: {
  account: string;
  password: string;
  permissions: Permission[];
}): Promise<BusinessAdmin> => {
  return http.post('/system-admin/business-admins', data);
};

// 获取业务管理员列表
export const getBusinessAdmins = (
  params?: PaginationParams
): Promise<PaginatedResponse<BusinessAdmin>> => {
  return http.get('/system-admin/business-admins', { params });
};

// 获取业务管理员详情
export const getBusinessAdminDetail = (id: string): Promise<BusinessAdmin> => {
  return http.get(`/system-admin/business-admins/${id}`);
};

// 重置业务管理员密码
export const resetBusinessAdminPassword = (
  id: string,
  newPassword: string
): Promise<void> => {
  return http.post(`/system-admin/business-admins/${id}/reset-password`, {
    newPassword,
  });
};

// 更新业务管理员权限
export const updateBusinessAdminPermissions = (
  id: string,
  permissions: Permission[]
): Promise<void> => {
  return http.put(`/system-admin/business-admins/${id}/permissions`, {
    permissions,
  });
};

// 禁用/启用业务管理员
export const toggleBusinessAdminStatus = (
  id: string,
  status: 'active' | 'disabled'
): Promise<void> => {
  return http.patch(`/system-admin/business-admins/${id}/status`, { status });
};

// 获取充值记录
export const getDepositRecords = (
  params?: PaginationParams
): Promise<PaginatedResponse<TransactionRecord>> => {
  return http.get('/system-admin/deposits', { params });
};

// 充值
export const deposit = (data: {
  amount: string;
  walletAddress: string;
}): Promise<TransactionRecord> => {
  return http.post('/system-admin/deposit', data);
};

// 获取提现记录
export const getWithdrawRecords = (
  params?: PaginationParams
): Promise<PaginatedResponse<TransactionRecord>> => {
  return http.get('/system-admin/withdraws', { params });
};

// 提现
export const withdraw = (data: {
  amount: string;
  walletAddress: string;
}): Promise<TransactionRecord> => {
  return http.post('/system-admin/withdraw', data);
};

