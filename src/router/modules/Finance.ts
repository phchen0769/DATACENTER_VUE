import Layout from '@/layout/index.vue'
import type { RouteRecordRaw } from 'vue-router'

const FinanceRouter: RouteRecordRaw = {
  path: '/finance',
  component: Layout,
  redirect: '/finance/list',
  name: 'Finance',
  meta: {
    title: 'finance',
    icon: 'el-icon',
    iconName: 'Money'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/finance-list/index.vue'),
      name: 'FinanceList',
      meta: {
        title: 'dividendList',  // 修改为dividendList以匹配语言包
        icon: 'el-icon',
        iconName: 'List'
      }
    },
    {
      path: 'dividend',
      component: () => import('@/views/finance-list/index.vue'),
      name: 'FinanceDividend',
      meta: {
        title: 'dividendList',
        icon: 'el-icon',
        iconName: 'List'
      }
    }
  ]
}

export default FinanceRouter