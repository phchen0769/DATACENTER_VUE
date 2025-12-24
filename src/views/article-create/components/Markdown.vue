<template>
  <div class="markdown-container">
    <!-- 渲染区 -->
    <div id="markdown-box"></div>
    <div class="bottom">
      <el-button type="primary" @click="onSubmitClick">{{
        $t('msg.article.commit')
      }}</el-button>
    </div>
  </div>
</template>

<script setup>
import MkEditor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/zh-cn'
import { onMounted, watch, ref } from 'vue'
import { useGettersStore } from '@/stores/getters'
import { watchSwitchLang } from '@/utils/i18n'
import { commitArticle, editArticle } from './commit'
import { getArticleListAPI } from '@/api/article'

const props = defineProps({
  title: {
    required: true,
    type: String
  },
  detail: {
    type: Object
  }
})
const emits = defineEmits(['onSuccess'])
// Editor实例
let mkEditor
// 处理离开页面切换语言导致 dom 无法被获取
let el
onMounted(() => {
  el = document.querySelector('#markdown-box')
  initEditor()
})

const gettersStore = useGettersStore()
const initEditor = () => {
  mkEditor = new MkEditor({
    el,
    height: '500px',
    previewStyle: 'vertical',
    language: gettersStore.language === 'zh' ? 'zh-CN' : 'en'
  })

  mkEditor.getMarkdown()
}
// 实现国际化
watchSwitchLang(() => {
  if (!el) return
  const htmlStr = mkEditor.getHTML()
  mkEditor.destroy()
  initEditor()
  mkEditor.setHTML(htmlStr)
})

// 获取文章长度
const total = ref(0)
const getListData = async () => {
  const res = await getArticleListAPI()
  total.value = res.count
}
getListData()
// 处理提交
const onSubmitClick = async () => {
  if (props.detail && props.detail.id) {
    // 编辑文章
    await editArticle(props.detail.id, {
      title: props.title,
      content: mkEditor.getHTML()
    })
  } else {
    // 创建文章
    await commitArticle({
      id: total.value + 1,
      title: props.title,
      content: mkEditor.getHTML()
    })
  }

  mkEditor.reset()
  emits('onSuccess')
}
watch(
  () => props.detail,
  (val) => {
    if (val && val.content) {
      mkEditor.setHTML(val.content)
    }
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.markdown-container {
  .bottom {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
