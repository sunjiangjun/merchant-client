import { useState } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  message,
  Space,
  Select,
} from 'antd';
import { SaveOutlined, CalendarOutlined } from '@ant-design/icons';
import { mockDelay } from '@/utils/mockData';
import dayjs, { Dayjs } from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface EventFormData {
  name: string;
  description: string;
  type: string;
  startTime: Dayjs;
  endTime: Dayjs;
  targetAmount?: number;
  rewardPoints?: number;
}

export const CreateEvent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await mockDelay(500);
      
      // 创建事件（本地模拟）
      console.log('创建事件:', values);
      message.success('事件创建成功');
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || '创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="创建事件">
      <div style={{ marginBottom: 24, padding: 12, background: '#f0f0f0', borderRadius: 4 }}>
        <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
          创建新的事件，用于激励用户参与和提升活跃度。
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 800 }}
      >
        <Form.Item
          name="name"
          label="事件名称"
          rules={[{ required: true, message: '请输入事件名称' }]}
        >
          <Input placeholder="请输入事件名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="事件描述"
          rules={[{ required: true, message: '请输入事件描述' }]}
        >
          <TextArea rows={4} placeholder="请输入事件描述" />
        </Form.Item>

        <Form.Item
          name="type"
          label="事件类型"
          rules={[{ required: true, message: '请选择事件类型' }]}
        >
          <Select placeholder="请选择事件类型">
            <Select.Option value="prediction">预测活动</Select.Option>
            <Select.Option value="trading">交易活动</Select.Option>
            <Select.Option value="referral">推荐活动</Select.Option>
            <Select.Option value="liquidity">流动性活动</Select.Option>
            <Select.Option value="other">其他</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="timeRange"
          label="活动时间"
          rules={[{ required: true, message: '请选择活动时间' }]}
        >
          <RangePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="targetAmount"
          label="目标金额（可选）"
        >
          <InputNumber
            placeholder="请输入目标金额"
            style={{ width: '100%' }}
            min={0}
            precision={2}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="rewardPoints"
          label="奖励积分（可选）"
        >
          <InputNumber
            placeholder="请输入奖励积分"
            style={{ width: '100%' }}
            min={0}
            precision={0}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              创建事件
            </Button>
            <Button onClick={() => form.resetFields()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

