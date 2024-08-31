import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块
export const useUserStore = defineStore(
    'user',
    () => {
        const token = ref('') // 定义 token
        const setToken = (t) => (token.value = t) // 设置 token
        const clearToken = () => (token.value = '')
        return { token, setToken,clearToken }
    },
    {
        persist: true // 持久化
    }
)
//这里引入持久化 persist: true // 持久化