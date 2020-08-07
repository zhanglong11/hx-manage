/*
 * @Description:材料管理 - 智慧招商
 * @Author:
 * @Date: 2020-01-09 11:46:02
 */
import Layout from '@/layout/index'

export default {
  path: '/material',
  redirect: '/material/planList',
  name: 'Material',
  component: Layout,
  meta: { title: '材料管理', icon: 'el-icon-document' },
  children: [
    {
      path: 'planList',
      name: 'MaterialPlanList',
      component: () => import('@/views/material/planList'),
      meta: { title: '甲供材计划单' }
    },
    {
      path: 'planList/:id/view',
      name: 'MaterialPlanListView',
      hidden: true,
      component: () => import('@/views/material/planList/$id'),
      meta: { title: '甲供材计划单详情', activeMenu: '/material/planList', type: 'view' }
    },
    {
      path: 'planList/add',
      name: 'MaterialPlanListAdd',
      hidden: true,
      component: () => import('@/views/material/planList/$id'),
      meta: { title: '新建甲供材计划单', activeMenu: '/material/planList', type: 'add' }
    },
    {
      path: 'planList/:id',
      name: 'MaterialPlanListEdit',
      hidden: true,
      component: () => import('@/views/material/planList/$id'),
      meta: { title: '编辑甲供材计划单', activeMenu: '/material/planList', type: 'edit' }
    },
    {
      path: 'confirmCodeEdit',
      name: 'MaterialConfirmCodeAdd',
      hidden: true,
      component: () => import('@/views/material/confirmCode/edit'),
      meta: { title: '新建', activeMenu: '/material/confirmCode' }
    },
    {
      path: 'confirmCodeEdit/:id',
      name: 'MaterialConfirmCodeEdit',
      hidden: true,
      component: () => import('@/views/material/confirmCode/edit'),
      meta: { title: '编辑', activeMenu: '/material/confirmCode' }
    },
    {
      path: 'confirmCodeDetail/:id',
      name: 'MaterialConfirmCodeDetail',
      hidden: true,
      component: () => import('@/views/material/confirmCode/detail'),
      meta: { title: '详情', activeMenu: '/material/confirmCode' }
    },
    {
      path: 'procurementParty',
      name: 'procurementParty',
      component: () => import('@/views/material/procurementParty'),
      meta: { title: '采购通知-甲方' }
    },
    {
      path: 'procurementPartyDetail/:id',
      name: 'procurementPartyDetail',
      hidden: true,
      component: () => import('@/views/material/procurementParty/detail'),
      meta: { title: '采购单详情', activeMenu: '/material/procurementParty' }
    },
    {
      path: 'procurementSupplier',
      name: 'procurementSupplier',
      component: () => import('@/views/material/procurementSupplier'),
      meta: { title: '采购通知-供应商' }
    },
    {
      path: 'procurementSupplierDetail/:id',
      name: 'procurementSupplierDetail',
      hidden: true,
      component: () => import('@/views/material/procurementSupplier/detail'),
      meta: { title: '采购单详情' }
    },
    {
      path: 'confirmCode',
      name: 'MaterialConfirmCode',
      component: () => import('@/views/material/confirmCode'),
      meta: { title: '材料确认单' }
    }
  ]
}
