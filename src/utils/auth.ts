import type { User, UserRole } from '@/types';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// 保存 token
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// 获取 token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// 移除 token
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// 保存用户信息
export const setUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// 获取用户信息
export const getUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Parse user info error:', error);
      return null;
    }
  }
  return null;
};

// 移除用户信息
export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// 清除所有认证信息
export const clearAuth = (): void => {
  removeToken();
  removeUser();
};

// 检查是否已登录
export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getUser();
};

// 检查用户角色
export const hasRole = (role: UserRole): boolean => {
  const user = getUser();
  return user?.role === role;
};

// 检查是否为系统管理员
export const isSystemAdmin = (): boolean => {
  return hasRole('system_admin' as UserRole);
};

// 检查是否为业务管理员
export const isBusinessAdmin = (): boolean => {
  return hasRole('business_admin' as UserRole);
};

