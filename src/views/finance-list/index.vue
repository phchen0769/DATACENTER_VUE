<template>
  <div class="finance-management">
    <el-card>
      <!-- 搜索和筛选区域 -->
      <div class="filter-container">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline">
          <el-form-item aria-label="名称">
            <el-input v-model="filterForm.name" placeholder="请输入名称" clearable />
          </el-form-item>
          <el-form-item aria-label="日期范围">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">搜索</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 工具栏 -->
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="refreshData">刷新</el-button>
      </div>

      <!-- 数据表格 -->
      <el-table 
        :data="dividendList" 
        style="width: 100%" 
        v-loading="loading"
        element-loading-text="数据加载中..."
        border
        stripe
        @sort-change="handleSortChange"
      >
        <el-table-column 
          prop="id" 
          aria-label="ID" 
          width="80" 
          sortable="custom" 
          align="center"
        ></el-table-column>
        <el-table-column 
          prop="name" 
          aria-label="名称" 
          min-width="150" 
          sortable="custom" 
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="amount" aria-label="金额" width="120" sortable="custom" align="right">
          <template #default="{ row }">
            <span class="amount">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column 
          prop="date" 
          aria-label="日期" 
          width="120" 
          sortable="custom" 
          align="center"
        ></el-table-column>
        <el-table-column aria-label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.size"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        background
        class="pagination-container"
      >
      </el-pagination>
    </el-card>

    <!-- 添加/编辑表单 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" :before-close="handleDialogClose">
      <el-form :model="currentDividend" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item aria-label="名称" prop="name">
          <el-input v-model="currentDividend.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item aria-label="金额" prop="amount">
          <el-input v-model.number="currentDividend.amount" placeholder="请输入金额">
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item aria-label="日期" prop="date">
          <el-date-picker 
            v-model="currentDividend.date" 
            type="date" 
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="saveDividend" :loading="submitLoading">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  getdividendListAPI,
  getdividendDetailAPI,
  postdividendAPI,
  updatedividendAPI,
  deletedividendAPI
} from '@/api/finance'
import { ElMessage, ElMessageBox } from 'element-plus'

// 查询参数
const query = ref({
  page: 1,
  size: 10,
  ordering: ''
})

// 过滤条件
const filterForm = ref({
  name: '',
  dateRange: []
})

// 数据列表和总数
const dividendList = ref([])
const total = ref(0)
const loading = ref(false)
const submitLoading = ref(false)

// 当前编辑项
const currentDividend = ref({
  name: '',
  amount: '',
  date: ''
})

// 控制对话框显示
const dialogVisible = ref(false)
const isEditMode = ref(false)

// 表单引用
const formRef = ref(null)

// 验证规则
const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { type: 'number', message: '金额必须为数字', trigger: 'blur' }
  ],
  date: [{ required: true, message: '请选择日期', trigger: 'change' }]
}

// 对话框标题
const dialogTitle = computed(() => {
  return isEditMode.value ? '编辑分红信息' : '新增分红信息'
})

// 获取列表数据
const fetchDividendList = async () => {
  loading.value = true
  try {
    const params = {
      ...query.value,
      name: filterForm.value.name || undefined,
      start_date: (filterForm.value.dateRange && filterForm.value.dateRange[0]) || undefined,
      end_date: (filterForm.value.dateRange && filterForm.value.dateRange[1]) || undefined
    }

    const res = await getdividendListAPI(params)
    dividendList.value = res.results
    total.value = res.count
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 处理排序
const handleSortChange = ({ column, prop, order }) => {
  if (order) {
    query.value.ordering = order === 'ascending' ? prop : `-${prop}`
  } else {
    query.value.ordering = ''
  }
  fetchDividendList()
}

// 处理过滤
const handleFilter = () => {
  query.value.page = 1
  fetchDividendList()
}

// 重置过滤条件
const resetFilter = () => {
  filterForm.value = {
    name: '',
    dateRange: []
  }
  query.value.page = 1
  fetchDividendList()
}

// 刷新数据
const refreshData = () => {
  fetchDividendList()
}

// 处理分页变化
const handlePageChange = (newPage) => {
  query.value.page = newPage
  fetchDividendList()
}

const handleSizeChange = (newSize) => {
  query.value.size = newSize
  query.value.page = 1
  fetchDividendList()
}

// 新增操作
const handleAdd = () => {
  isEditMode.value = false
  currentDividend.value = {
    name: '',
    amount: '',
    date: ''
  }
  dialogVisible.value = true
}

// 编辑操作
const handleEdit = async (row) => {
  try {
    const res = await getdividendDetailAPI(row.id)
    currentDividend.value = { ...res }
    isEditMode.value = true
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 删除操作
const handleDelete = (id) => {
  ElMessageBox.confirm('确认删除该记录吗？此操作不可恢复', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deletedividendAPI(id)
      ElMessage.success('删除成功')
      fetchDividendList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 保存数据（新增或更新）
const saveDividend = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (isEditMode.value) {
          // 更新
          await updatedividendAPI(currentDividend.value.id, currentDividend.value)
          ElMessage.success('更新成功')
        } else {
          // 新增
          await postdividendAPI(currentDividend.value)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        fetchDividendList()
      } catch (error) {
        ElMessage.error('保存失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 取消表单
const cancelForm = () => {
  dialogVisible.value = false
  formRef.value.resetFields()
}

// 关闭对话框前的处理
const handleDialogClose = (done) => {
  ElMessageBox.confirm('确认关闭吗？未保存的数据将会丢失')
    .then(() => {
      done()
    })
    .catch(() => {
      // 不执行任何操作，保持对话框打开
    })
}

// 组件挂载时获取数据
onMounted(() => {
  fetchDividendList()
})
</script>

<style scoped>
.finance-management {
  padding: 20px;
}

.filter-container {
  padding-bottom: 10px;
}

.toolbar {
  margin-bottom: 15px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.amount {
  font-weight: bold;
  color: #409eff;
}
</style>
