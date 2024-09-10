import request from '@/utils/request'
export const getRoleList = (params) => {
    return request({
        method: 'GET',
        url: '/sys/role',
        params
    })
}
// 新增-角色
export const addRole = (data) => {
    return request({
        method: 'POST',
        url: '/sys/role',
        data
    })
}