<template>
  <div class="navbar">
    <!-- 汉堡 -->
    <hamburger class="hamburger-container" />
    <!-- 面包屑 -->
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <!-- 引导 -->
      <guide class="right-menu-item hover-effect" />
      <!-- 搜索 -->
      <header-search class="right-menu-item hover-effect" />
      <!--全屏 -->
      <screen-full class="right-menu-item hover-effect" />
      <!-- 切换主题 -->
      <theme-picker class="right-menu-item hover-effect" />
      <!-- 切换语言 -->
      <lang-select class="right-menu-item hover-effect" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像 -->
          <!-- 当userInfo为空时，el-avatar标签src内容也为空 -->
          <el-avatar shape="square" :size="40" :src="userInfo?.avatar || ''"></el-avatar>
          <!-- 工具栏 -->
          <el-icon><Setting /></el-icon>
        </div>
        <!-- 下拉菜单 （插槽）-->
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>{{ $t('msg.navBar.home') }}</el-dropdown-item></router-link
            >
            <a target="__blank" href="#"
              ><el-dropdown-item>{{ $t('msg.navBar.course') }}</el-dropdown-item></a
            >
            <el-dropdown-item divided @click="logout">{{
              $t('msg.navBar.logout')
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGettersStore } from '@/stores/getters'
import { useUserStore } from '@/stores/user'
import Hamburger from '@/components/Hamburger/index.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import ThemePicker from '@/components/ThemeSelect/index.vue'
import ScreenFull from '@/components/Screenfull/index.vue'
import HeaderSearch from '@/components/HeaderSearch/index.vue'
import Guide from '@/components/Guide/index.vue'

const gettersStore = useGettersStore()
const userStore = useUserStore()
// 设置计算属性，获取用户信息，用于显示头像
const userInfo = computed(() => gettersStore.userInfo)
const logout = () => {
  // 触发退出登录动作
  userStore.logout()
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    // hover 动画
    transition: background 0.5s;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
  .breadcrumb-container {
    float: left;
  }
  .right-menu {
    display: flex;
    align-items: center;
    float: right;
    // padding-right: 16px;

    :deep(.avatar-container) {
      cursor: pointer;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .el-avatar {
          // 去掉背景色
          --el-avatar-bg-color: none;
          margin-right: 12px;
        }
      }
    }
    :deep(.right-menu-item) {
      display: inline-block;
      padding: 0 18px 0 0;
      font-size: 24px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
      }
    }
  }
}
</style>
