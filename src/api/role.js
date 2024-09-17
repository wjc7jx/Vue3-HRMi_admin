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
// 修改-角色
export const updateRole = (data) => {
    return request({
        method: 'PUT',
        url: `/sys/role/${data.id}`,
        data
    })
}
// 删除-角色
export const delRole = (id) => {
    return request({
        method: 'DELETE',
        url: `/sys/role/${id}`
    })
}
// 获取角色详情（用于分配权限时初始化permIds）
export function getRoleDetail(id) {
    return request({
        method: 'GET',
        url: `/sys/role/${id}`
    })
}

// 分配权限
export function assignPermission(data) {
    return request({
        method: 'PUT',
        url: '/sys/role/assignPrem',
        data
    })
}