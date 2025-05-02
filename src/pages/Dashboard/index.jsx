import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Typography } from 'antd';
import { UserOutlined, FileOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './index.scss';

const { Title } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    pendingReview: 0,
    totalUsers: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟API请求
    setTimeout(() => {
      setStats({
        totalPosts: 154,
        pendingReview: 23,
        totalUsers: 87
      });
      
      setRecentPosts([
        { key: '1', title: '东京之旅', author: '张三', date: '2023-05-20', status: '已审核' },
        { key: '2', title: '巴黎假期', author: '李四', date: '2023-05-19', status: '待审核' },
        { key: '3', title: '纽约掠影', author: '王五', date: '2023-05-18', status: '已审核' },
        { key: '4', title: '伦敦印象', author: '赵六', date: '2023-05-17', status: '待审核' },
        { key: '5', title: '罗马假日', author: '钱七', date: '2023-05-16', status: '已审核' },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '发布日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === '已审核' ? '#52c41a' : '#faad14' }}>
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      <Title level={2}>系统概览</Title>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总日记数"
              value={stats.totalPosts}
              prefix={<FileOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="待审核"
              value={stats.pendingReview}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="用户数"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <div className="recent-posts">
        <Title level={3}>最近发布</Title>
        <Table 
          columns={columns} 
          dataSource={recentPosts} 
          loading={loading}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Dashboard; 