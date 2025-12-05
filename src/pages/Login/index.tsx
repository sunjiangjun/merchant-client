import { useState } from 'react';
import { Form, Input, Button, Select, Card, Typography, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  GlobalOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { setToken } from '@/utils/auth';
import { UserRole, Permission } from '@/types';
import type { LoginRequest } from '@/types';
import './styles.css';

const { Title, Paragraph } = Typography;
const { Option } = Select;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: LoginRequest) => {
    try {
      setLoading(true);
      
      // 模拟登录延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 直接创建模拟用户和token，不调用后端API
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUser = {
        id: Date.now().toString(),
        account: values.account,
        merchantDomain: values.merchantDomain,
        role: values.role,
        permissions: values.role === UserRole.SYSTEM_ADMIN 
          ? []
          : [
              Permission.VIEW_ASSETS,
              Permission.VIEW_USERS,
              Permission.MANAGE_API_KEYS,
              Permission.VIEW_POINTS,
              Permission.ALLOCATE_POINTS,
              Permission.CONFIGURE_SIGN,
            ],
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      // 保存到本地存储
      setToken(mockToken);
      setUser(mockUser);
      
      message.success('登录成功');

      // 根据角色跳转到不同的页面
      if (mockUser.role === UserRole.SYSTEM_ADMIN) {
        navigate('/system-admin/dashboard');
      } else {
        navigate('/business-admin/dashboard');
      }
    } catch (error: any) {
      message.error(error.message || '登录失败，请检查您的登录信息');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background" />
      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <Title level={2} style={{ marginBottom: 8 }}>
            YC365 商户管理系统
          </Title>
          <Paragraph type="secondary">
            欢迎使用 YC365 预测服务商户管理平台
          </Paragraph>
        </div>

        <Form
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="merchantDomain"
            rules={[{ required: true, message: '请输入商户域名' }]}
          >
            <Input
              prefix={<GlobalOutlined />}
              placeholder="商户域名"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            name="account"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="账号"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select
              placeholder="选择角色"
              suffixIcon={<TeamOutlined />}
            >
              <Option value={UserRole.SYSTEM_ADMIN}>系统管理员</Option>
              <Option value={UserRole.BUSINESS_ADMIN}>业务管理员</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
            注册商户账号请联系 YC365
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

