import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tabs,
  Button,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Space,
} from 'antd';
import { PlusOutlined, WalletOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TransactionRecord } from '@/types';
import { formatDateTime, formatCurrency, truncateAddress } from '@/utils/format';
import { mockTransactions, mockDelay } from '@/utils/mockData';

type TransactionType = 'deposit' | 'withdraw';

export const Transactions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TransactionType>('deposit');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [depositData, setDepositData] = useState<TransactionRecord[]>([]);
  const [withdrawData, setWithdrawData] = useState<TransactionRecord[]>([]);
  const [form] = Form.useForm();

  const loadDepositData = async () => {
    try {
      setLoading(true);
      await mockDelay(300);
      // 使用本地模拟数据，只显示充值记录
      setDepositData(mockTransactions.filter(t => t.type === 'deposit'));
    } catch (error: any) {
      message.error(error.message || '加载充值记录失败');
    } finally {
      setLoading(false);
    }
  };

  const loadWithdrawData = async () => {
    try {
      setLoading(true);
      await mockDelay(300);
      // 使用本地模拟数据，只显示提现记录
      setWithdrawData(mockTransactions.filter(t => t.type === 'withdraw'));
    } catch (error: any) {
      message.error(error.message || '加载提现记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'deposit') {
      loadDepositData();
    } else {
      loadWithdrawData();
    }
  }, [activeTab]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await mockDelay(500);
      
      // 创建新交易记录（本地模拟）
      const newTransaction: TransactionRecord = {
        id: Date.now().toString(),
        type: activeTab as 'deposit' | 'withdraw',
        amount: values.amount,
        walletAddress: values.walletAddress,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      // 添加到对应的数据源
      if (activeTab === 'deposit') {
        setDepositData([newTransaction, ...depositData]);
        message.success('充值请求已提交');
      } else {
        setWithdrawData([newTransaction, ...withdrawData]);
        message.success('提现请求已提交');
      }
      
      mockTransactions.push(newTransaction);
      setModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'gold', text: '处理中' },
      completed: { color: 'green', text: '已完成' },
      failed: { color: 'red', text: '失败' },
    };
    const { color, text } = statusMap[status] || { color: 'default', text: status };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns: ColumnsType<TransactionRecord> = [
    {
      title: '交易ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      ellipsis: true,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => formatCurrency(amount),
    },
    {
      title: '钱包地址',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
      render: (address: string) => truncateAddress(address),
    },
    {
      title: '交易哈希',
      dataIndex: 'txHash',
      key: 'txHash',
      render: (hash: string) => hash ? truncateAddress(hash, 10, 10) : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => formatDateTime(time),
    },
    {
      title: '完成时间',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (time?: string) => time ? formatDateTime(time) : '-',
    },
  ];

  const tabItems = [
    {
      key: 'deposit',
      label: '充值记录',
      children: (
        <Table
          loading={loading}
          columns={columns}
          dataSource={depositData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: 'withdraw',
      label: '提现记录',
      children: (
        <Table
          loading={loading}
          columns={columns}
          dataSource={withdrawData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ];

  return (
    <Card
      title="资产管理"
      extra={
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setActiveTab('deposit');
              setModalVisible(true);
            }}
          >
            充值
          </Button>
          <Button
            icon={<WalletOutlined />}
            onClick={() => {
              setActiveTab('withdraw');
              setModalVisible(true);
            }}
          >
            提现
          </Button>
        </Space>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TransactionType)}
        items={tabItems}
      />

      <Modal
        title={activeTab === 'deposit' ? '充值' : '提现'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="walletAddress"
            label="钱包地址"
            rules={[
              { required: true, message: '请输入钱包地址' },
              { len: 42, message: '请输入有效的以太坊地址' },
            ]}
          >
            <Input placeholder="0x..." />
          </Form.Item>
          <Form.Item
            name="amount"
            label="金额 (USDT)"
            rules={[
              { required: true, message: '请输入金额' },
              {
                pattern: /^\d+(\.\d{1,6})?$/,
                message: '请输入有效的金额',
              },
            ]}
          >
            <Input placeholder="请输入金额" type="number" min={0} step={0.01} />
          </Form.Item>
        </Form>
        <div style={{ marginTop: 16, padding: 12, background: '#f0f0f0', borderRadius: 4 }}>
          <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
            注意：{activeTab === 'deposit' ? '充值' : '提现'}操作需要连接钱包并确认交易
          </p>
        </div>
      </Modal>
    </Card>
  );
};

