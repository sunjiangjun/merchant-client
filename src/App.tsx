import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useAuthStore } from '@/stores/authStore';
import { PrivateRoute } from '@/components/PrivateRoute';
import { MainLayout } from '@/layouts/MainLayout';
import { Login } from '@/pages/Login';
import { SystemAdminDashboard } from '@/pages/SystemAdmin/Dashboard';
import { BusinessAdmins } from '@/pages/SystemAdmin/BusinessAdmins';
import { Transactions } from '@/pages/SystemAdmin/Transactions';
import { SignConfig } from '@/pages/SystemAdmin/SignConfig';
import { ApiKeys } from '@/pages/SystemAdmin/ApiKeys';
import { DomainConfig } from '@/pages/SystemAdmin/DomainConfig';
import { BusinessAdminDashboard } from '@/pages/BusinessAdmin/Dashboard';
import { Assets } from '@/pages/BusinessAdmin/Assets';
import { Users } from '@/pages/BusinessAdmin/Users';
import { Orders } from '@/pages/BusinessAdmin/Orders';
import { Points } from '@/pages/BusinessAdmin/Points';
import { CreateEvent } from '@/pages/BusinessAdmin/CreateEvent';
import { Events } from '@/pages/BusinessAdmin/Events';
import { UserRole } from '@/types';

// 主题配置
const theme = {
  token: {
    colorPrimary: '#667eea',
    borderRadius: 8,
  },
};

function App() {
  const { initialize, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // 根据用户角色获取默认路由
  const getDefaultRoute = () => {
    if (!isAuthenticated) {
      return '/login';
    }
    
    if (user?.role === UserRole.SYSTEM_ADMIN) {
      return '/system-admin/dashboard';
    }
    
    if (user?.role === UserRole.BUSINESS_ADMIN) {
      return '/business-admin/dashboard';
    }
    
    return '/login';
  };

  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* 登录页面 */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login />
            }
          />

          {/* 系统管理员路由 */}
          <Route
            path="/system-admin"
            element={
              <PrivateRoute requiredRole={UserRole.SYSTEM_ADMIN}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<SystemAdminDashboard />} />
            <Route path="business-admins" element={<BusinessAdmins />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="sign-config" element={<SignConfig />} />
            <Route path="api-keys" element={<ApiKeys />} />
            <Route path="domain-config" element={<DomainConfig />} />
          </Route>

          {/* 业务管理员路由 */}
          <Route
            path="/business-admin"
            element={
              <PrivateRoute requiredRole={UserRole.BUSINESS_ADMIN}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<BusinessAdminDashboard />} />
            <Route path="assets" element={<Assets />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="points" element={<Points />} />
            <Route path="create-event" element={<CreateEvent />} />
            <Route path="events" element={<Events />} />
          </Route>

          {/* 默认路由重定向 */}
          <Route
            path="/"
            element={<Navigate to={getDefaultRoute()} replace />}
          />

          {/* 404 页面 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;

