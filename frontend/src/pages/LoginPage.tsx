import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const success = await onLogin(values.username, values.password);
      if (!success) {
        form.setFields([
          {
            name: 'password',
            errors: ['Invalid credentials'],
          },
        ]);
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
              Employee Management
            </Title>
            <Typography.Text type="secondary">
              Please sign in to continue
            </Typography.Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
                { min: 3, message: 'Username must be at least 3 characters!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: '100%' }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
              Default credentials: admin / password
            </Typography.Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default LoginPage;