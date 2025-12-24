<template>
  <!-- 下拉菜单 -->
  <el-dropdown
    trigger="click"
    class="international"
    @command="handleSetLanguage">
    <div>
      <!-- 切换提示 -->
      <el-tooltip :content="$t('msg.navBar.lang')" :effect="effect">
        <svg-icon id="guide-lang" icon="language" />
      </el-tooltip>
    </div>
    <!-- 下拉菜单选项，用于插入到下拉菜单 -->
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language === 'zh'" command="zh">
          中文
        </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'en'" command="en">
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'

defineProps({
  // 语言切换按钮模式切换
  effect: {
    type: String,
    default: 'dark',
    validator: function (value) {
      // 这个值必须匹配下列字符串中的一个
      return ['dark', 'light'].indexOf(value) !== -1
    }
  }
})

const appStore = useAppStore()
const language = computed(() => appStore.getLanguage)

// 切换语言的方法
const i18n = useI18n()
const handleSetLanguage = (lang) => {
  // 最新的语言设置
  i18n.locale.value = lang
  // 更新 store 中的语言设置
  appStore.setLanguage(lang)
  // 提示切换成功
  ElMessage.success(i18n.t('msg.toast.switchLangSuccess'))
}
</script>