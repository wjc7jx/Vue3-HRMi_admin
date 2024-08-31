import { useUserStore } from '@/stores'
import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

const baseURL = import.meta.env.VITE_APP_BASE_API

const instance = axios.create({
    baseURL,
    timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        const userStore = useUserStore()
        if (userStore.token) {
            config.headers.Authorization = userStore.token
        }
        return config
    },
    (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
    (res) => {
        // 根据你的响应格式，这里应该是 res.data.success
        if (res.data.success === true) {
            return res.data // 通常返回 res.data，因为这是你的响应数据主体
        } else {
            ElMessage.error(res.data.message || '服务异常')
            return Promise.reject(res.data) // 如果有错误，也返回 res.data
        }
    },
    (err) => {
        if (err.response) {
            // 根据你的响应格式，这里应该是 err.response.data.success
            if (err.response.data.success === false) {
                router.push('/login')
            }
            ElMessage.error(err.response.data.message || '服务异常')
        } else {
            ElMessage.error('网络错误或服务不可用')
        }
        return Promise.reject(err)
    }
)

export default instance
export { baseURL }
