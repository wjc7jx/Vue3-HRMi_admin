import request from '@/utils/request'

// 实现登录功能
export const userLoginService = data => {
    return request({
        method: 'POST',
        url: '/sys/login',
        data:{
            mobile: data.mobile,
            password: data.password
        }
    })
}