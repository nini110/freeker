import router from './index.js'
import routes from './routes.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const _import = require('./_import_' + process.env.NODE_ENV)
// 动态路由的配置
let getRouter;
let tag = true
router.beforeEach((to, from, next) => {
    NProgress.start()
    let userId = localStorage.getItem('wx')
    if (!getRouter) {
        // 没有路有，先拿到动态路由
        getRouter = handleRoutes(routes)
        routerGo(to, next)
        NProgress.done()
    } else if (getRouter && tag && !localStorage.getItem('token')) {
        tag = false
        next({
            path: "/home",
        });
    } else {
        next()
        NProgress.done()
    }
})
router.afterEach(() => {
    NProgress.done()
})
// 
function handleRoutes(menuList) {
    if (!menuList || menuList.length === 0) {
        return false
    }
    let whiteList = ['55555', '12']
    let userId = localStorage.getItem('wx')
    for (let i in whiteList) {
        if (whiteList[i] === userId) {
            menuList.push({
                path: '/tem',
                name: 'Tem',
                component: () => import('../pages/Tem/index.vue')
            })
            break
        }
    }
    return [...menuList]
}

function routerGo(to, next) {
    getRouter = filterAsyncRouter(getRouter)
    getRouter.forEach((val, idx) => {
        router.addRoute(val)
    })
    next({
        ...to,
        replace: true
    })
}

function filterAsyncRouter(RouterMap) {
    const accessedRouters = RouterMap.filter(route => {
        route.component = _import(route.name)
        return true
    })
    return accessedRouters
}