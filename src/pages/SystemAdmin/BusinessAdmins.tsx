import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Checkbox,
  Tag,
  message,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, KeyOutlined, StopOutlined, CheckOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { BusinessAdmin, Permission } from '@/types';
import { formatDateTime } from '@/utils/format';
import { mockBusinessAdmins, mockDelay } from '@/utils/mockData';

const PERMISSIONS = [
  { label: '查看资产', value: 'view_assets' },
  { label: '查看用户', value: 'view_users' },
  { label: '管理API Key', value: 'manage_api_keys' },
  { label: '查看积分', value: 'view_points' },
  { label: '分配积分', value: 'allocate_points' },
  { label: '配置Sign服务', value: 'configure_sign' },
];

export const BusinessAdmins: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<BusinessAdmin[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<BusinessAdmin | null>(null);
  const [form] = Form.useForm();
  const [permissionForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      await mockDelay(300);
      // 使用本地模拟数据
      setDataSource([...mockBusinessAdmins]);
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
    try {
      setLoading(true);
      await mockDelay(500);
      
      // 创建新的业务管理员（本地模拟）
      const newAdmin: BusinessAdmin = {
        id: Date.now().toString(),
        account: values.account,
        merchantDomain: 'test.yc365.com',
        permissions: values.permissions || [],
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      
      // 添加到数据源
      setDataSource([...dataSource, newAdmin]);
      mockBusinessAdmins.push(newAdmin);
      
      message.success('创建成功');
      setCreateModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || '创建失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermissions = async (values: any) => {
    if (!selectedAdmin) return;
    try {
      setLoading(true);
      await mockDelay(500);
      
      // 更新权限（本地模拟）
      const updatedData = dataSource.map(admin =>
        admin.id === selectedAdmin.id
          ? { ...admin, permissions: values.permissions }
          : admin
      );
      setDataSource(updatedData);
      
      message.success('更新权限成功');
      setPermissionModalVisible(false);
    } catch (error: any) {
      message.error(error.message || '更新权限失败');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: any) => {
    if (!selectedAdmin) return;
    try {
      setLoading(true);
      await mockDelay(500);
      
      // 密码重置（本地模拟）
      message.success('密码重置成功');
      setResetPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.message || '密码重置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (admin: BusinessAdmin) => {
    const newStatus = admin.status === 'active' ? 'disabled' : 'active';
    try {
      setLoading(true);
      await mockDelay(500);
      
      // 切换状态（本地模拟）
      const updatedData = dataSource.map(a =>
        a.id === admin.id ? { ...a, status: newStatus } : a
      );
      setDataSource(updatedData);
      
      message.success(`已${newStatus === 'active' ? '启用' : '禁用'}`);
    } catch (error: any) {
      message.error(error.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<BusinessAdmin> = [
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '商户域名',
      dataIndex: 'merchantDomain',
      key: 'merchantDomain',
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: Permission[]) => (
        <>
          {permissions.map((p) => (
            <Tag key={p} color="blue">
              {PERMISSIONS.find((perm) => perm.value === p)?.label || p}
            </Tag>
          ))}
        </>
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
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedAdmin(record);
              permissionForm.setFieldsValue({ permissions: record.permissions });
              setPermissionModalVisible(true);
            }}
          >
            权限
          </Button>
          <Button
            type="link"
            size="small"
            icon={<KeyOutlined />}
            onClick={() => {
              setSelectedAdmin(record);
              setResetPasswordModalVisible(true);
            }}
          >
            重置密码
          </Button>
          <Popconfirm
            title={`确定${record.status === 'active' ? '禁用' : '启用'}该管理员吗？`}
            onConfirm={() => handleToggleStatus(record)}
          >
            <Button
              type="link"
              size="small"
              danger={record.status === 'active'}
              icon={record.status === 'active' ? <StopOutlined /> : <CheckOutlined />}
            >
              {record.status === 'active' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="业务管理员管理"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          创建业务管理员
        </Button>
      }
    >
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* 创建业务管理员 */}
      <Modal
        title="创建业务管理员"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="account"
            label="账号"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input placeholder="请输入账号" />
          </Form.Item>
          <Form.Item
            name="password"
            label="初始密码"
            rules={[{ required: true, message: '请输入初始密码' }]}
          >
            <Input.Password placeholder="请输入初始密码" />
          </Form.Item>
          <Form.Item name="permissions" label="权限">
            <Checkbox.Group options={PERMISSIONS} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 更新权限 */}
      <Modal
        title="更新权限"
        open={permissionModalVisible}
        onCancel={() => setPermissionModalVisible(false)}
        onOk={() => permissionForm.submit()}
      >
        <Form
          form={permissionForm}
          layout="vertical"
          onFinish={handleUpdatePermissions}
        >
          <Form.Item name="permissions" label="权限">
            <Checkbox.Group options={PERMISSIONS} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 重置密码 */}
      <Modal
        title="重置密码"
        open={resetPasswordModalVisible}
        onCancel={() => {
          setResetPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        onOk={() => passwordForm.submit()}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleResetPassword}
        >
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

