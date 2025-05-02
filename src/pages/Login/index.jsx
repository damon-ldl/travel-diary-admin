import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { validateLogin, setToken, setUserInfo } from '../../utils/auth';
import './index.scss';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    
    // 使用模拟登录验证
    const userInfo = validateLogin(values.username, values.password);
    
    if (userInfo) {
      // 登录成功
      const token = `mock-token-${Date.now()}`;
      setToken(token);
      setUserInfo(userInfo);
      
      message.success(`欢迎回来，${userInfo.name}`);
      navigate('/dashboard');
    } else {
      // 登录失败
      message.error('用户名或密码错误');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <Card className="login-card" title="旅行日记管理系统">
        <div className="login-tip">
          <p>测试账号：</p>
          <p>管理员 - admin / admin123</p>
          <p>审核员 - reviewer / reviewer123</p>
        </div>
        
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