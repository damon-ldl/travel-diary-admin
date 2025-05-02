import React, { useState } from 'react';
import { Table, Tag, Space, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const PostTable = ({ dataSource, loading, onView, onEdit, onDelete, pagination = true }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleDelete = (id) => {
    if (onDelete) {
      onDelete(id);
      message.success('日记已删除');
    }
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        let text = '已发布';
        
        if (status === 'pending') {
          color = 'orange';
          text = '待审核';
        } else if (status === 'rejected') {
          color = 'red';
          text = '已拒绝';
        } else if (status === 'draft') {
          color = 'default';
          text = '草稿';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: '已发布', value: 'published' },
        { text: '待审核', value: 'pending' },
        { text: '已拒绝', value: 'rejected' },
        { text: '草稿', value: 'draft' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {onView && (
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => onView(record)}
              type="link"
              size="small"
            >
              查看
            </Button>
          )}
          {onEdit && (
            <Button 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)}
              type="link"
              size="small"
            >
              编辑
            </Button>
          )}
          {onDelete && (
            <Popconfirm
              title="确定要删除这篇日记吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="是"
              cancelText="否"
            >
              <Button 
                icon={<DeleteOutlined />} 
                type="link"
                danger
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

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey="id"
      pagination={pagination ? { pageSize: 10 } : false}
    />
  );
};

export default PostTable; 