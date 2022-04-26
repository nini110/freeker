const routes = [{
    path: '/',
    name: 'layout',
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
            component: () => import('../pages/projectCenter/index.vue'),
            children: [{
                    path: '/pc_verify',
                    name: 'pc_verify',
                    mata: {
                        txt: '待审核'
                    },
                    component: () => import('../pages/projectCenter/index.vue')
                },
                {
                    path: '/pc_start',
                    name: 'pc_start',
                    mata: {
                        txt: '待启动'
                    },
                    component: () => import('../pages/projectCenter/index.vue')
                },
                {
                    path: '/pc_ing',
                    name: 'pc_ing',
                    mata: {
                        txt: '进行中'
                    },
                    component: () => import('../pages/projectCenter/index.vue')
                },
                {
                    path: '/pc_confirm',
                    name: 'pc_confirm',
                    mata: {
                        txt: '待确认'
                    },
                    component: () => import('../pages/projectCenter/index.vue')
                },
                {
                    path: '/pc_done',
                    name: 'pc_done',
                    mata: {
                        txt: '已完成'
                    },
                    component: () => import('../pages/projectCenter/index.vue')
                },
                {
                    path: '/pc_cancel',
                    name: 'pc_cancel',
                    mata: {
                        txt: '已取消'
                    },
                    component: () => import('../pages/projectCenter/index.vue')
                },
            ],
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