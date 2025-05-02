import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, Space, message, Typography, Input, Select, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUserInfo } from '../../utils/auth';
import './index.scss';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Review = () => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [userRole, setUserRole] = useState('reviewer'); // 默认为审核人员

  useEffect(() => {
    // 获取用户角色信息
    const userInfo = getUserInfo();
    if (userInfo && userInfo.role) {
      setUserRole(userInfo.role);
    }

    // 模拟API请求获取所有游记
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          title: '巴黎假期',
          author: '李四',
          date: '2024-05-19',
          content: '巴黎是一座充满浪漫和艺术气息的城市，埃菲尔铁塔、卢浮宫、凯旋门...',
          status: 'pending',
          rejectReason: ''
        },
        {
          id: 2,
          title: '伦敦印象',
          author: '赵六',
          date: '2024-05-17',
          content: '伦敦塔桥、大本钟、白金汉宫，英国的历史与现代完美融合...',
          status: 'pending',
          rejectReason: ''
        },
        {
          id: 3,
          title: '纽约之行',
          author: '陈七',
          date: '2024-05-15',
          content: '纽约是一座永不睡觉的城市，时代广场的霓虹灯，自由女神像的庄严...',
          status: 'pending',
          rejectReason: ''
        },
        {
          id: 4,
          title: '京都之美',
          author: '王八',
          date: '2024-05-10',
          content: '京都古老的寺庙、静谧的日式庭院，以及四季分明的景色...',
          status: 'approved',
          rejectReason: ''
        },
        {
          id: 5,
          title: '首尔购物记',
          author: '李四',
          date: '2024-05-05',
          content: '韩国首尔的购物天堂明洞，各种美食和化妆品让人目不暇接...',
          status: 'rejected',
          rejectReason: '内容过于商业化，缺乏真实的旅行体验描述'
        }
      ];
      setDataSource(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // 监听状态筛选变化
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredData(dataSource);
    } else {
      setFilteredData(dataSource.filter(item => item.status === statusFilter));
    }
  }, [statusFilter, dataSource]);

  const handleApprove = (record) => {
    // 模拟API请求，批准游记
    const updatedData = dataSource.map(item => {
      if (item.id === record.id) {
        return { ...item, status: 'approved' };
      }
      return item;
    });
    setDataSource(updatedData);
    message.success(`《${record.title}》已审核通过`);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      message.error('请填写拒绝原因');
      return;
    }

    // 模拟API请求，拒绝游记
    const updatedData = dataSource.map(item => {
      if (item.id === currentPost.id) {
        return { ...item, status: 'rejected', rejectReason };
      }
      return item;
    });
    setDataSource(updatedData);
    message.warning(`《${currentPost.title}》已被拒绝`);
    setRejectModalVisible(false);
    setRejectReason('');
  };

  const showRejectModal = (record) => {
    setCurrentPost(record);
    setRejectModalVisible(true);
  };

  const handleDelete = (record) => {
    // 模拟API请求，逻辑删除游记
    const updatedData = dataSource.map(item => {
      if (item.id === record.id) {
        return { ...item, deleted: true };
      }
      return item;
    });
    // 从显示列表中过滤掉已删除的
    const filteredData = updatedData.filter(item => !item.deleted);
    setDataSource(filteredData);
    message.success(`《${record.title}》已删除`);
  };

  const viewPost = (record) => {
    setCurrentPost(record);
    setViewModalVisible(true);
  };

  const getStatusTag = (status) => {
    let color = 'orange';
    let text = '待审核';
    
    if (status === 'approved') {
      color = 'green';
      text = '已通过';
    } else if (status === 'rejected') {
      color = 'red';
      text = '未通过';
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

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
      title: '提交日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: '拒绝原因',
      dataIndex: 'rejectReason',
      key: 'rejectReason',
      render: (text, record) => (
        record.status === 'rejected' && text ? text : '-'
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => viewPost(record)}
            type="link"
            size="small"
          >
            查看
          </Button>
          
          {record.status === 'pending' && (
            <>
              <Button 
                icon={<CheckOutlined />} 
                onClick={() => handleApprove(record)}
                type="primary"
                size="small"
              >
                通过
              </Button>
              <Button 
                icon={<CloseOutlined />} 
                onClick={() => showRejectModal(record)}
                danger
                size="small"
              >
                拒绝
              </Button>
            </>
          )}
          
          {userRole === 'admin' && (
            <Popconfirm
              title="确定要删除这篇游记吗？"
              onConfirm={() => handleDelete(record)}
              okText="是"
              cancelText="否"
            >
              <Button 
                icon={<DeleteOutlined />}
                danger
                type="link"
                size="small"
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="review-container">
      <Title level={2}>游记审核</Title>
      
      <div className="filter-section">
        <span>状态筛选：</span>
        <Select 
          value={statusFilter} 
          onChange={setStatusFilter}
          style={{ width: 120, marginBottom: 16 }}
        >
          <Option value="all">全部</Option>
          <Option value="pending">待审核</Option>
          <Option value="approved">已通过</Option>
          <Option value="rejected">未通过</Option>
        </Select>
      </div>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          loading={loading}
          rowKey="id"
        />
      </Card>

      {/* 查看游记弹窗 */}
      {currentPost && (
        <Modal
          title={`查看游记 - ${currentPost.title}`}
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setViewModalVisible(false)}>
              关闭
            </Button>,
            currentPost.status === 'pending' && (
              <>
                <Button 
                  key="approve" 
                  type="primary" 
                  onClick={() => {
                    handleApprove(currentPost);
                    setViewModalVisible(false);
                  }}
                >
                  通过
                </Button>
                <Button 
                  key="reject" 
                  danger 
                  onClick={() => {
                    setViewModalVisible(false);
                    showRejectModal(currentPost);
                  }}
                >
                  拒绝
                </Button>
              </>
            ),
          ]}
          width={700}
        >
          <div className="post-content">
            <p><strong>作者：</strong>{currentPost.author}</p>
            <p><strong>日期：</strong>{currentPost.date}</p>
            <p><strong>状态：</strong>{getStatusTag(currentPost.status)}</p>
            {currentPost.status === 'rejected' && currentPost.rejectReason && (
              <p><strong>拒绝原因：</strong>{currentPost.rejectReason}</p>
            )}
            <Paragraph>{currentPost.content}</Paragraph>
          </div>
        </Modal>
      )}

      {/* 拒绝原因弹窗 */}
      <Modal
        title="填写拒绝原因"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason('');
        }}
      >
        <p>请填写拒绝游记 <strong>{currentPost?.title}</strong> 的原因：</p>
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          placeholder="请详细说明拒绝原因，该信息将展示给用户"
        />
      </Modal>
    </div>
  );
};

export default Review; 