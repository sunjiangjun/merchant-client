import { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Space, Typography } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  TeamOutlined,
  WalletOutlined,
  ApiOutlined,
  StarOutlined,
  SafetyOutlined,
  GlobalOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  // 系统管理员菜单
  const systemAdminMenuItems: MenuProps['items'] = [
    {
      key: '/system-admin/dashboard',
      icon: <DashboardOutlined />,
      label: '工作台',
    },
    {
      key: '/system-admin/business-admins',
      icon: <TeamOutlined />,
      label: '业务管理员',
    },
    {
      key: '/system-admin/transactions',
      icon: <WalletOutlined />,
      label: '资产管理',
    },
    {
      key: '/system-admin/sign-config',
      icon: <SafetyOutlined />,
      label: 'Sign服务配置',
    },
    {
      key: '/system-admin/api-keys',
      icon: <ApiOutlined />,
      label: 'API Key管理',
    },
    {
      key: '/system-admin/domain-config',
      icon: <GlobalOutlined />,
      label: '域名与回调地址',
    },
  ];

  // 业务管理员菜单
  const businessAdminMenuItems: MenuProps['items'] = [
    {
      key: '/business-admin/dashboard',
      icon: <DashboardOutlined />,
      label: '工作台',
    },
    {
      key: '/business-admin/assets',
      icon: <WalletOutlined />,
      label: '资产查询',
    },
    {
      key: '/business-admin/users',
      icon: <TeamOutlined />,
      label: '用户管理',
    },
    {
      key: '/business-admin/orders',
      icon: <ShoppingOutlined />,
      label: '订单管理',
    },
    {
      key: '/business-admin/points',
      icon: <StarOutlined />,
      label: '积分管理',
    },
    {
      key: '/business-admin/create-event',
      icon: <PlusCircleOutlined />,
      label: '创建事件',
    },
    {
      key: '/business-admin/events',
      icon: <CalendarOutlined />,
      label: '事件管理',
    },
  ];

  const menuItems =
    user?.role === UserRole.SYSTEM_ADMIN
      ? systemAdminMenuItems
      : businessAdminMenuItems;

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const getRoleName = (role: UserRole) => {
    return role === UserRole.SYSTEM_ADMIN ? '系统管理员' : '业务管理员';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={240}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: collapsed ? 14 : 18,
            fontWeight: 'bold',
            padding: '0 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {collapsed ? 'YC365' : 'YC365 商户管理'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ marginTop: 16 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <Space direction="vertical" size={0}>
                <Text strong>{user?.account}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {user?.role ? getRoleName(user.role) : ''}
                </Text>
              </Space>
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ margin: '24px', minHeight: 'calc(100vh - 112px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

