// import layout from '@/layout/index.vue'
export default {
  // 路由信息
  name: 'department',
  path: '/department', // 二级路由地址为空时 表示 /department 显示一级路由 + 二级路由
  component: () => import('@/views/department/index.vue'),
  meta: {
    // 路由元信息 存储数据的
    icon: 'tree', // 图标
    title: '组织' // 标题
  }

}
