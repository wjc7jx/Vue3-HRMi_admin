import layout from '@/layout/index.vue'
export default {
  path: '/attendance',
  name: 'attendance',
  component: layout,
  children: [{
    path: '/attendance',
    name: 'attendance',
    component: () => import('@/views/attendance/index.vue'),
    meta: {
      title: '考勤',
      icon: 'excel'
    }
  }]
}
