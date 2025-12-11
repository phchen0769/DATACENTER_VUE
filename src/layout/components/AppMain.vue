<template>
  <div class="app-main">
    <!-- 带有切换动画，并且具备组件缓存功能 -->
    <router-view v-slot="{ Component, route }">
      <Transition name="fade-transform" mode="out-in">
        <div v-if="Component">
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </div>
      </Transition>
    </router-view>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import store from '@/store'
import { inWhiteList } from '@/utils/tags'
import { generateTitle, watchSwitchLang } from '@/utils/i18n'

const route = useRoute()
/**
 * 生成title
 */
const getTitle = (route) => {
  let title = ''

  if (!route.meta) {
    // 路由不包含meta时，取path作为title
    const pathArr = route.path.split('/')
    title = pathArr[pathArr.length - 1]
  } else {
    title = generateTitle(route.meta.title)
  }
  return title
}

watch(
  route,
  (to, from) => {
    // 不在白名单时，添加tags
    if (inWhiteList(to.path)) return
    const { fullPath, meta, name, params, path, query } = to
    store.commit('app/addTagsViewList', {
      fullPath,
      meta,
      name,
      params,
      path,
      query,
      title: getTitle(to)
    })
  },
  {
    // 立即执行，用于初始化
    immediate: true
  },
  /**
   * 国际化 tags
   */
  watchSwitchLang(() => {
    store.getters.tagsViewList.forEach((route, index) => {
      store.commit('app/changeTagsView', {
        index,
        tag: {
          ...route,
          title: getTitle(route)
        }
      })
    })
  })
)
</script>

<style lang="scss" scoped>
.app-main {
  //浏览器可视区域的高度
  min-height: calc(100vh - 54px - 43px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 104px 20px 20px 20px;
  box-sizing: border-box;
}
</style>
