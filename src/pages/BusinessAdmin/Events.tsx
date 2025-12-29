import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Tag,
  message,
  Popconfirm,
  Tooltip,
  Tabs,
} from 'antd';
import {
  EyeOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  UnorderedListOutlined,
  DollarOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { formatDateTime, formatCurrency } from '@/utils/format';
import { mockDelay } from '@/utils/mockData';

interface Event {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'settled' | 'ended';
  startTime: string;
  endTime: string;
  targetAmount?: number;
  currentAmount: number;
  rewardPoints?: number;
  liquidity: number;
  createdAt: string;
}

export const Events: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState('view');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [liquidityModalVisible, setLiquidityModalVisible] = useState(false);
  const [settleModalVisible, setSettleModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [liquidityForm] = Form.useForm();
  const [settleForm] = Form.useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      await mockDelay(300);
      // 使用本地模拟数据
      const mockEvents: Event[] = [
        {
          id: '1',
          name: '春季预测活动',
          description: '参与预测活动，赢取丰厚奖励',
          type: 'prediction',
          status: 'active',
          startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          targetAmount: 100000,
          currentAmount: 75600,
          rewardPoints: 5000,
          liquidity: 50000,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          name: '流动性挖矿活动',
          description: '提供流动性，获得额外收益',
          type: 'liquidity',
          status: 'active',
          startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          targetAmount: 500000,
          currentAmount: 320000,
          rewardPoints: 10000,
          liquidity: 200000,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: '推荐好友活动',
          description: '推荐好友注册，双方获得奖励',
          type: 'referral',
          status: 'settled',
          startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          targetAmount: 50000,
          currentAmount: 45000,
          rewardPoints: 3000,
          liquidity: 0,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setDataSource(mockEvents);
    } catch (error: any) {
      message.error(error.message || '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewDetail = (event: Event) => {
    setSelectedEvent(event);
    setDetailModalVisible(true);
  };

  const handleSettle = (event: Event) => {
    setSelectedEvent(event);
    settleForm.setFieldsValue({
      finalAmount: event.currentAmount,
      finalPoints: event.rewardPoints || 0,
    });
    setSettleModalVisible(true);
  };

  const handleSettleSubmit = async (_values: any) => {
    if (!selectedEvent) return;
    try {
      setLoading(true);
      await mockDelay(500);
      
      // 结算事件（本地模拟）
      const updatedData = dataSource.map(e =>
        e.id === selectedEvent.id ? { ...e, status: 'settled' as const } : e
      );
      setDataSource(updatedData);
      
      message.success('事件结算成功');
      setSettleModalVisible(false);
      settleForm.resetFields();
      loadData();
    } catch (error: any) {
      message.error(error.message || '结算失败');
    } finally {
      setLoading(false);
    }
  };

  const handleManageLiquidity = (event: Event, action: 'add' | 'remove') => {
    setSelectedEvent(event);
    liquidityForm.setFieldsValue({
      action,
      amount: 0,
    });
    setLiquidityModalVisible(true);
  };

  const handleLiquiditySubmit = async (values: any) => {
    if (!selectedEvent) return;
    try {
      setLoading(true);
      await mockDelay(500);
      
      // 管理流动性（本地模拟）
      const updatedData = dataSource.map(e => {
        if (e.id === selectedEvent.id) {
          const newLiquidity =
            values.action === 'add'
              ? e.liquidity + values.amount
              : Math.max(0, e.liquidity - values.amount);
          return { ...e, liquidity: newLiquidity };
        }
        return e;
      });
      setDataSource(updatedData);
      
      message.success(
        values.action === 'add' ? '流动性添加成功' : '流动性回收成功'
      );
      setLiquidityModalVisible(false);
      liquidityForm.resetFields();
      loadData();
    } catch (error: any) {
      message.error(error.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const getTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      prediction: '预测活动',
      trading: '交易活动',
      referral: '推荐活动',
      liquidity: '流动性活动',
      other: '其他',
    };
    return typeMap[type] || type;
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      active: { color: 'green', text: '进行中' },
      settled: { color: 'blue', text: '已结算' },
      ended: { color: 'default', text: '已结束' },
    };
    const { color, text } = statusMap[status] || { color: 'default', text: status };
    return <Tag color={color}>{text}</Tag>;
  };

  // 查看事件 - 基础列
  const baseColumns: ColumnsType<Event> = [
    {
      title: '事件名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeName(type),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '当前金额',
      dataIndex: 'currentAmount',
      key: 'currentAmount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: '目标金额',
      dataIndex: 'targetAmount',
      key: 'targetAmount',
      render: (amount?: number) => amount ? formatCurrency(amount) : '-',
    },
    {
      title: '流动性',
      dataIndex: 'liquidity',
      key: 'liquidity',
      render: (liquidity: number) => formatCurrency(liquidity),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time: string) => formatDateTime(time),
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (time: string) => formatDateTime(time),
    },
  ];

  // 查看事件 - 完整列
  const viewColumns: ColumnsType<Event> = [
    ...baseColumns,
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  // 结算事件 - 列
  const settleColumns: ColumnsType<Event> = [
    ...baseColumns,
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Popconfirm
          title="确定结算该事件吗？"
          description="结算后事件状态将变为已结算"
          onConfirm={() => handleSettle(record)}
        >
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            disabled={record.status !== 'active'}
          >
            结算事件
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // 流动性管理 - 列
  const liquidityColumns: ColumnsType<Event> = [
    ...baseColumns,
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="添加流动性">
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => handleManageLiquidity(record, 'add')}
              disabled={record.status !== 'active'}
            >
              添加
            </Button>
          </Tooltip>
          <Tooltip title="回收流动性">
            <Button
              size="small"
              danger
              icon={<MinusOutlined />}
              onClick={() => handleManageLiquidity(record, 'remove')}
              disabled={record.status !== 'active' || record.liquidity === 0}
            >
              回收
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 获取可结算的事件（仅进行中的）
  const settleableEvents = dataSource.filter(e => e.status === 'active');

  // 获取可管理流动性的事件（仅进行中的）
  const liquidityEvents = dataSource.filter(e => e.status === 'active');

  const tabItems = [
    {
      key: 'view',
      label: (
        <span>
          <UnorderedListOutlined />
          查看事件
        </span>
      ),
      children: (
        <Table
          loading={loading}
          columns={viewColumns}
          dataSource={dataSource}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      ),
    },
    {
      key: 'settle',
      label: (
        <span>
          <DollarOutlined />
          结算事件
        </span>
      ),
      children: (
        <div>
          <div style={{ marginBottom: 16, padding: 12, background: '#f0f0f0', borderRadius: 4 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
              仅显示进行中的事件，可以对这些事件进行结算操作。
            </p>
          </div>
          <Table
            loading={loading}
            columns={settleColumns}
            dataSource={settleableEvents}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        </div>
      ),
    },
    {
      key: 'liquidity',
      label: (
        <span>
          <SwapOutlined />
          添加/回收流动性
        </span>
      ),
      children: (
        <div>
          <div style={{ marginBottom: 16, padding: 12, background: '#f0f0f0', borderRadius: 4 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
              仅显示进行中的事件，可以对这些事件进行流动性管理操作。
            </p>
          </div>
          <Table
            loading={loading}
            columns={liquidityColumns}
            dataSource={liquidityEvents}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        </div>
      ),
    },
  ];

  return (
    <Card title="事件管理">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />

      {/* 事件详情 */}
      <Modal
        title="事件详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedEvent && (
          <div>
            <p><strong>事件名称：</strong>{selectedEvent.name}</p>
            <p><strong>描述：</strong>{selectedEvent.description}</p>
            <p><strong>类型：</strong>{getTypeName(selectedEvent.type)}</p>
            <p><strong>状态：</strong>{getStatusTag(selectedEvent.status)}</p>
            <p><strong>当前金额：</strong>{formatCurrency(selectedEvent.currentAmount)}</p>
            {selectedEvent.targetAmount && (
              <p><strong>目标金额：</strong>{formatCurrency(selectedEvent.targetAmount)}</p>
            )}
            <p><strong>流动性：</strong>{formatCurrency(selectedEvent.liquidity)}</p>
            {selectedEvent.rewardPoints && (
              <p><strong>奖励积分：</strong>{selectedEvent.rewardPoints}</p>
            )}
            <p><strong>开始时间：</strong>{formatDateTime(selectedEvent.startTime)}</p>
            <p><strong>结束时间：</strong>{formatDateTime(selectedEvent.endTime)}</p>
            <p><strong>创建时间：</strong>{formatDateTime(selectedEvent.createdAt)}</p>
          </div>
        )}
      </Modal>

      {/* 结算事件 */}
      <Modal
        title="结算事件"
        open={settleModalVisible}
        onCancel={() => {
          setSettleModalVisible(false);
          settleForm.resetFields();
        }}
        onOk={() => settleForm.submit()}
      >
        <Form form={settleForm} layout="vertical" onFinish={handleSettleSubmit}>
          <Form.Item
            name="finalAmount"
            label="最终金额"
            rules={[{ required: true, message: '请输入最终金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
          <Form.Item
            name="finalPoints"
            label="最终积分"
            rules={[{ required: true, message: '请输入最终积分' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={0}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 管理流动性 */}
      <Modal
        title={liquidityForm.getFieldValue('action') === 'add' ? '添加流动性' : '回收流动性'}
        open={liquidityModalVisible}
        onCancel={() => {
          setLiquidityModalVisible(false);
          liquidityForm.resetFields();
        }}
        onOk={() => liquidityForm.submit()}
      >
        <Form form={liquidityForm} layout="vertical" onFinish={handleLiquiditySubmit}>
          <Form.Item
            name="action"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="amount"
            label="金额"
            rules={[
              { required: true, message: '请输入金额' },
              {
                validator: (_, value) => {
                  const action = liquidityForm.getFieldValue('action');
                  const currentLiquidity = selectedEvent?.liquidity || 0;
                  if (action === 'remove' && value > currentLiquidity) {
                    return Promise.reject(new Error('回收金额不能超过当前流动性'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
