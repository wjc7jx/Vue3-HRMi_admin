import layout from '@/layout/index.vue'
export default {
  path: '/employee',
  name: 'employee',
  component: layout,
  children: [{
    path: '/employee',
    component: () => import('@/views/employee/index.vue'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  },
  {
    path:'/employee/detail/:id?',
    component:()=>import('@/views/employee/detail.vue'),
    meta:{
      title:'员工详情',
    },
    hidden:true
  }
]
}
