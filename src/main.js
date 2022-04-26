import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
// 公共的scss文件不在这里引用，参考config.js中css配置项
// import './styles/_index.scss'
// vuex
import store from './store'
// 路由
import router from './router'
import './router/promission.js'
// 按需引入ant design
import Ant from './UI/AntDesign.js'
import 'ant-design-vue/dist/antd.css'
for(let item of Ant) {
    app.use(item)
}
app.use(store).use(router).mount('#app')
