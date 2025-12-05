import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 如果要求特定角色，但用户角色不匹配，重定向到用户对应的 dashboard
  if (requiredRole && user?.role !== requiredRole) {
    if (user?.role === UserRole.SYSTEM_ADMIN) {
      return <Navigate to="/system-admin/dashboard" replace />;
    }
    if (user?.role === UserRole.BUSINESS_ADMIN) {
      return <Navigate to="/business-admin/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

