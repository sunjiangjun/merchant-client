import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
  WalletOutlined,
  TeamOutlined,
  ApiOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/format';

const { Title } = Typography;

interface DashboardStats {
  totalAssets: string;
  usedAssets: string;
  remainingAssets: string;
  userCount: number;
  apiKeyCount: number;
  totalPoints: number;
}

export const BusinessAdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalAssets: '0',
    usedAssets: '0',
    remainingAssets: '0',
    userCount: 0,
    apiKeyCount: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    // 使用模拟数据（无需 API 请求）
    const loadStats = async () => {
      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      setStats({
        totalAssets: '500000.00',
        usedAssets: '123456.78',
        remainingAssets: '376543.22',
        userCount: 1250,
        apiKeyCount: 3,
        totalPoints: 50000,
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
              title="总资产"
              value={stats.totalAssets}
              prefix={<WalletOutlined />}
              suffix="USDT"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已使用资产"
              value={stats.usedAssets}
              suffix="USDT"
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="剩余资产"
              value={stats.remainingAssets}
              suffix="USDT"
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={stats.userCount}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="API Keys"
              value={stats.apiKeyCount}
              prefix={<ApiOutlined />}
              suffix="/ 5"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="积分余额"
              value={stats.totalPoints}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="快速操作">
            <p>业务管理员工作台功能正在开发中...</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

