import { createI18n } from 'vue-i18n'
// 引入自定义语言包
import mZhLocale from './lang/zh'
import mEnLocale from './lang/en'
import { useGettersStore } from '@/stores/getters'

// 定义数据源
const messages = {
  en: {
    msg: {
      // 结构语言包
      ...mEnLocale
    }
  },
  zh: {
    msg: {
      ...mZhLocale
    }
  }
}

/**
 * 返回当前 lang
 */
function getLanguage() {
  // 延迟获取语言值，确保在Pinia初始化之后执行
  try {
    const gettersStore = useGettersStore()
    return gettersStore.language
  } catch (error) {
    // 如果Pinia尚未初始化，返回默认语言
    return 'zh'
  }
}

// i18n配置
const i18n = createI18n({
  // 使用 Composition API 模式，则需要将其设置为false
  legacy: false,
  // 全局注入 $t 函数
  globalInjection: true,
  locale: getLanguage(),
  messages
})

export default i18n
