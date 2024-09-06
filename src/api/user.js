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
// 获取用户基本信息
export const getUserInfoService = () => {
    return request({
        method: 'GET',
        url: '/sys/profile'
    })
}
// 修改用户密码
export const updatePasswordService = data => {
    return request({
        method: 'PUT',
        url: '/sys/user/updatePass',
        data
    })
}