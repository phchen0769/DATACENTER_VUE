<template>
  <!-- 一级 menu 菜单 -->
  <el-menu
    :collapse="!gettersStore.sidebarOpened"
    :background-color="gettersStore.cssVar.menuBg"
    :text-color="gettersStore.cssVar.menuText"
    :active-text-color="gettersStore.cssVar.menuActiveText"
    :default-active="activeMenu"
    :unique-opened="true"
    router
  >
    <sidebar-item v-for="item in routes" :key="item.path" :route="item"></sidebar-item>
  </el-menu>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useGettersStore } from '@/stores/getters'

const gettersStore = useGettersStore()

// 导入过滤函数
import { filterRouters, generateMenus } from '@/utils/menus'

// 实例化vue-router对象
const router = useRouter()
// 过滤出需要显示的菜单
const routes = computed(() => {
  const filterRoutes = filterRouters(router.getRoutes())
  return generateMenus(filterRoutes)
})

// 获取vue-router中的路由
// console.log('routers', router.getRoutes())
// console.log('route', routes.value)

// 默认激活项
const route = useRoute()
const activeMenu = computed(() => {
  const { path } = route
  return path
})
</script>
<style lang="scss" scoped>
@import '@/styles/variables.module.scss';
.el-menu {
  border: none;
}
</style>
