import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, AuditOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './styles/global.scss';

// 导入页面组件
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Review from './pages/Review';

// 导入工具函数
import { isLoggedIn, logout, getUserInfo } from './utils/auth';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '管理员' });

  // 获取当前用户信息
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setCurrentUser(userInfo);
    }
  }, []);

  // 检查登录状态
  const checkAuth = () => {
    return isLoggedIn();
  };

  // 受保护的路由
  const ProtectedRoute = ({ children }) => {
    if (!checkAuth()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // 处理登出
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>个人资料</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>退出登录</Menu.Item>
    </Menu>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                  <div className="logo" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.3)' }} />
                  <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                      <a href="/dashboard">仪表盘</a>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<AuditOutlined />}>
                      <a href="/review">游记审核</a>
                    </Menu.Item>
                  </Menu>
                </Sider>
                <Layout className="site-layout">
                  <Header className="site-layout-background" style={{ padding: 0, background: '#fff' }}>
                    <div style={{ float: 'right', marginRight: '20px' }}>
                      <Dropdown overlay={userMenu} placement="bottomRight">
                        <Button type="link">
                          <Avatar icon={<UserOutlined />} /> 
                          {currentUser.name} 
                          <span style={{ fontSize: '12px', marginLeft: '4px', color: '#999' }}>
                            ({currentUser.role === 'admin' ? '管理员' : '审核员'})
                          </span>
                        </Button>
                      </Dropdown>
                    </div>
                  </Header>
                  <Content style={{ margin: '0 16px' }}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/review" element={<Review />} />
                    </Routes>
                  </Content>
                  <Footer style={{ textAlign: 'center' }}>旅行日记管理系统 ©2023</Footer>
                </Layout>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App; 