import { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Space,
} from 'antd';
import { SaveOutlined, GlobalOutlined, LinkOutlined } from '@ant-design/icons';
import { mockDelay } from '@/utils/mockData';

interface DomainConfig {
  merchantDomain: string;
  callbackUrl: string;
}

export const DomainConfig: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      await mockDelay(300);
      // 使用本地模拟数据
      form.setFieldsValue({
        merchantDomain: 'test.yc365.com',
        callbackUrl: 'https://test.yc365.com/callback',
      });
    } catch (error: any) {
      message.error(error.message || '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (values: DomainConfig) => {
    try {
      setLoading(true);
      await mockDelay(500);
      
      // 保存配置（本地模拟）
      console.log('保存配置:', values);
      message.success('配置保存成功');
    } catch (error: any) {
      message.error(error.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="域名与回调地址配置">
      <div style={{ marginBottom: 24, padding: 12, background: '#f0f0f0', borderRadius: 4 }}>
        <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
          配置商户域名和回调地址，用于接收系统通知和回调。
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="merchantDomain"
          label="商户域名"
          rules={[
            { required: true, message: '请输入商户域名' },
            {
              pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/,
              message: '请输入有效的域名格式',
            },
          ]}
        >
          <Input
            prefix={<GlobalOutlined />}
            placeholder="例如: merchant.yc365.com"
          />
        </Form.Item>

        <Form.Item
          name="callbackUrl"
          label="回调地址"
          rules={[
            { required: true, message: '请输入回调地址' },
            {
              type: 'url',
              message: '请输入有效的 URL 地址',
            },
          ]}
        >
          <Input
            prefix={<LinkOutlined />}
            placeholder="https://your-domain.com/callback"
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
              保存配置
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

