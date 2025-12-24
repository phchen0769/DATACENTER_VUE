import { defineStore } from 'pinia'
import { MAIN_COLOR, DEFAULT_COLOR } from '@/constant'
import { getStorage, setStorage } from '@/utils/storage'
import variables from '@/styles/variables.module.scss'

// 创建一个可修改的变量类型
interface ThemeVariables {
  menuText?: string
  menuActiveText?: string
  subMenuActiveText?: string
  menuBg?: string
  menuHover?: string
  subMenuBg?: string
  subMenuHover?: string
  sideBarWidth?: string
  hideSideBarWidth?: string
  tagViewsList?: string
  sideBarDuration?: string
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mainColor: getStorage(MAIN_COLOR) || DEFAULT_COLOR,
    variables: { ...variables } as ThemeVariables
  }),

  getters: {
    getMainColor(): string {
      return this.mainColor
    },

    getVariables(): ThemeVariables {
      return this.variables
    }
  },

  actions: {
    setMainColor(newColor: string) {
      this.mainColor = newColor
      this.variables.menuBg = newColor
      setStorage(MAIN_COLOR, newColor)
    }
  }
})
