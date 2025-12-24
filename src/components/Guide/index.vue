<template>
  <div>
    <el-tooltip :content="$t('msg.navBar.guide')">
      <svg-icon id="guide-start" icon="guide" @click="onClick" />
    </el-tooltip>
  </div>
</template>

<script setup>
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import getSteps from './steps'
import { useGettersStore } from '@/stores/getters'

const i18n = useI18n()
const gettersStore = useGettersStore()

// driver配置
const config = {
  // 禁止点击蒙版关闭
  allowClose: false,
  // 关闭按钮文本
  closeBtnText: i18n.t('msg.guide.close'),
  // 下一步按钮文本
  nextBtnText: i18n.t('msg.guide.next'),
  // 上一步按钮文本
  prevBtnText: i18n.t('msg.guide.prev'),
  // 结束按钮文本
  doneBtnText: i18n.t('msg.guide.done')
}

let driverObj = null

onMounted(() => {
  // 实例化driver
  driverObj = driver({
    ...config,
    steps: getSteps(i18n),
    // 显示进度条
    showProgress: true
  })
})

// 监听语言变化
watch(
  () => gettersStore.language,
  () => {
    // 监听语言变化
    driverObj.setSteps(getSteps(i18n))
  }
)

const onClick = () => {
  // 触发引导
  driverObj.drive()
}
</script>

<style scoped></style>
