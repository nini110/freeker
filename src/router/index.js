// 安装路由   npm install vue-routrt@next --save
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
const router = createRouter({
    // hash模式
    history: createWebHashHistory(),
    routes
})
export default router