import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, Space, message, Typography, Input, Select, Popconfirm, Image } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { getDiaries, approveDiary, rejectDiary, deleteDiary, getDiaryById } from '../../services/api';
import './index.scss';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Review = () => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentDiary, setCurrentDiary] = useState(null);
  const [diaryDetail, setDiaryDetail] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 加载游记列表
  const fetchDiaries = async (page = 1, status = null) => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize: pagination.pageSize
      };
      
      if (status && status !== 'all') {
        params.status = status;
      }
      
      const response = await getDiaries(params);
      setDataSource(response.diaries || []);
      setPagination({
        ...pagination,
        current: page,
        total: response.total || 0
      });
    } catch (error) {
      message.error(error.error || '获取游记列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载游记详情
  const fetchDiaryDetail = async (id) => {
    try {
      const detail = await getDiaryById(id);
      setDiaryDetail(detail);
    } catch (error) {
      message.error(error.error || '获取游记详情失败');
    }
  };

  useEffect(() => {
    fetchDiaries(1, statusFilter !== 'all' ? statusFilter : null);
  }, [statusFilter]);

  const handleTableChange = (pagination) => {
    fetchDiaries(pagination.current, statusFilter !== 'all' ? statusFilter : null);
  };

  const handleApprove = async (record) => {
    try {
      await approveDiary(record.id);
      message.success(`《${record.title}》已审核通过`);
      fetchDiaries(pagination.current, statusFilter !== 'all' ? statusFilter : null);
    } catch (error) {
      message.error(error.error || '审核操作失败');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.error('请填写拒绝原因');
      return;
    }

    try {
      await rejectDiary(currentDiary.id, rejectReason);
      message.warning(`《${currentDiary.title}》已被拒绝`);
      fetchDiaries(pagination.current, statusFilter !== 'all' ? statusFilter : null);
      setRejectModalVisible(false);
      setRejectReason('');
    } catch (error) {
      message.error(error.error || '拒绝操作失败');
    }
  };

  const showRejectModal = (record) => {
    setCurrentDiary(record);
    setRejectModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await deleteDiary(record.id);
      message.success(`《${record.title}》已删除`);
      fetchDiaries(pagination.current, statusFilter !== 'all' ? statusFilter : null);
    } catch (error) {
      message.error(error.error || '删除操作失败');
    }
  };

  const viewDiary = (record) => {
    setCurrentDiary(record);
    fetchDiaryDetail(record.id);
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
    } else if (status === 'deleted') {
      color = 'gray';
      text = '已删除';
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
      render: (author) => author?.nickname || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: '拒绝原因',
      dataIndex: 'reason',
      key: 'reason',
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
            onClick={() => viewDiary(record)}
            type="link"
          >
            查看
          </Button>
          
          {record.status === 'pending' && (
            <>
              <Button 
                type="text" 
                style={{ color: 'green' }} 
                icon={<CheckOutlined />} 
                onClick={() => handleApprove(record)}
              >
                通过
              </Button>
              
              <Button 
                type="text" 
                danger 
                icon={<CloseOutlined />} 
                onClick={() => showRejectModal(record)}
              >
                拒绝
              </Button>
            </>
          )}
          
          <Popconfirm
            title="确定要删除这条游记吗?"
            onConfirm={() => handleDelete(record)}
            okText="是"
            cancelText="否"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="review-container">
      <Card className="review-card">
        <div className="review-header">
          <Title level={4}>游记审核管理</Title>
          <Select 
            value={statusFilter} 
            onChange={setStatusFilter} 
            style={{ width: 120 }}
          >
            <Option value="all">全部</Option>
            <Option value="pending">待审核</Option>
            <Option value="approved">已通过</Option>
            <Option value="rejected">未通过</Option>
          </Select>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>

      {/* 游记详情模态框 */}
      <Modal
        title="游记详情"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setDiaryDetail(null);
        }}
        footer={null}
        width={800}
      >
        {diaryDetail ? (
          <div className="diary-detail">
            <Title level={3}>{diaryDetail.title}</Title>
            <div className="diary-meta">
              <span>作者: {diaryDetail.author?.nickname}</span>
              <span>状态: {getStatusTag(diaryDetail.status)}</span>
              {diaryDetail.status === 'rejected' && (
                <div className="reject-reason">
                  <span>拒绝原因: {diaryDetail.reason}</span>
                </div>
              )}
            </div>
            
            <Paragraph className="diary-content">
              {diaryDetail.content}
            </Paragraph>
            
            <div className="diary-images">
              <Title level={5}>游记图片</Title>
              <Image.PreviewGroup>
                {diaryDetail.images?.map((img, index) => (
                  <Image 
                    key={index}
                    src={img}
                    width={200}
                    alt={`游记图片${index + 1}`}
                    className="diary-image"
                  />
                ))}
              </Image.PreviewGroup>
            </div>
            
            {diaryDetail.videoUrl && (
              <div className="diary-video">
                <Title level={5}>游记视频</Title>
                <video 
                  src={diaryDetail.videoUrl} 
                  controls 
                  style={{ maxWidth: '100%' }}
                />
              </div>
            )}
            
            <div className="diary-actions">
              {diaryDetail.status === 'pending' && (
                <>
                  <Button 
                    type="primary" 
                    icon={<CheckOutlined />} 
                    onClick={() => {
                      handleApprove(diaryDetail);
                      setViewModalVisible(false);
                    }}
                  >
                    通过
                  </Button>
                  
                  <Button 
                    danger 
                    icon={<CloseOutlined />} 
                    onClick={() => {
                      setCurrentDiary(diaryDetail);
                      setViewModalVisible(false);
                      setRejectModalVisible(true);
                    }}
                  >
                    拒绝
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>加载中...</div>
        )}
      </Modal>

      {/* 拒绝原因模态框 */}
      <Modal
        title="填写拒绝原因"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason('');
        }}
        okText="确认拒绝"
        cancelText="取消"
      >
        <p>您正在拒绝 <strong>{currentDiary?.title}</strong> 的审核，请填写拒绝原因：</p>
        <TextArea 
          rows={4} 
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          placeholder="请详细说明拒绝原因，以便作者修改"
        />
      </Modal>
    </div>
  );
};

export default Review; 