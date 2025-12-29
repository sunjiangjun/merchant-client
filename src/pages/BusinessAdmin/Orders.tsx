import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Input,
  Space,
  Button,
  Select,
  DatePicker,
  Tag,
  message,
  Modal,
  Descriptions,
} from 'antd';
import { EyeOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UserOrder } from '@/types';
import { formatDateTime, formatCurrency } from '@/utils/format';
import { mockUserOrders, mockDelay } from '@/utils/mockData';
import dayjs, { Dayjs } from 'dayjs';

const { Search } = Input;
const { RangePicker } = DatePicker;

export const Orders: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<UserOrder[]>([]);
  const [filteredData, setFilteredData] = useState<UserOrder[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      await mockDelay(300);
      // 使用本地模拟数据 - 合并所有用户的订单
      const allOrders: UserOrder[] = [];
      // 模拟多个用户的订单
      for (let i = 1; i <= 10; i++) {
        const userOrders = mockUserOrders.map(order => ({
          ...order,
          id: `${i}-${order.id}`,
          userId: String(i),
          orderNo: `ORD${Date.now()}${i}${order.id}`,
        }));
        allOrders.push(...userOrders);
      }
      setDataSource(allOrders);
      setFilteredData(allOrders);
    } catch (error: any) {
      message.error(error.message || '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 应用筛选
  useEffect(() => {
    let filtered = [...dataSource];

    // 状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // 日期范围筛选
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(order => {
        const orderDate = dayjs(order.createdAt);
        return orderDate.isAfter(dateRange[0]!) && orderDate.isBefore(dateRange[1]!.add(1, 'day'));
      });
    }

    // 关键词搜索（订单号）
    if (searchKeyword) {
      filtered = filtered.filter(order =>
        order.orderNo.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [statusFilter, dateRange, searchKeyword, dataSource]);

  const handleViewDetail = (order: UserOrder) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const handleResetFilter = () => {
    setStatusFilter('all');
    setDateRange([null, null]);
    setSearchKeyword('');
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'gold', text: '待处理' },
      completed: { color: 'green', text: '已完成' },
      failed: { color: 'red', text: '失败' },
      cancelled: { color: 'default', text: '已取消' },
    };
    const { color, text } = statusMap[status] || { color: 'default', text: status };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns: ColumnsType<UserOrder> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 200,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => formatCurrency(amount),
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: '待处理', value: 'pending' },
        { text: '已完成', value: 'completed' },
        { text: '失败', value: 'failed' },
        { text: '已取消', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => formatDateTime(time),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '完成时间',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (time?: string) => time ? formatDateTime(time) : '-',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="订单管理"
      extra={
        <Space>
          <Search
            placeholder="搜索订单号"
            allowClear
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ width: 200 }}
          />
          <Button icon={<FilterOutlined />} onClick={handleResetFilter}>
            重置筛选
          </Button>
        </Space>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <span>状态筛选：</span>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
          >
            <Select.Option value="all">全部</Select.Option>
            <Select.Option value="pending">待处理</Select.Option>
            <Select.Option value="completed">已完成</Select.Option>
            <Select.Option value="failed">失败</Select.Option>
            <Select.Option value="cancelled">已取消</Select.Option>
          </Select>

          <span>日期范围：</span>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
            format="YYYY-MM-DD"
          />
        </Space>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条订单`,
        }}
        scroll={{ x: 1000 }}
      />

      {/* 订单详情 */}
      <Modal
        title="订单详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedOrder && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="订单号">
              {selectedOrder.orderNo}
            </Descriptions.Item>
            <Descriptions.Item label="用户ID">
              {selectedOrder.userId}
            </Descriptions.Item>
            <Descriptions.Item label="金额">
              {formatCurrency(selectedOrder.amount)}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {getStatusTag(selectedOrder.status)}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {formatDateTime(selectedOrder.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="完成时间">
              {selectedOrder.completedAt
                ? formatDateTime(selectedOrder.completedAt)
                : '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
};

