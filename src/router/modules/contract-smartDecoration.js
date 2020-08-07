/*
 * @Description:合同管理
 * @Author:
 * @Date: 2020-01-09 11:46:02
 */
import Layout from '@/layout/index'

export default {
  path: '/contract-SmartDecoration',
  redirect: '/contract-SmartDecoration/contractManage',
  name: 'ContractSmartDecoration',
  component: Layout,
  meta: { title: '合同管理', icon: 'el-icon-document' },
  children: [
    // {
    //   path: 'manage',
    //   name: 'Manage',
    //   component: () => import('@/views/contract/manage'),
    //   meta: { title: '合同管理' },
    //   children: []
    // },
    {
      path: 'contractManage',
      name: 'ContractManageSmartDecoration',
      component: () => import('@/views/contract-SmartDecoration/contractManage'),
      meta: { title: '合同管理' }
    },
    {
      path: 'addContract',
      name: 'ContractAddSmartDecoration',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractManage/ContractAdd'),
      meta: { title: '新建合同', activeMenu: '/contract-SmartDecoration/contractManage' }
    },
    {
      path: 'editContract',
      name: 'ContractEditSmartDecoration',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractManage/ContractAdd'),
      meta: { title: '编辑合同', activeMenu: '/contract-SmartDecoration/contractManage' }
    },
    {
      path: 'detail/:id',
      name: 'ContractDetailSmartDecoration',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractManage/Detail'),
      meta: { title: '合同详情', activeMenu: '/contract-SmartDecoration/contractManage' }
    },
    {
      path: 'contractListDisintegration/:id',
      name: 'ContractListDisintegrationSmartDecoration',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractManage/ContractListDisintegration'),
      meta: { title: '合同清单分解', activeMenu: '/contract-SmartDecoration/contractManage' }
    },
    /**
     任务名称：TASK#2746/合同管理->清单关联
     开发人员：崔洛宜
     日期：2020-03-27
     任务类型：遗漏页面
     **/
    {
      path: 'relateOrderList/:id',
      name: 'RelateOrderList',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractManage/RelateOrderList'),
      meta: { title: '专业分包清单关联', activeMenu: '/contract-SmartDecoration/contractManage' }
    },
    {
      path: 'relateOrderListBuy/:id',
      name: 'RelateOrderListBuy',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractManage/RelateOrderListB'),
      meta: { title: '采购清单关联', activeMenu: '/contract-SmartDecoration/contractManage' }
    },
    {
      path: 'relateOrderListBorrow/:id',
      name: 'RelateOrderListBorrow',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractManage/RelateOrderListB'),
      meta: { title: '租赁清单关联', activeMenu: '/contract-SmartDecoration/contractManage' }
    },
    {
      path: 'contractMeasurement',
      name: 'ContractMeasurementSmartDecoration',
      component: () => import('@/views/contract-SmartDecoration/contractMeasurementPayment'),
      meta: { title: '合同计量与支付', activeMenu: '/contract/contractMeasurement' }
    },
    {
      path: 'contractMeasurementAdd',
      name: 'ContractMeasurementAddSmartDecoration',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractMeasurementPayment/edit'),
      meta: {
        title: '新建',
        activeMenu: '/contract/contract-SmartDecoration/contractMeasurement'
      }
    },
    {
      path: 'contractMeasurementEdit',
      name: 'ContractMeasurementEditSmartDecoration',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractMeasurementPayment/edit'),
      meta: {
        title: '编辑',
        activeMenu: '/contract/contract-SmartDecoration/contractMeasurement'
      }
    },
    {
      path: 'contractMeasurementDetail',
      name: 'ContractMeasurementDetailSmartDecoration',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractMeasurementPayment/Detail'),
      meta: {
        title: '详情',
        activeMenu: '/contract/contract-SmartDecoration/contractMeasurement'
      }
    },
    {
      path: 'addFinancePay',
      name: 'FinancePayAddSmartDecoration',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractMeasurementPayment/FinancePayAdd'),
      meta: { title: '财务支付填报', activeMenu: '/contract/contractMeasurement' }
    },
    {
      path: 'contractMeasurementPaymentDetailSmartDecoration',
      name: 'ContractMeasurementPaymentDetailSmartDecoration',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractMeasurementPayment/BaseDetail'),
      meta: { title: '预付款详情', activeMenu: '/contract/contractMeasurement' }
    },
    {
      path: 'projectProcessDetail',
      name: 'ProjectProcessDetailSmartDecoration',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractMeasurementPayment/Detail'),
      meta: { title: '工程进度款详情', activeMenu: '/contract/contractMeasurement' }
    },
    {
      path: 'paymentDetail',
      name: 'PaymentDetailSmartDecoration',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractMeasurementPayment/Detail'),
      meta: { title: '计量支付详情', activeMenu: '/contract/contractMeasurement' }
    },
    {
      path: 'finalPaymentDetail',
      name: 'FinalPaymentDetailSmartDecoration',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractMeasurementPayment/BaseDetail'),
      meta: { title: '最终付款详情', activeMenu: '/contract/contractMeasurement' }
    },
    {
      path: 'refundDepositDetail',
      name: 'RefundDepositDetailSmartDecoration',
      hidden: true,
      component: () => import('@/views/contract-SmartDecoration/contractMeasurementPayment/BaseDetail'),
      meta: { title: '退还保证金详情', activeMenu: '/contract/contractMeasurement' }
    }
  ]
}
