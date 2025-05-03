import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { setToken, setUserInfo } from '../../utils/auth';
import { login } from '../../services/api';
import './index.scss';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      // 调用登录API
      const response = await login(values.username, values.password);
      
      // 登录成功
      setToken(response.token);
      setUserInfo({
        id: response.id,
        username: response.username,
        nickname: response.nickname,
        avatarUrl: response.avatarUrl,
        role: 'admin' // 临时处理，实际应该从API响应中获取角色
      });
      
      message.success(`欢迎回来，${response.nickname}`);
      navigate('/dashboard');
    } catch (error) {
      // 登录失败
      message.error(error.error || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" title="旅行日记管理系统">
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 