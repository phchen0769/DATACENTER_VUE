<template>
  <div class="app-wrapper" :class="[gettersStore.sidebarOpened ? 'openSidebar' : 'hideSidebar']">
    <!-- 左侧 menu-->
    <sidebar class="sidebar-container" :style="{ backgroundColor: gettersStore.cssVar.menuBg }" />
    <!-- 右侧内容 -->
    <div class="main-container">
      <div class="fixed-header">
        <!-- 顶部 navbar -->
        <navbar />
        <!--标签页 tags -->
        <tags-view />
      </div>
      <!-- 主体内容 -->
      <app-main />
    </div>
  </div>
</template>

<script setup>
import { useGettersStore } from '@/stores/getters'
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import TagsView from '@/components/TagsView/index.vue'
import AppMain from './components/AppMain.vue'

const gettersStore = useGettersStore()
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  widows: 100%;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});

  transition: width #{$sideBarDuration};
}
.hideSidebar .fixed-header {
  width: calc(100% - #{$hideSideBarWidth});
}
</style>
