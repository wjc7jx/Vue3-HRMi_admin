import request from '@/utils/request'

// 获取部门列表
export const getDepartmentListService = () => {
    return request({
        method: 'GET',
        url: '/company/department',
    })
}
// 获取-部门详情
export const getDepartmentDetailService = id => {
    return request({
        method: 'GET',
        url: `/company/department/${id}`,
        params: {id}
    })
}
// 新增-部门
export const addDepartmentService = data => {
    return request({
        method: 'POST',
        url: '/company/department',
        data
    })
}
// 修改-部门详情
export const updateDepartmentService = data => {
    return request({
        method: 'PUT',
        url: `/company/department/${data.id}`,
        data
    })
}
// 删除-部门
export const deleteDepartmentService = id => {
    return request({
        method: 'DELETE',
        url: `/company/department/${id}`,
        params: {id}
    })
}
// 负责人列表
export const getEmployeeService = () => {
    return request({
        method: 'GET',
        url: '/sys/user/simple'
    })
}

