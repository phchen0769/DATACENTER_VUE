import i18n from '@/i18n'
import { watch } from 'vue'
import { useAppStore } from '@/stores/app'

/**
 * @description: 根据路由名称生成页面标题
 */
export function generateTitle(title: string) {
  return i18n.global.t('msg.route.' + title)
}
/**
 *
 * @param  {...any} cbs 所有的回调
 */
export function watchSwitchLang(...cbs: any[]) {
  const appStore = useAppStore()
  watch(
    // 当language的值发生变化时，调用回调函数
    () => appStore.getLanguage,
    () => {
      cbs.forEach((cb) => cb(appStore.getLanguage))
    }
  )
}
