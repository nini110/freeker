const routes = [{
    path: '/',
    name: 'layout',
    redirect: '/home',
    component: () => import('../pages/layout/index.vue'),
    children: [{
            path: 'home',
            name: 'home',
            mata: {
                txt: '首页'
            },
            component: () => import('../pages/home/index.vue')
        },
        {
            path: 'projectCenter',
            name: 'projectCenter',
            mata: {
                txt: '项目中心'
            },
            component: () => import('../pages/projectCenter/index.vue')
        },
        {
            path: 'planCenter',
            name: 'planCenter',
            mata: {
                txt: '任务中心'
            },
            component: () => import('../pages/planCenter/index.vue'),
        },
        {
            path: 'balanceCenter',
            name: 'balanceCenter',
            mata: {
                txt: '结算中心'
            },
            component: () => import('../pages/balanceCenter/index.vue')
        },
    ]
}]
export default routes