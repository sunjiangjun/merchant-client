import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, Empty, Progress } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import type { MerchantAssets } from '@/types';
import { formatCurrency, truncateAddress } from '@/utils/format';
import { mockMerchantAssets, mockDelay } from '@/utils/mockData';

export const Assets: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<MerchantAssets | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      await mockDelay(300);
      // 使用本地模拟数据
      setAssets({ ...mockMerchantAssets });
    } catch (error) {
      console.error('加载资产数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!assets) {
    return (
      <Card>
        <Empty description="暂无资产数据" />
      </Card>
    );
  }

  const usedPercent = assets.totalAssets
    ? (parseFloat(assets.usedAssets) / parseFloat(assets.totalAssets)) * 100
    : 0;

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="总资产"
              value={assets.totalAssets}
              prefix={<WalletOutlined />}
              suffix="USDT"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="已使用资产"
              value={assets.usedAssets}
              suffix="USDT"
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="剩余资产"
              value={assets.remainingAssets}
              suffix="USDT"
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="资产使用情况">
            <div style={{ padding: '20px 0' }}>
              <Progress
                percent={usedPercent}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                format={(percent) => `${percent?.toFixed(2)}%`}
              />
              <div style={{ marginTop: 16, textAlign: 'center', color: '#666' }}>
                已使用 {formatCurrency(assets.usedAssets)} / 总资产{' '}
                {formatCurrency(assets.totalAssets)}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {assets.walletAddress && (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="钱包信息">
              <div style={{ padding: '20px 0' }}>
                <p>
                  <strong>钱包地址：</strong>
                  <span style={{ fontFamily: 'monospace', marginLeft: 8 }}>
                    {truncateAddress(assets.walletAddress, 12, 12)}
                  </span>
                </p>
                <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
                  充值和提现操作需要连接此钱包地址
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

