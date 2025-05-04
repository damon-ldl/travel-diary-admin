import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Button, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, AuditOutlined, BookOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './styles/global.scss';

// 导入页面组件
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Review from './pages/Review';

// 导入工具函数
import { isLoggedIn, logout, getUserInfo } from './utils/auth';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

// 创建内部布局组件
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '管理员' });
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // 获取当前用户信息
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setCurrentUser(userInfo);
    }
  }, []);

  // 处理登出
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>个人资料</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>退出登录</Menu.Item>
    </Menu>
  );

  // 根据当前路径确定选中的菜单项
  const getSelectedKey = () => {
    if (currentPath.includes('/dashboard')) return ['1'];
    if (currentPath.includes('/review')) return ['2'];
    return ['1']; // 默认选中仪表盘
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        style={{ 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          background: '#001529',
          position: 'fixed',
          left: 0,
          height: '100vh',
          zIndex: 999
        }}
        width={220}
        theme="dark"
      >
        <div className="logo-container" style={{ 
          padding: '8px 0', 
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '4px',
          background: '#002140'
        }}>
          {!collapsed ? (
            <>
              <BookOutlined style={{ fontSize: '20px', color: '#1890ff', marginBottom: '4px' }} />
              <Title level={4} style={{ color: '#fff', margin: 0, fontSize: '14px' }}>墨轩旅游日记</Title>
              <div style={{ color: '#1890ff', fontSize: '12px' }}>管理员系统</div>
            </>
          ) : (
            <BookOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          )}
        </div>
        
        <Menu 
          theme="dark" 
          selectedKeys={getSelectedKey()} 
          mode="inline"
          style={{ 
            borderRight: 0,
            padding: '8px 0'
          }}
        >
          <div style={{ 
            padding: '0 16px 8px 24px', 
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: '12px',
            letterSpacing: '1px',
            display: collapsed ? 'none' : 'block'
          }}>
            系统菜单
          </div>
          <Menu.Item key="1" icon={<DashboardOutlined />} style={{ margin: '4px 0' }}>
            <Link to="/dashboard">仪表盘</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<AuditOutlined />} style={{ margin: '4px 0' }}>
            <Link to="/review">游记审核</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: collapsed ? '80px' : '220px' }}>
        <Header className="site-layout-background" style={{ 
          padding: 0, 
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
          position: 'fixed',
          width: 'calc(100% - ' + (collapsed ? '80px' : '220px') + ')',
          right: 0,
          zIndex: 998,
          height: '50px'
        }}>
          <div style={{ float: 'right', marginRight: '20px' }}>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Button type="link">
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} /> 
                {currentUser.name} 
                <span style={{ fontSize: '12px', marginLeft: '4px', color: '#666' }}>
                  ({currentUser.role === 'admin' ? '管理员' : '审核员'})
                </span>
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ 
          margin: '16px', 
          background: '#fff',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          marginTop: '66px'
        }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/review" element={<Review />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#666' }}>墨轩旅游日记管理系统 ©2025</Footer>
      </Layout>
    </Layout>
  );
};

function App() {
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

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App; 