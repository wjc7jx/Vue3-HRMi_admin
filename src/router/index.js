import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
// import { useUserStore } from '@/stores'
// import departmentRouter from './modules/department'
// import approvalRouter from './modules/approval'
// import attendanceRouter from './modules/attendance'
// import employeeRouter from './modules/employee'
// import permissionRouter from './modules/permission'
// import roleRouter from './modules/role'
// import salaryRouter from './modules/salary'
// import socialRouter from './modules/social'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: 'Dashboard', icon: 'dashboard' },
      },
      {
        name: 'department',
        path: '/department', // 二级路由地址为空时 表示 /department 显示一级路由 + 二级路由
        component: () => import('@/views/department/index.vue'),
        meta: {
          // 路由元信息 存储数据的
          icon: 'tree', // 图标
          title: '组织' // 标题
        }
      },
      {
        path: '/approval',
        name: 'approval',
        component: () => import('@/views/approval/index.vue'),
        meta: {
          title: '审批',
          icon: 'tree-table'
        }
      },
      {
        path: '/attendance',
        name: 'attendance',
        component: () => import('@/views/attendance/index.vue'),
        meta: {
          title: '考勤',
          icon: 'excel'
        }
      },
      {
        path: '/employee',
        name: 'employee',
        component: () => import('@/views/employee/index.vue'),
        meta: {
          title: '员工',
          icon: 'people'
        }
      },
      {
        path: '/employee/detail/:id?',
        name: 'employeeDetail',
        component: () => import('@/views/employee/detail.vue'),
        meta: {
          title: '员工详情',
          hidden: true
        },
  
      }, {
        path: '/permission',
        component: () => import('@/views/permission/index.vue'),
        meta: {
          title: '权限',
          icon: 'lock'
        }
      }, {
        path: '/role',
        component: () => import('@/views/role/index.vue'),
        meta: {
          title: '角色',
          icon: 'setting'
        }
      },
      {
        path: '/salary',
        name: 'salary',
        component: () => import('@/views/salary/index.vue'),
        meta: {
          title: '工资',
          icon: 'money'
        }
      }, {
        path: '/social',
        name: 'social',
        component: () => import('@/views/social/index.vue'),
        meta: {
          title: '社保',
          icon: 'table'
        }
      }

    ]
  },
  // {
  //   path: '/404',
  //   component: () => import('@/views/404'),
  //   hidden: true
  // },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: 'Dashboard',
  //       component: () => import('@/views/dashboard/index.vue'),
  //       meta: { title: 'Dashboard', icon: 'dashboard' },
  //     },

  //   ]
  // },
  // departmentRouter,
  // roleRouter,
  // employeeRouter,
  // permissionRouter,
  // attendanceRouter,
  // approvalRouter,
  // salaryRouter,
  // socialRouter,

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
// 重置路由
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
//   // 全新的Router实例，其matcher属性是初始化的，只包含默认的、最初定义的路由记录。因为路由状态依赖于matcher，操作后就会重置
// }

export default router
