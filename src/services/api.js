import axios from 'axios';

// API基础URL，实际项目中应从环境变量获取
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
    // 确保返回一个统一的错误对象
    const errorResponse = error.response && error.response.data ? error.response.data : { error: '网络错误' };
    return Promise.reject(errorResponse);
  }
);

// 认证API
export const login = (username, password) => {
  return api.post('/auth/login', { username, password });
};

export const getCurrentUser = () => {
  return api.get('/auth/me');
};

// 游记管理API
export const getDiaries = (params) => {
  return api.get('/admin/diaries', { params });
};

export const getDiaryById = (id) => {
  return api.get(`/diaries/${id}`);
};

// 游记审核API
export const approveDiary = (id) => {
  return api.put(`/admin/diaries/${id}/approve`);
};

export const rejectDiary = (id, reason) => {
  return api.put(`/admin/diaries/${id}/reject`, { reason });
};

export const deleteDiary = (id) => {
  return api.delete(`/admin/diaries/${id}`);
};

// 统计数据API
export const getDashboardStats = () => {
  return api.get('/admin/stats');
};

export default api; 