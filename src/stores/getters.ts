import { defineStore } from 'pinia'
import { generateColors } from '@/utils/theme'
import { getStorage } from '@/utils/storage'
import { MAIN_COLOR } from '@/constant'
import { useUserStore } from './user'
import { useThemeStore } from './theme'
import { useAppStore } from './app'

export const useGettersStore = defineStore('getters', {
  state: () => ({}),

  getters: {
    token(): string {
      const userStore = useUserStore()
      return userStore.getToken
    },

    hasUserInfo(): boolean {
      const userStore = useUserStore()
      return userStore.hasUserInfo
    },

    userInfo(): any {
      const userStore = useUserStore()
      return userStore.getUserInfo
    },

    cssVar(): any {
      const themeStore = useThemeStore()
      return {
        ...themeStore.variables,
        ...generateColors(getStorage(MAIN_COLOR))
      }
    },

    mainColor(): string {
      const themeStore = useThemeStore()
      return themeStore.getMainColor
    },

    sidebarOpened(): boolean {
      const appStore = useAppStore()
      return appStore.getSidebarOpened
    },

    language(): string {
      const appStore = useAppStore()
      return appStore.getLanguage
    },

    tagsViewList(): any[] {
      const appStore = useAppStore()
      return appStore.getTagsViewList
    }
  },

  actions: {}
})
