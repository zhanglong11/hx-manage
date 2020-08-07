/*
 * @Description:供应商管理
 * @Author:
 * @Date: 2020-01-09 15:14:24
 */
import Layout from '@/layout/index'

export default {
  path: '/provider',
  name: 'Provider',
  redirect: '/provider/main/management',
  component: Layout,
  meta: { title: '供应商管理', icon: 'el-icon-s-management' },
  children: [
    // {
    //   path: 'main',
    //   meta: { title: '供应商管理' },
    //   component: () => import('@/views/provider/index.vue'),
    //   children: [
    //
    //   ]
    // },
    {
      path: 'management',
      name: 'ProviderManagementList',
      component: () => import('@/views/provider/management/management/index.vue'),
      meta: { title: '供应商管理' }
    },
    {
      path: 'managementCreate',
      name: 'ProviderManagementCreate',
      component: () => import('@/views/provider/management/management/create.vue'),
      hidden: true,
      meta: { title: '新建供应商', activeMenu: '/provider/management' }
    },
    {
      path: 'managementDetail/:id',
      name: 'ProviderManagementDetails',
      component: () => import('@/views/provider/management/management/details.vue'),
      hidden: true,
      meta: { title: '供应商详情', activeMenu: '/provider/management' }
    },
    {
      path: 'check',
      name: 'ProviderCheck',
      component: () => import('@/views/provider/management/check/index.vue'),
      meta: { title: '供应商考核' }
    },
    {
      path: 'addSubContractor',
      name: 'SubContractorAdd',
      hidden: true,
      component: () => import('@/views/provider/management/check/addSubContractor.vue'),
      meta: { title: '新建分包商考核', activeMenu: '/provider/check' }
    },
    {
      path: 'detailsSubContractor',
      name: 'SubContractorDetails',
      hidden: true,
      component: () => import('@/views/provider/management/check/detailsSubContractor.vue'),
      meta: { title: '分包商考核详情', activeMenu: '/provider/check' }
    },
    // 分供商
    {
      path: 'addSubsuppliers',
      name: 'SubsuppliersAdd',
      hidden: true,
      component: () => import('@/views/provider/management/check/addSubsuppliers.vue'),
      meta: { title: '新建分供商考核', activeMenu: '/provider/check' }
    },
    {
      path: 'detailsSubsuppliers',
      name: 'SubsuppliersDetails',
      hidden: true,
      component: () => import('@/views/provider/management/check/detailsSubContractor.vue'),
      meta: { title: '分供商考核详情', activeMenu: '/provider/check' }
    },
    // 分包商进场
    {
      path: 'enter',
      name: 'SubContractorEnter',
      component: () => import('@/views/provider/management/enter/index.vue'),
      meta: { title: '分包商进场' }
    },
    {
      path: 'subContractorEnterEdit',
      name: 'SubContractorEnterEdit',
      hidden: true,
      component: () => import('@/views/provider/management/enter/addEdit.vue'),
      meta: { title: '分包商进场', activeMenu: '/provider/enter' }
    },
    {
      path: 'subContractorEnterDetails',
      name: 'SubContractorEnterDetails',
      hidden: true,
      component: () => import('@/views/provider/management/enter/details.vue'),
      meta: { title: '分包商进场详情', activeMenu: '/provider/enter' }
    },
    {
      path: 'bowOut',
      name: 'SubContractorBowOut',
      component: () => import('@/views/provider/management/bowOut/index.vue'),
      meta: { title: '分包商退场' }
    },
    {
      path: 'subContractorBowOutAdd',
      name: 'SubContractorBowOutAdd',
      hidden: true,
      component: () => import('@/views/provider/management/bowOut/addEdit.vue'),
      meta: { title: '新增分包商退场', activeMenu: '/provider/bowOut' }
    },
    {
      path: 'subContractorBowOutEdit',
      name: 'SubContractorBowOutEdit',
      hidden: true,
      component: () => import('@/views/provider/management/bowOut/addEdit.vue'),
      meta: { title: '编辑分包商退场信息', activeMenu: '/provider/bowOut' }
    },
    {
      path: 'subContractorBowOutDetails',
      name: 'SubContractorBowOutDetails',
      hidden: true,
      component: () => import('@/views/provider/management/bowOut/details.vue'),
      meta: { title: '分包商退场详情', activeMenu: '/provider/bowOut' }
    }
    // {
    //   path: 'audit', // 和上面供应商考核path冲突
    //   meta: { title: '审核' },
    //   alwaysShow: true,
    //   component: () => import('@/views/provider/index.vue'),
    //   children: [
    //     {
    //       path: 'providerCheck',
    //       name: 'ProviderAudit',
    //       component: () => import('@/views/provider/check/providerCheck/index.vue'),
    //       meta: { title: '供应商审核' }
    //     },
    //     {
    //       path: 'providerAuditDetails',
    //       name: 'ProviderAuditDetails',
    //       hidden: true,
    //       component: () => import('@/views/provider/check/providerCheck/details.vue'),
    //       meta: { title: '供应商审核详情' }
    //     },
    //     {
    //       path: 'providerAssessment',
    //       name: 'ProviderAssessment',
    //       component: () => import('@/views/provider/check/providerAssessment/index.vue'),
    //       meta: { title: '供应商考核审核' }
    //     },
    //     {
    //       path: 'providerAssessmentDetails',
    //       name: 'ProviderAssessmentDetails',
    //       hidden: true,
    //       component: () => import('@/views/provider/check/providerAssessment/detailsSubsuppliers.vue'),
    //       meta: { title: '分供商考核审核详情' }
    //     },
    //     {
    //       path: 'subContractorrAssessmentDetails',
    //       name: 'SubContractorrAssessmentDetails',
    //       hidden: true,
    //       component: () => import('@/views/provider/check/providerAssessment/detailsSubContractor.vue'),
    //       meta: { title: '分包商考核审核详情' }
    //     },
    //     {
    //       path: 'enterCheck',
    //       name: 'SubContractorEnterCheck',
    //       component: () => import('@/views/provider/check/enter/index.vue'),
    //       meta: { title: '分包商进场审核' }
    //     },
    //     {
    //       path: 'enterCheckDetails',
    //       name: 'SubContractorEnterCheckDetails',
    //       hidden: true,
    //       component: () => import('@/views/provider/check/enter/details.vue'),
    //       meta: { title: '分包商进场审核详情' }
    //     },
    //     {
    //       path: 'bowOutCheck',
    //       name: 'SubContractorBowOutCheck',
    //       component: () => import('@/views/provider/check/bowOut/index.vue'),
    //       meta: { title: '分包商退场审核' }
    //     },
    //     {
    //       path: 'bowOutCheckDetails',
    //       name: 'SubContractorBowOutCheckDetails',
    //       hidden: true,
    //       component: () => import('@/views/provider/check/bowOut/details.vue'),
    //       meta: { title: '分包商进场审核详情' }
    //     }
    //   ]
    // }
  ]
}
