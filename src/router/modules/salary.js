import layout from '@/layout/index.vue'
export default {
  path: '/salary',
  component: layout,
  name: 'salary',
  children: [{
    path: '/salary',
    name: 'salary',
    component: () => import('@/views/salary/index.vue'),
    meta: {
      title: '工资',
      icon: 'money'
    }
  }]
}
