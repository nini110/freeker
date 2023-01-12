
import router from './index.js'
import routes from './routes.js'
import routes2 from './routes2.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const _import = require('./_import_' + process.env.NODE_ENV)
// 动态路由的配置
let getRouter;
let tag = true
let ckroutesStr = 'proj';
router.beforeEach((to, from, next) => {
    let ckroutes;
    let menuTag = localStorage.getItem("menuTag")
    if (menuTag === 'proj' || !menuTag) {
        ckroutes = routes
    } else {
        ckroutes = routes2
    }
    NProgress.start()
    if (!getRouter || ckroutesStr !== menuTag) {
        ckroutesStr = menuTag
        // 没有路有，先拿到动态路由
        getRouter = handleRoutes(ckroutes)
        routerGo(to, next)
        NProgress.done()
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
    let middle = JSON.parse(JSON.stringify(RouterMap))
    const accessedRouters = middle.filter(route => {
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