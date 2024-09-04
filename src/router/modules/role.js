import layout from '@/layout/index.vue'
export default {
  path: '/role',
  name: 'role',
  component: layout,
  children: [{
    path: '/role',
    component: () => import('@/views/role/index.vue'),
    meta: {
      title: '角色',
      icon: 'setting'
    }
  }]
}
