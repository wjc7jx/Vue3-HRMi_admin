import axios from 'axios';
import { useUserStore } from '@/stores';
// import { ElMessage } from 'element-plus';//不能引入，引入要出错，不能正常显示
import router from '@/router';

// 创建一个axios实例并配置基础设置  
const service = axios.create({
  // baseURL: '/api', // API的基础路径  
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000, // 请求超时时间  
});

// 请求拦截器  
service.interceptors.request.use(
  (config) => {
    // 获取用户状态  
    const userStore = useUserStore();
    // 如果用户已登录，将token添加到请求头  
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    // 请求错误处理  
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器  
service.interceptors.response.use(
  (response) => {
    // 如果响应数据是Blob类型，直接返回  
    if (response.data instanceof Blob) {
      return response.data;
    }

    const { success, message, data } = response.data;

    if (success) {
      // 请求成功，显示成功消息并返回数据  
      ElMessage.success(message || '操作成功');
      return data;
    } else {
      // 请求失败，显示错误消息并抛出错误  
      ElMessage.error(message || '操作失败');
      return Promise.reject(new Error(data || '未知错误'));
    }
  },
  (error) => {
    // 响应错误处理  
    console.error('响应拦截器错误:', error);

    if (error.response && error.response.status === 401) {
      // 401错误，清除token并跳转到登录页面  
      ElMessage({ type: 'error', message: '无效的token，请重新登录' });
      useUserStore().clearToken();
      router.push('/login');
      return Promise.reject(new Error('无效的token'));
    }

    // 其他错误，显示错误消息  
    ElMessage({ type: 'error', message: error.message || '服务异常' });
    return Promise.reject(error);
  }
);

export default service;