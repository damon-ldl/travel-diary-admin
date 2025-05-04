import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { setUserInfo } from '../../utils/auth';
import { login } from '../../services/api';
import './index.scss';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      // 使用API服务登录
      const response = await login(values.username, values.password);
      
      if (response && response.success) {
        // 登录成功，只保存用户信息
        setUserInfo(response.user);
        
        message.success(`欢迎回来，${response.user.name}`);
        navigate('/dashboard');
      } else {
        // 验证失败
        message.error('登录失败，请检查用户名和密码');
      }
    } catch (error) {
      // 登录失败
      console.error('登录错误:', error);
      message.error(error.error || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-logo">
          <div className="logo-icon">
            <BookOutlined style={{ fontSize: '24px', color: 'white' }} />
          </div>
          <h1 className="app-title">墨轩旅游日记审核管理系统</h1>
        </div>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className="login-form"
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
            <Button type="primary" htmlType="submit" loading={loading} block className="login-button">
              登录
            </Button>
          </Form.Item>
          <div className="forgot-password">
            <a href="#">忘记密码?</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login; 