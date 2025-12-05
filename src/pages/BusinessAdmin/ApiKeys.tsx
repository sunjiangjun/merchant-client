import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Tag,
  message,
  Popconfirm,
  Typography,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CopyOutlined,
  EyeOutlined,
  StopOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ApiKey } from '@/types';
import { formatDateTime, formatTraffic } from '@/utils/format';
import { mockApiKeys, mockDelay } from '@/utils/mockData';

const { Paragraph } = Typography;

export const ApiKeys: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ApiKey[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [trafficModalVisible, setTrafficModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [trafficData, setTrafficData] = useState<any>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      await mockDelay(300);
      // 使用本地模拟数据
      setDataSource([...mockApiKeys]);
    } catch (error: any) {
      message.error(error.message || '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (values: any) => {
    if (dataSource.length >= 5) {
      message.error('最多只能创建 5 个 API Key');
      return;
    }

    try {
      setLoading(true);
      await mockDelay(500);
      
      // 生成新的 API Key（本地模拟）
      const newKey: ApiKey = {
        id: Date.now().toString(),
        key: `yk_${Date.now()}_${Math.random().toString(36).substring(2, 42)}`,
        name: values.name,
        createdAt: new Date().toISOString(),
        traffic: 0,
        status: 'active',
      };
      
      setDataSource([...dataSource, newKey]);
      mockApiKeys.push(newKey);
      message.success('创建成功');
      setModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || '创建失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await mockDelay(500);
      
      // 删除 API Key（本地模拟）
      const updatedData = dataSource.filter(key => key.id !== id);
      setDataSource(updatedData);
      message.success('删除成功');
    } catch (error: any) {
      message.error(error.message || '删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (id: string) => {
    try {
      setLoading(true);
      await mockDelay(500);
      
      // 重置 API Key（本地模拟）
      const updatedData = dataSource.map(key =>
        key.id === id
          ? { ...key, key: `yk_${Date.now()}_${Math.random().toString(36).substring(2, 42)}` }
          : key
      );
      setDataSource(updatedData);
      message.success('重置成功');
    } catch (error: any) {
      message.error(error.message || '重置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (apiKey: ApiKey) => {
    const newStatus = apiKey.status === 'active' ? 'disabled' : 'active';
    try {
      setLoading(true);
      await mockDelay(500);
      
      // 切换状态（本地模拟）
      const updatedData = dataSource.map(key =>
        key.id === apiKey.id ? { ...key, status: newStatus } : key
      );
      setDataSource(updatedData);
      message.success(`已${newStatus === 'active' ? '启用' : '禁用'}`);
    } catch (error: any) {
      message.error(error.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTraffic = async (apiKey: ApiKey) => {
    setSelectedKey(apiKey);
    try {
      await mockDelay(300);
      // 使用本地模拟数据
      setTrafficData({
        traffic: apiKey.traffic,
        details: {},
      });
      setTrafficModalVisible(true);
    } catch (error: any) {
      message.error(error.message || '加载流量数据失败');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  const columns: ColumnsType<ApiKey> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'API Key',
      dataIndex: 'key',
      key: 'key',
      render: (key: string) => (
        <Space>
          <Paragraph
            copyable={{
              text: key,
              tooltips: ['复制', '已复制'],
            }}
            style={{ marginBottom: 0, fontFamily: 'monospace' }}
          >
            {key.substring(0, 16)}...
          </Paragraph>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '流量',
      dataIndex: 'traffic',
      key: 'traffic',
      render: (traffic: number) => formatTraffic(traffic),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => formatDateTime(time),
    },
    {
      title: '最后使用',
      dataIndex: 'lastUsedAt',
      key: 'lastUsedAt',
      render: (time?: string) => time ? formatDateTime(time) : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="查看流量统计">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewTraffic(record)}
            >
              流量
            </Button>
          </Tooltip>
          <Popconfirm
            title="确定重置该 API Key 吗？"
            description="重置后原 Key 将失效"
            onConfirm={() => handleRegenerate(record.id)}
          >
            <Button type="link" size="small" icon={<ReloadOutlined />}>
              重置
            </Button>
          </Popconfirm>
          <Button
            type="link"
            size="small"
            icon={record.status === 'active' ? <StopOutlined /> : <CheckOutlined />}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
          <Popconfirm
            title="确定删除该 API Key 吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="API Key 管理"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          disabled={dataSource.length >= 5}
        >
          创建 API Key ({dataSource.length}/5)
        </Button>
      }
    >
      <div style={{ marginBottom: 16, padding: 12, background: '#f0f0f0', borderRadius: 4 }}>
        <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
          注意：一个商户最多可以创建 5 个 API Key。请妥善保管您的 API Key，不要泄露给他人。
        </p>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={false}
      />

      {/* 创建 API Key */}
      <Modal
        title="创建 API Key"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入 API Key 名称" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 流量统计 */}
      <Modal
        title={`流量统计 - ${selectedKey?.name}`}
        open={trafficModalVisible}
        onCancel={() => setTrafficModalVisible(false)}
        footer={null}
        width={600}
      >
        {trafficData && (
          <div style={{ padding: '20px 0' }}>
            <p style={{ fontSize: 24, textAlign: 'center', margin: 0 }}>
              <strong>{formatTraffic(trafficData.traffic)}</strong>
            </p>
            <p style={{ textAlign: 'center', color: '#666', marginTop: 8 }}>
              总流量
            </p>
            {/* 可以添加更多流量详情展示 */}
          </div>
        )}
      </Modal>
    </Card>
  );
};

