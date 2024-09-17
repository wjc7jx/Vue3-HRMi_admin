import request from '@/utils/request'
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}
// 批量-导出员工excel
export function exportEmployee(){
  return request({
    url: '/sys/user/export',
    method: 'get', 
    responseType: 'blob'
  })
}
// 批量-下载导入员工模板 getExcelTemplate
export function getExcelTemplate(){
  return request({
    url: '/sys/user/import/template',
    method: 'get', 
    responseType: 'blob'
  })
}
// 批量-导入员工(上传excel) uploadExcel
  export function uploadExcel(data){
    return request({
      url: '/sys/user/import',
      method: 'post', 
      data
    })
  }
// 新增-员工
export function addEmployeeService(data) {
  return request({
    method: 'POST',
    url: '/sys/user',
    data
  })
}
// 获取员工详情
export function getEmployeeDetailService(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
// 修改-员工
export function updateEmployeeService(data) {
  return request({
    method: 'put',
    url: `/sys/user/${data.id}`,
    data
  })
}
// 删除-员工
export function delEmployeeService(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}

/**
 * 获取可用的角色
 * **/

export function getEnableRoleList() {
  return request({
    url: '/sys/role/list/enabled'
  })
}
// 分配-员工-角色
export function assignRole(data) {
  return request({
    method: 'put',
    url: '/sys/user/assignRoles',
    data
  })
}