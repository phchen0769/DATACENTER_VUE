import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from '@/i18n'
import installElementPlus from './plugins/element'
// 导入svgIcon
import 'virtual:svg-icons-register'
// 导入svgIcon插件
import SvgIcon from '@/components/SvgIcon/index.vue'

// 初始化样式表
import '@/styles/reset.scss'


// 导入路由守卫
import '@/permission'

// 创建vue实例
const app = createApp(App)

// 在vue实例中挂载pinia
app.use(createPinia())
// 使用installElementPlus插件
installElementPlus(app)

// installIcons(app)
app.component('svg-icon', SvgIcon)

// 在vue实例中挂载router
app.use(router)
// 在vue实例中挂载i18n
app.use(i18n)

app.mount('#app')