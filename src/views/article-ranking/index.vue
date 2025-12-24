<template>
  <div class="article-ranking-container">
    <el-card class="header">
      <div class="dynamic-box">
        <span class="title">{{ $t('msg.article.dynamicTitle') }}</span>
        <el-checkbox-group v-model="selectDynamicLabel">
          <el-checkbox
            v-for="(item, index) in dynamicData"
            :value="item.label"
            :key="index"
            >{{ item.label }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
    </el-card>
    <el-card>
      <el-table ref="tableRef" :data="tableData" border>
        <el-table-column
          v-for="(item, index) in tableColumns"
          :key="index"
          :prop="item.prop"
          :label="item.label">
          <template #default="{ row }" v-if="item.prop === 'public_date'">
            {{ row.public_date }}
          </template>
          <template #default="{ row }" v-else-if="item.prop === 'action'">
            <el-button
              type="primary"
              size="default"
              @click="onShowClick(row)"
              >{{ $t('msg.universal.check') }}</el-button
            >
            <el-button
              type="danger"
              size="default"
              @click="onRemoveClick(row)"
              >{{ $t('msg.universal.remove') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10, 50, 100, 200]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onActivated, onMounted } from 'vue'
import { getArticleListAPI, deleteArticleAPI } from '@/api/article'
import { watchSwitchLang } from '@/utils/i18n'
import { dynamicData, selectDynamicLabel, tableColumns } from './dynamic'
import { tableRef, initSortable } from './sortable'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// 数据相关
const tableData = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(10)

// 获取数据的方法
const getListData = async () => {
  const res = await getArticleListAPI({
    page: page.value,
    size: size.value
  })
  tableData.value = res.results
  total.value = res.count
}
getListData()
// 监听语言切换
watchSwitchLang(getListData)
// 处理数据不重新加载的问题
onActivated(getListData)
/**
 * size 改变触发
 */
const handleSizeChange = (currentSize) => {
  size.value = currentSize
  getListData()
}
/**
 * 页码改变触发
 */
const handleCurrentChange = (currentPage) => {
  page.value = currentPage
  getListData()
}
// 表格拖拽相关
onMounted(() => {
  initSortable(tableData, getListData)
})
/**
 * 查看按钮点击事件
 */
const router = useRouter()
const onShowClick = (row) => {
  router.push(`/article/${row.id}`)
}
// 删除用户
const i18n = useI18n()
const onRemoveClick = (row) => {
  ElMessageBox.confirm(
    i18n.t('msg.article.dialogTitle1') +
      row.title +
      i18n.t('msg.article.dialogTitle2'),
    {
      type: 'warning'
    }
  ).then(async () => {
    await deleteArticleAPI(row.id)
    ElMessage.success(i18n.t('msg.article.removeSuccess'))
    // 重新渲染数据
    getListData()
  })
}
</script>

<style lang="scss" scoped>
.article-ranking-container {
  .header {
    margin-bottom: 20px;
    .dynamic-box {
      display: flex;
      align-items: center;
      .title {
        margin-right: 20px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  :deep(.el-table__row) {
    cursor: pointer;
  }

  .pagination {
    margin-top: 20px;
    text-align: center;
  }
}
:deep(.sortable-ghost) {
  opacity: 0.6;
  color: #fff !important;
  background: #304156 !important;
}
</style>
