import router from './router'
import nprogress from 'nprogress'//进度条
import 'nprogress/nprogress.css'//进度条样式
import { useUserStore } from '@/stores'
import { getUserInfoService } from '@/api/user'
//创建路由守卫，封装成函数，以便在main中合适时间调用
export function setupRouterGuards() {
  const UserStore = useUserStore()
  const whiteList = ['/login', '/404']
  /**
   *前置守卫
   *
  */
  router.beforeEach(async (to, from, next) => {
    nprogress.start()//进度条开始
    if (UserStore.token) {
      // 存在token
      if (to.path === '/login') {
        // 跳转到主页
        next('/') // 中转到主页
        // next（地址）并没有执行后置守卫
        nprogress.done()//进度条结束
      } else {
        // 获取用户信息
        if (!UserStore.userInfo.userId) {
          const res = await getUserInfoService()
          UserStore.getUserInfo(res)
        }
        //   // 根据角色筛选路由
        //   const filterRoutes = asyncRoutes.filter(item => {
        //     return roles.menus.includes(item.name)
        //   })
        //   //设置vuex的路由信息
        //   store.commit('user/setRoutes', filterRoutes)
        //   // 动态添加路由
        //   router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true } ])
        //   // 添加路由后需要转发一下
        //   next(to.path)
        // }
        next() // 放过
      }
    } else {
      // 没有token
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next('/login') // 中转到登录页
        nprogress.done()
      }
    }
  })
  /** *
   * 后置守卫
   * **/
  router.afterEach(() => {
    nprogress.done()
  })
}
