import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块
export const useUserStore = defineStore(
    'user',
    () => {
        // token相关
        const token = ref('') // 定义 token
        const setToken = (t) => (token.value = t) // 设置 token
        const clearToken = () => (token.value = '')
        //用户信息相关/
        const userInfo = ref({})
        const getUserInfo = (info) => (userInfo.value = info)
        // 登出
        const logout = () => {
            clearToken()
            getUserInfo({})
        }
        // return{}
        return { token, setToken, clearToken, userInfo, getUserInfo, logout }
    },
    {
        persist: {
            // enabled: true,
            paths: ['token'] // 只持久化 token
        }
    }
)
//这里引入持久化 persist: true // 持久化