import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Input,
  Space,
  Button,
  Modal,
  Descriptions,
  Typography,
  message,
} from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MerchantUser, UserOrder } from '@/types';
import { formatDateTime, formatCurrency } from '@/utils/format';
import { mockMerchantUsers, mockUserOrders, mockDelay, paginate } from '@/utils/mockData';

const { Search } = Input;
const { Title } = Typography;

export const Users: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<MerchantUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MerchantUser | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const loadData = async (searchKeyword?: string) => {
    try {
      setLoading(true);
      await mockDelay(300);
      
      // 使用本地模拟数据
      let filteredUsers = [...mockMerchantUsers];
      
      // 如果有搜索关键词，进行过滤
      if (searchKeyword) {
        filteredUsers = filteredUsers.filter(user =>
          user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          user.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          user.phone?.includes(searchKeyword)
        );
      }
      
      // 分页
      const paginatedData = paginate(filteredUsers, page, pageSize);
      setDataSource(paginatedData.list);
      setTotal(paginatedData.total);
    } catch (error: any) {
      message.error(error.message || '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(keyword);
  }, [page]);

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(1);
    loadData(value);
  };

  const handleViewDetail = async (user: MerchantUser) => {
    try {
      await mockDelay(200);
      // 直接使用用户数据
      setSelectedUser(user);
      setDetailModalVisible(true);
    } catch (error: any) {
      message.error(error.message || '加载用户详情失败');
    }
  };

  const handleViewOrders = async (user: MerchantUser) => {
    setSelectedUser(user);
    setOrderModalVisible(true);
    try {
      setOrdersLoading(true);
      await mockDelay(300);
      // 使用本地模拟订单数据
      setOrders([...mockUserOrders]);
    } catch (error: any) {
      message.error(error.message || '加载订单数据失败');
    } finally {
      setOrdersLoading(false);
    }
  };

  const columns: ColumnsType<MerchantUser> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone?: string) => phone || '-',
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
    },
    {
      title: '总消费',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (amount: string) => formatCurrency(amount),
    },
    {
      title: '注册时间',
      dataIndex: 'registeredAt',
      key: 'registeredAt',
      render: (time: string) => formatDateTime(time),
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActiveAt',
      key: 'lastActiveAt',
      render: (time?: string) => time ? formatDateTime(time) : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewOrders(record)}
          >
            订单
          </Button>
        </Space>
      ),
    },
  ];

  const orderColumns: ColumnsType<UserOrder> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => formatCurrency(amount),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, string> = {
          pending: '待处理',
          completed: '已完成',
          failed: '失败',
          cancelled: '已取消',
        };
        return statusMap[status] || status;
      },
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

  return (
    <Card
      title="用户管理"
      extra={
        <Search
          placeholder="搜索用户名、邮箱或手机号"
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      }
    >
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (newPage) => setPage(newPage),
          showSizeChanger: false,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      {/* 用户详情 */}
      <Modal
        title="用户详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="用户名">
              {selectedUser.username}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">
              {selectedUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="手机号">
              {selectedUser.phone || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="订单数">
              {selectedUser.orderCount}
            </Descriptions.Item>
            <Descriptions.Item label="总消费">
              {formatCurrency(selectedUser.totalSpent)}
            </Descriptions.Item>
            <Descriptions.Item label="注册时间">
              {formatDateTime(selectedUser.registeredAt)}
            </Descriptions.Item>
            <Descriptions.Item label="最后活跃">
              {selectedUser.lastActiveAt
                ? formatDateTime(selectedUser.lastActiveAt)
                : '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 用户订单 */}
      <Modal
        title={`用户订单 - ${selectedUser?.username}`}
        open={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        footer={null}
        width={900}
      >
        <Table
          loading={ordersLoading}
          columns={orderColumns}
          dataSource={orders}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Modal>
    </Card>
  );
};

