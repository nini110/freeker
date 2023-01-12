// const routes2 = [
//     {
//         path: '/',
//         name: 'layout',
//         redirect: '/home',
//         component: 'layout',
//         children: [
//             {
//                 path: 'tem',
//                 name: 'tem',
//                 meta: {
//                     txt: '个人'
//                 },
//                 component: 'Tem',
//                 children: [
//                     {
//                         path: 'personCenter',
//                         name: 'personCenter',
//                         meta: {
//                             txt: '个人信息',
//                             icon: '#icon-zhanghaoxinxi'
//                         },
//                         component: 'personCenter'
//                     },
//                 ],

//             }
//         ]
//     }
// ]
// export default routes2
const routes2 = [
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
                path: 'personM',
                name: 'personM',
                meta: {
                    txt: '个人'
                },
                component: 'Tem',
                children: [
                    {
                        path: 'personCenter',
                        name: 'personCenter',
                        meta: {
                            txt: '账户信息',
                            icon: '#icon-zhanghaoxinxi'
                        },
                        component: 'personCenter'
                    },
                ],
            },
        ]
    }]
export default routes2