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
    return [...menuList]
}

function routerGo(to, next) {
    getRouter = filterAsyncRouter(getRouter)
    global.antRouter = getRouter[0].children; // 将路由数据传递给全局变量，做侧边栏菜单渲染工作
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
        if (route.component) {
            route.component = _import(route.component)
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }

        return true
    })    
    return accessedRouters
}