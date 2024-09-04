import layout from '@/layout/index.vue'
export default {
  path: '/social',
  component: layout,
  name: 'social',
  children: [{
    path: '/social',
    name: 'social',
    component: () => import('@/views/social/index.vue'),
    meta: {
      title: '社保',
      icon: 'table'
    }
  }]
}
