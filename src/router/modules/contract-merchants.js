/*
 * @Description:合同管理 - 智慧招商
 * @Author:
 * @Date: 2020-01-09 11:46:02
 */
import Layout from '@/layout/index'

export default {
  path: '/contractMerchants',
  redirect: '/contractMerchants/contractManage',
  name: 'ContractMerchants',
  component: Layout,
  meta: { title: '合同管理', icon: 'el-icon-document' },
  children: [
    {
      path: 'contractManage',
      name: 'ContractManageMerchants',
      component: () => import('@/views/contract-merchants/contractManage'),
      meta: { title: '合同管理' }
    },
    {
      path: 'addContract',
      name: 'ContractAddMerchants',
      hidden: true,
      component: () => import('@/views/contract-merchants/contractManage/ContractAdd'),
      meta: { title: '新建合同', activeMenu: '/contractMerchants/contractManage' }
    },
    {
      path: 'editContract',
      name: 'ContractEditMerchants',
      hidden: true,
      component: () => import('@/views/contract-merchants/contractManage/ContractAdd'),
      meta: { title: '编辑合同', activeMenu: '/contractMerchants/contractManage' }
    },
    {
      path: 'detail/:id',
      name: 'ContractDetailMerchants',
      hidden: true,
      component: () => import('@/views/contract-merchants/contractManage/Detail'),
      meta: { title: '合同详情', activeMenu: '/contractMerchants/contractManage' }
    }
  ]
}
