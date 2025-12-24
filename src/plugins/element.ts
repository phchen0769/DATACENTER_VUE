import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 导入element-plus的语言包
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'

export default (app: any) => {
  // 使用ElementPlusIconsVue插件，导入所有element-plus的图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  
  // 设置element-plus的语言包
  try {
    const appStore = useAppStore()
    app.use(ElementPlus, { locale: appStore.getLanguage === 'en' ? en : zhCn })
  } catch (error) {
    // 如果Pinia尚未初始化，使用默认语言（中文）
    app.use(ElementPlus, { locale: zhCn })
  }
}