import './assets/style.css'

import { createApp } from 'vue'
import pinia from '@/stores' 

import App from './App.vue'
import router from './router'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import{ setupRouterGuards }from '@/permission' // permission control

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(pinia)
// 路由守卫
setupRouterGuards()
app.use(router)


app.mount('#app')
