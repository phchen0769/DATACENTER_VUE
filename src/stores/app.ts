import { defineStore } from 'pinia'
import { getStorage, setStorage } from '@/utils/storage'
import { LANGUAGE, TAGS_VIEW } from '@/constant'

interface TagItem {
  [key: string]: any
}

export const useAppStore = defineStore('app', {
  // 定义变量
  state: () => ({
    // 侧边栏默认是展开的
    sidebarOpened: true,
    language: getStorage(LANGUAGE) || 'zh',
    tagsViewList: getStorage(TAGS_VIEW) || ([] as TagItem[])
  }),

  // 获取状态
  getters: {
    getSidebarOpened(): boolean {
      return this.sidebarOpened
    },

    getLanguage(): string {
      return this.language
    },

    getTagsViewList(): TagItem[] {
      return this.tagsViewList
    }
  },

  // 修改状态的方法
  actions: {
    // sidebarOpened 的值取反
    triggerSidebarOpened() {
      this.sidebarOpened = !this.sidebarOpened
    },

    // 设置语言
    setLanguage(lang: string) {
      // 把语言存到本地
      setStorage(LANGUAGE, lang)
      // 把语言存到state中
      this.language = lang
    },

    /**
     * 添加tags
     */
    addTagsViewList(tag: TagItem) {
      const isFind = this.tagsViewList.find((item: any) => {
        return item.path === tag.path
      })
      // 处理重复
      if (!isFind) {
        this.tagsViewList.push(tag)
        setStorage(TAGS_VIEW, this.tagsViewList)
      }
    },

    /**
     * （国际化）为指定的 tag 修改 title
     */
    changeTagsView({ index, tag }: { index: number; tag: TagItem }) {
      this.tagsViewList[index] = tag
      setStorage(TAGS_VIEW, this.tagsViewList)
    },

    /**
     * 删除 tag
     * @param {type: 'other'||'right'||'index', index: index} payload
     */
    removeTagsView(payload: { type: string; index: number }) {
      if (payload.type === 'index') {
        this.tagsViewList.splice(payload.index, 1)
        return
      } else if (payload.type === 'other') {
        this.tagsViewList.splice(payload.index + 1, this.tagsViewList.length - payload.index + 1)
        this.tagsViewList.splice(0, payload.index)
      } else if (payload.type === 'right') {
        this.tagsViewList.splice(payload.index + 1, this.tagsViewList.length - payload.index + 1)
      }
      setStorage(TAGS_VIEW, this.tagsViewList)
    }
  }
})
