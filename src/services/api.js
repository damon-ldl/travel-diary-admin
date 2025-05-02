import axios from 'axios';

// API基础URL，实际项目中应从环境变量获取
const API_BASE_URL = 'https://api.example.com';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 处理401错误 - 未授权/登录过期
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 登录API
export const login = (username, password) => {
  return api.post('/auth/login', { username, password });
};

// 日记相关API
export const getPosts = (params) => {
  return api.get('/posts', { params });
};

export const getPostById = (id) => {
  return api.get(`/posts/${id}`);
};

export const createPost = (postData) => {
  return api.post('/posts', postData);
};

export const updatePost = (id, postData) => {
  return api.put(`/posts/${id}`, postData);
};

export const deletePost = (id) => {
  return api.delete(`/posts/${id}`);
};

// 审核相关API
export const reviewPost = (id, status, comment = '') => {
  return api.post(`/posts/${id}/review`, { status, comment });
};

// 用户相关API
export const getUsers = (params) => {
  return api.get('/users', { params });
};

// 统计数据API
export const getDashboardStats = () => {
  return api.get('/stats/dashboard');
};

export default api; 