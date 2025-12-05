import { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Select,
} from 'antd';
import { StarOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { PointsInfo, PointsAllocation, MerchantUser } from '@/types';
import { formatDateTime, formatNumber } from '@/utils/format';
import { mockPointsInfo, mockPointsAllocations, mockMerchantUsers, mockDelay } from '@/utils/mockData';
import { useAuthStore } from '@/stores/authStore';

const { TextArea } = Input;

export const Points: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pointsInfo, setPointsInfo] = useState<PointsInfo | null>(null);
  const [allocations, setAllocations] = useState<PointsAllocation[]>([]);
  const [users, setUsers] = useState<MerchantUser[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { user } = useAuthStore();
  
  const loadPointsInfo = async () => {
    try {
      await mockDelay(300);
      // 使用本地模拟数据
      setPointsInfo({ ...mockPointsInfo });
    } catch (error: any) {
      message.error(error.message || '加载积分信息失败');
    }
  };

  const loadAllocations = async () => {
    try {
      setLoading(true);
      await mockDelay(300);
      // 使用本地模拟数据
      setAllocations([...mockPointsAllocations]);
    } catch (error: any) {
      message.error(error.message || '加载分配记录失败');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      await mockDelay(200);
      // 使用本地模拟数据
      setUsers([...mockMerchantUsers]);
    } catch (error: any) {
      message.error(error.message || '加载用户列表失败');
    }
  };

  useEffect(() => {
    loadPointsInfo();
    loadAllocations();
    loadUsers();
  }, []);

  const handleAllocate = async (values: any) => {
    if (!pointsInfo || values.points > pointsInfo.remainingPoints) {
      message.error('积分余额不足');
      return;
    }

    try {
      setLoading(true);
      await mockDelay(500);
      
      // 创建分配记录（本地模拟）
      const targetUser = users.find(u => u.id === values.userId);
      const newAllocation: PointsAllocation = {
        id: Date.now().toString(),
        userId: values.userId,
        username: targetUser?.username || 'Unknown',
        points: values.points,
        allocatedAt: new Date().toISOString(),
        allocatedBy: user?.account || 'admin',
        note: values.note,
      };
      
      // 更新积分信息
      const updatedPointsInfo = {
        ...pointsInfo,
        usedPoints: pointsInfo.usedPoints + values.points,
        remainingPoints: pointsInfo.remainingPoints - values.points,
      };
      
      setPointsInfo(updatedPointsInfo);
      setAllocations([newAllocation, ...allocations]);
      mockPointsAllocations.unshift(newAllocation);
      
      message.success('积分分配成功');
      setModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || '积分分配失败');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<PointsAllocation> = [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '积分',
      dataIndex: 'points',
      key: 'points',
      render: (points: number) => `+${formatNumber(points)}`,
    },
    {
      title: '分配人',
      dataIndex: 'allocatedBy',
      key: 'allocatedBy',
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      render: (note?: string) => note || '-',
    },
    {
      title: '分配时间',
      dataIndex: 'allocatedAt',
      key: 'allocatedAt',
      render: (time: string) => formatDateTime(time),
    },
  ];

  const usedPercent = pointsInfo?.totalPoints
    ? (pointsInfo.usedPoints / pointsInfo.totalPoints) * 100
    : 0;

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="总积分"
              value={pointsInfo?.totalPoints || 0}
              prefix={<StarOutlined />}
              formatter={(value) => formatNumber(value as number)}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="已使用积分"
              value={pointsInfo?.usedPoints || 0}
              formatter={(value) => formatNumber(value as number)}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="剩余积分"
              value={pointsInfo?.remainingPoints || 0}
              formatter={(value) => formatNumber(value as number)}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="积分分配记录"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            分配积分
          </Button>
        }
        style={{ marginTop: 16 }}
      >
        <Table
          loading={loading}
          columns={columns}
          dataSource={allocations}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 分配积分 */}
      <Modal
        title="分配积分"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAllocate}>
          <Form.Item
            name="userId"
            label="选择用户"
            rules={[{ required: true, message: '请选择用户' }]}
          >
            <Select
              showSearch
              placeholder="请选择用户"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={users.map((user) => ({
                label: `${user.username} (${user.email})`,
                value: user.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="points"
            label="积分数量"
            rules={[
              { required: true, message: '请输入积分数量' },
              {
                type: 'number',
                min: 1,
                message: '积分数量必须大于 0',
              },
              {
                validator: (_, value) => {
                  if (pointsInfo && value > pointsInfo.remainingPoints) {
                    return Promise.reject(
                      new Error(`积分余额不足，当前剩余 ${formatNumber(pointsInfo.remainingPoints)}`)
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder="请输入积分数量"
              style={{ width: '100%' }}
              min={1}
              precision={0}
            />
          </Form.Item>
          <Form.Item name="note" label="备注">
            <TextArea rows={3} placeholder="请输入备注（可选）" />
          </Form.Item>
        </Form>
        {pointsInfo && (
          <div style={{ marginTop: 8, padding: 12, background: '#f0f0f0', borderRadius: 4 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
              当前剩余积分：{formatNumber(pointsInfo.remainingPoints)}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

