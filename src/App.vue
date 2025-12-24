<template>
  <router-view />
</template>
<script setup>
import { useGettersStore } from '@/stores/getters'
import { useUserStore } from '@/stores/user'
import { generateNewStyle, writeNewStyle } from '@/utils/theme'
import { watchSwitchLang } from '@/utils/i18n'
import { onMounted } from 'vue'

const gettersStore = useGettersStore()
const userStore = useUserStore()

onMounted(() => {
  generateNewStyle(gettersStore.mainColor).then((newStyleText) => {
    writeNewStyle(newStyleText)
  })

  // 语言切换后,重新获取用户信息
  watchSwitchLang(() => {
    if (gettersStore.token) {
      userStore.getUserInfo()
    }
  })
})

// 解决ERROR ResizeObserver loop completed with undelivered notifications.
const debounce = (fn, delay) => {
  let timer = null

  return function () {
    const context = this

    const args = arguments

    clearTimeout(timer)

    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

const _ResizeObserver = window.ResizeObserver

window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16)
    super(callback)
  }
}
</script>
<style lang="scss"></style>
