const routes = [
    {
        path: '/',
        name: 'layout',
        redirect: '/home',
        component: 'layout',
        children: [
            {
                path: 'home',
                name: 'home',
                meta: {
                    txt: '首页'
                },
                component: 'Home'
            },
            {
                path: 'projM',
                name: 'projM',
                meta: {
                    txt: '项目'
                },
                component: 'Tem',
                children: [
                    {
                        path: 'projectCenter',
                        name: 'projectCenter',
                        meta: {
                            txt: '项目中心',
                            icon: '#icon-shoufeixiangmu-xiangmuicon'
                        },
                        component: 'projectCenter'
                    },
                    {
                        path: 'planCenter',
                        name: 'planCenter',
                        meta: {
                            txt: '任务中心',
                            icon: '#icon-renwuguanli'
                        },
                        component: 'planCenter'
                    },
                    {
                        path: 'balanceCenter',
                        name: 'balanceCenter',
                        meta: {
                            txt: '结算中心',
                            icon: '#icon-qian-copy-copy'
                        },
                        component: 'balanceCenter'
                    }
                ],
            },
        ]
    }]
export default routes