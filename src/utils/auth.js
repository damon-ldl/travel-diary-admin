// 用户信息key
const USER_INFO_KEY = 'user_info';

// 模拟用户数据
export const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: '管理员',
    role: 'admin',
    permissions: ['review', 'delete']
  },
  {
    id: 2,
    username: 'reviewer',
    password: 'reviewer123',
    name: '审核员',
    role: 'reviewer',
    permissions: ['review']
  }
];

// 模拟登录验证
export const validateLogin = (username, password) => {
  const user = MOCK_USERS.find(
    (user) => user.username === username && user.password === password
  );
  
  if (user) {
    // 移除敏感信息
    const { password, ...userInfo } = user;
    return userInfo;
  }
  
  return null;
};

// 保存用户信息
export const setUserInfo = (userInfo) => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
};

// 获取用户信息
export const getUserInfo = () => {
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

// 删除用户信息
export const removeUserInfo = () => {
  localStorage.removeItem(USER_INFO_KEY);
};

// 检查是否已登录
export const isLoggedIn = () => {
  return !!getUserInfo();
};

// 完整登出
export const logout = () => {
  removeUserInfo();
};

// 检查是否有权限
export const hasPermission = (permission) => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.permissions) {
    return false;
  }
  return userInfo.permissions.includes(permission);
};

// 检查是否为管理员
export const isAdmin = () => {
  const userInfo = getUserInfo();
  return userInfo && userInfo.role === 'admin';
}; 