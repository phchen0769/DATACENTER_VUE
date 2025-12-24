<template>
  <div class="">
    <div class="logo-container" :style="{ height: logoHeight + 'px' }">
      <el-avatar :size="logoHeight" shape="square" :src="gettersStore.userInfo.avatar" />
      <h1 class="logo-title" v-if="gettersStore.sidebarOpened">
        {{ gettersStore.userInfo.username }}
      </h1>
    </div>
    <el-scrollbar>
      <sidebar-menu id="guide-sidebar"></sidebar-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import SidebarMenu from './SidebarMenu.vue'
import { useGettersStore } from '@/stores/getters'

const gettersStore = useGettersStore()
const logoHeight = 44
</script>

<style lang="scss" scoped>
.logo-container {
  padding: 10px 0 22px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .logo-title {
    margin-left: 10px;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
    font-size: 16px;
    white-space: nowrap;
  }
  .el-avatar {
    --el-avatar-bg-color: none;
  }
}
</style>
