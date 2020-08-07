import Layout from '@/layout'
import shell from '@/utils/shell'
export default {
  path: '/material-manage-smart-decoration-partyA',
  name: 'MaterialManageSmartDecorationPartyA',
  component: Layout,
  redirect: '/material-manage-smart-decoration-partyA/inventory',
  meta: { title: '材料管理', icon: 'el-icon-umbrella' },
  children: [
    {
      path: 'inventory',
      name: 'InventoryListSmartDecorationPartyA',
      component: () => import('@/views/material-manage-smart-decoration-partyA/inventory/index'),
      meta: { title: '材料台账' }
    },
    {
      path: 'add-inventory',
      name: 'InventoryAddSmartDecorationPartyA',
      hidden: true,
      component: () => import('@/views/material-manage-smart-decoration-partyA/inventory/add'),
      meta: { title: '新建材料', activeMenu: '/inventory' }
    },
    {
      path: 'edit-inventory',
      name: 'InventoryEditSmartDecorationPartyA',
      hidden: true,
      component: () => import('@/views/material-manage-smart-decoration-partyA/inventory/add'),
      meta: { title: '编辑材料', activeMenu: '/inventory' }
    },
    // {
    //   path: 'inventory-record',
    //   name: 'InventoryRecordSmartDecorationPartyA',
    //   hidden: true,
    //   component: () => import('@/views/material-manage-smart-decoration-partyA/inventory/record'),
    //   meta: { title: '出入库记录', activeMenu: '/inventory' }
    // },
    {
      path: 'inventory-detail',
      name: 'InventoryDetailSmartDecorationPartyA',
      hidden: true,
      component: () => import('@/views/material-manage-smart-decoration-partyA/inventory/detail'),
      meta: { title: '材料详情', activeMenu: '/inventory' }
    },
    {
      path: 'Procurement',
      name: 'ProcurementSmartDecorationPartyA',
      component: () => import('@/views/material-manage-smart-decoration-partyA/procurement'),
      meta: { title: '材料采购申请审批' }
    },
    {
      path: 'procurementAdd',
      name: 'ProcurementAddSmartDecorationPartyA',
      hidden: true,
      component: () => import('@/views/material-manage-smart-decoration-partyA/procurement/edit'),
      meta: { title: '新建采购申请', activeMenu: '/material-manage-smart-decoration-partyA/procurement' }
    },
    {
      path: 'procurementEdit',
      name: 'ProcurementEditSmartDecorationPartyA',
      hidden: true,
      component: () => import('@/views/material-manage-smart-decoration-partyA/procurement/edit'),
      meta: { title: '编辑', activeMenu: '/material-manage-smart-decoration-partyA/procurement' }
    },
    {
      path: 'procurementDetail',
      name: 'ProcurementDetailSmartDecorationPartyA',
      hidden: true,
      component: () => import('@/views/material-manage-smart-decoration-partyA/procurement/detail'),
      meta: { title: '详情', activeMenu: '/procurement' }
    },
    {
      path: 'inOutWarehouse',
      name: 'InOutWarehouseSmartDecorationPartyA',
      hidden: true,
      component: () => import('@/views/material-manage-smart-decoration-partyA/inOutWarehouse'),
      meta: { title: '出入库管理' },
      children: [
        {
          path: 'in',
          name: 'InWarehouseSmartDecorationPartyA',
          component: () => import('@/views/material-manage-smart-decoration-partyA/inOutWarehouse/in'),
          meta: { title: '入库管理' }
        },
        {
          path: 'out',
          name: 'OutWarehouseSmartDecorationPartyA',
          component: () => import('@/views/material-manage-smart-decoration-partyA/inOutWarehouse/out'),
          meta: { title: '出库管理' }
        }
      ]
    },
    {
      path: 'newInWarehouse',
      name: 'NewInWarehouseSmartDecorationPartyA',
      hidden: true,
      component: () => import('@/views/material-manage-smart-decoration-partyA/inOutWarehouse/newIn'),
      meta: { title: '新建入库单', activeMenu: '/material-manage-smart-decoration-partyA/inOutWarehouse/in' }
    },
    {
      path: 'editInWarehouse',
      name: 'EditInWarehouseSmartDecorationPartyA',
      hidden: true,
      component: () => import('@/views/material-manage-smart-decoration-partyA/inOutWarehouse/newIn'),
      meta: { title: '修改入库单', activeMenu: '/material-manage-smart-decoration-partyA/inOutWarehouse/in' }
    },
    {
      path: 'inWarehouseDetail',
      name: 'InWarehouseDetailSmartDecorationPartyA',
      hidden: true,
      component: () => import('@/views/material-manage-smart-decoration-partyA/inOutWarehouse/inDetail'),
      meta: { title: '材料入库单', activeMenu: '/material-manage-smart-decoration-partyA/inOutWarehouse/in' }
    },
    {
      path: 'addOutWarehouse',
      name: 'AddOutWarehouseSmartDecorationPartyA',
      hidden: true,
      component: () => import('@/views/material-manage-smart-decoration-partyA/inOutWarehouse/addOut'),
      meta: { title: '添加出库信息', activeMenu: '/material-manage-smart-decoration-partyA/inOutWarehouse/out' }
    },
    {
      path: 'outWarehouseDetail',
      name: 'OutWarehouseDetailSmartDecorationPartyA',
      hidden: true,
      component: () => import('@/views/material-manage-smart-decoration-partyA/inOutWarehouse/outDetail'),
      meta: { title: '材料提取单', activeMenu: '/material-manage-smart-decoration-partyA/inOutWarehouse/out' }
    },
    {
      path: 'editOutWarehouse',
      name: 'EditOutWarehouseSmartDecorationPartyA',
      hidden: true,
      component: () => import('@/views/material-manage-smart-decoration-partyA/inOutWarehouse/addOut'),
      meta: { title: '修改出库信息', activeMenu: '/material-manage-smart-decoration-partyA/inOutWarehouse/out' }
    }
  ]
}
