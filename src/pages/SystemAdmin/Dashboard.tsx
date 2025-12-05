import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
  TeamOutlined,
  WalletOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';

const { Title } = Typography;

interface DashboardStats {
  totalAdmins: number;
  activeAdmins: number;
  totalAssets: string;
  monthlyChange: number;
}

export const SystemAdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalAdmins: 0,
    activeAdmins: 0,
    totalAssets: '0',
    monthlyChange: 0,
  });

  useEffect(() => {
    // 使用模拟数据（无需 API 请求）
    const loadStats = async () => {
      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      setStats({
        totalAdmins: 15,
        activeAdmins: 12,
        totalAssets: '1,234,567.89',
        monthlyChange: 12.5,
      });
    };
    loadStats();
  }, []);

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        欢迎回来，{user?.account}
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="业务管理员总数"
              value={stats.totalAdmins}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃管理员"
              value={stats.activeAdmins}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总资产 (USDT)"
              value={stats.totalAssets}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="月度变化"
              value={stats.monthlyChange}
              precision={2}
              suffix="%"
              prefix={stats.monthlyChange >= 0 ? <RiseOutlined /> : <FallOutlined />}
              valueStyle={{
                color: stats.monthlyChange >= 0 ? '#3f8600' : '#cf1322',
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="快速操作">
            <p>系统管理员工作台功能正在开发中...</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

