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
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { SignServiceConfig } from '@/types';
import { formatDateTime } from '@/utils/format';
import { mockSignConfigs, mockDelay } from '@/utils/mockData';

export const SignConfig: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<SignServiceConfig[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SignServiceConfig | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      await mockDelay(300);
      // 使用本地模拟数据
      setDataSource([...mockSignConfigs]);
    } catch (error: any) {
      message.error(error.message || '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTest = async (_url: string) => {
    try {
      await mockDelay(500);
      // 模拟测试成功
      message.success('连接测试成功');
    } catch (error: any) {
      message.error(error.message || '连接测试失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await mockDelay(500);
      
      if (editingConfig) {
        // 更新配置（本地模拟）
        const updatedData = dataSource.map(config =>
          config.id === editingConfig.id
            ? { ...config, ...values, updatedAt: new Date().toISOString() }
            : config
        );
        setDataSource(updatedData);
        message.success('更新成功');
      } else {
        // 添加配置（本地模拟）
        const newConfig: SignServiceConfig = {
          id: Date.now().toString(),
          url: values.url,
          description: values.description,
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setDataSource([...dataSource, newConfig]);
        mockSignConfigs.push(newConfig);
        message.success('添加成功');
      }
      
      setModalVisible(false);
      form.resetFields();
      setEditingConfig(null);
    } catch (error: any) {
      message.error(error.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const activeCount = dataSource.filter((item) => item.isActive).length;
    const isDeleting = dataSource.find((item) => item.id === id)?.isActive;

    if (activeCount === 1 && isDeleting) {
      message.error('至少保留一个可用的 Sign 服务配置');
      return;
    }

    try {
      setLoading(true);
      await mockDelay(500);
      
      // 删除配置（本地模拟）
      const updatedData = dataSource.filter(config => config.id !== id);
      setDataSource(updatedData);
      message.success('删除成功');
    } catch (error: any) {
      message.error(error.message || '删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      setLoading(true);
      await mockDelay(500);
      
      // 激活配置（本地模拟）
      const updatedData = dataSource.map(config => ({
        ...config,
        isActive: config.id === id,
      }));
      setDataSource(updatedData);
      message.success('已激活');
    } catch (error: any) {
      message.error(error.message || '激活失败');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<SignServiceConfig> = [
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'default'}>
          {isActive ? '当前使用' : '未激活'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => formatDateTime(time),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (time: string) => formatDateTime(time),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleTest(record.url)}
          >
            测试
          </Button>
          {!record.isActive && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleActivate(record.id)}
            >
              激活
            </Button>
          )}
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingConfig(record);
              form.setFieldsValue({
                url: record.url,
                description: record.description,
              });
              setModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该配置吗？"
            onConfirm={() => handleDelete(record.id)}
            disabled={record.isActive && dataSource.filter((d) => d.isActive).length === 1}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={record.isActive && dataSource.filter((d) => d.isActive).length === 1}
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
      title="Sign 服务配置"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          添加配置
        </Button>
      }
    >
      <div style={{ marginBottom: 16, padding: 12, background: '#f0f0f0', borderRadius: 4 }}>
        <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
          注意：必须确保有且仅有一个 Sign URL 是可用的。如果 Sign 是私有化部署，请配置正确的访问路径并确保签名服务安全、可靠、稳定。
        </p>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title={editingConfig ? '编辑配置' : '添加配置'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingConfig(null);
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="url"
            label="Sign 服务 URL"
            rules={[
              { required: true, message: '请输入 Sign 服务 URL' },
              { type: 'url', message: '请输入有效的 URL' },
            ]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入配置描述" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

