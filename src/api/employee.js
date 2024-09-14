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
