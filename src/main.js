import { createApp } from 'vue'
import App from './App.vue'
import './utils/global'// 全局
const app = createApp(App)
// vuex
import store from './store'
// 路由
import router from './router'
import './router/promission.js'
// 按需引入ant design
import Ant from './UI/AntDesign.js'
import 'ant-design-vue/dist/antd.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

for(let item of Ant) {
    app.use(item)
}
// 公共的scss文件不在这里引用，参考config.js中css配置项
import './assets/fonts/iconfont.css'
import './assets/fonts/iconfont.js'
import './styles/index.less'
app.use(store).use(router).mount('#app')

