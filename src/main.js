import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
// 路由
import router from './router'
// 按需引入ant design
import Ant from './UI/AntDesign.js'
import 'ant-design-vue/dist/antd.css'
for(let item of Ant) {
    app.use(item)
}
app.use(router).mount('#app')

