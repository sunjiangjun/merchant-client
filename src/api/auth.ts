import { http } from '@/utils/request';
import type { LoginRequest, User } from '@/types';

// 登录
export const login = (data: LoginRequest): Promise<{ token: string; user: User }> => {
  return http.post('/auth/login', data);
};

// 登出
export const logout = (): Promise<void> => {
  return http.post('/auth/logout');
};

// 获取当前用户信息
export const getCurrentUser = (): Promise<User> => {
  return http.get('/auth/current');
};

// 修改密码
export const changePassword = (data: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> => {
  return http.post('/auth/change-password', data);
};

