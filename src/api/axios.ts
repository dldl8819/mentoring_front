import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // 상대경로로 변경하여 Vite 프록시가 적용되도록 수정
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
