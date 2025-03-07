import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加請求攔截器
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 添加響應攔截器
instance.interceptors.response.use(
  response => response, 
  error => {
    if (error.response && error.response.status === 401) {
      // Token 失效，清除本地存儲，跳轉登錄
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      ElMessage.error('登入狀態已過期，請重新登入');
      router.push('/login');
    }

    // 提取錯誤訊息
    let errorMessage = '未知錯誤';
    if (error.response) {
      errorMessage = error.response.data.message || `Error ${error.response.status}`;
    } else if (error.request) {
      errorMessage = '無法連接到伺服器';
    }

    error.errorMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default instance;