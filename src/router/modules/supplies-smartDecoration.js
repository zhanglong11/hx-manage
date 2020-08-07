import Layout from '@/layout'
import shell from '@/utils/shell'
export default {
  path: '/supplies-SmartDecoration',
  name: 'SuppliesSmartDecoration',
  component: Layout,
  redirect: '/supplies-SmartDecoration/equipmentManage/list',
  meta: { title: '物资设备', icon: 'el-icon-umbrella' },
  children: [
    {
      path: 'equipmentManage',
      name: 'EquipmentManageSmartDecoration',
      alwaysShow: true,
      component: shell('EquipmentManageSmartDecoration'),
      meta: { title: '设备管理' },
      children: [
        {
          path: 'list',
          name: 'EquipmentListSmartDecoration',
          component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/list'),
          meta: { title: '设备台账' }
        },
        {
          path: 'add',
          name: 'EquipmentAddSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/list/edit'),
          meta: { title: '添加', activeMenu: '/supplies-SmartDecoration/equipmentManage/list' }
        },
        {
          path: 'edit',
          name: 'EquipmentEditSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/list/edit'),
          meta: { title: '编辑', activeMenu: '/supplies-SmartDecoration/equipmentManage/list' }
        },
        {
          path: 'detail',
          name: 'EquipmentDetailSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/list/detail'),
          meta: { title: '详情', activeMenu: '/supplies-SmartDecoration/equipmentManage/list' }
        },
        /***设备进退场start***/
        {
          path: 'enterAndExit',
          name: 'EnterAndExitSmartDecoration',
          component: () => import('@/views/suppliesEquipment-SmartDecoration/enterAndExit/index'),
          meta: { title: '设备进退场' }
        },
        {
          path: 'enter',
          name: 'EquipmentEnterItemSmartDecoration',
          component: () => import('@/views/suppliesEquipment-SmartDecoration/enterAndExit/enter'),
          hidden: true,
          meta: { title: '新建进场设备', activeMenu: '/supplies-SmartDecoration/equipmentManage/enterAndExit' }
        },
        {
          path: 'exit',
          name: 'EquipmentExitOutItemSmartDecoration',
          component: () => import('@/views/suppliesEquipment-SmartDecoration/enterAndExit/exit'),
          hidden: true,
          meta: { title: '设备退场', activeMenu: '/supplies-SmartDecoration/equipmentManage/enterAndExit' }
        },
        {
          path: 'enterAndExitDetail',
          name: 'EnterAndExitDetailSmartDecoration',
          component: () => import('@/views/suppliesEquipment-SmartDecoration/enterAndExit/detail'),
          hidden: true,
          meta: { title: '设备进退场详情', activeMenu: '/supplies-SmartDecoration/equipmentManage/enterAndExit' }
        },
        /***设备进退场end***/

        {
          path: 'maintenance',
          name: 'MaintenanceSmartDecoration',
          component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/maintenance'),
          meta: { title: '设备保养与维修' },
          children: [
            {
              path: 'maintenancePlan',
              name: 'MaintenancePlanSmartDecoration',
              component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/maintenance/plan'),
              meta: { title: '保养计划' }
            },
            {
              path: 'maintenancePlanAdd',
              name: 'MaintenancePlanAddSmartDecoration',
              hidden: true,
              component: () =>
                import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/maintenance/plan/edit'),
              meta: {
                title: '添加',
                activeMenu: '/supplies-SmartDecoration/equipmentManage/maintenance/maintenancePlan'
              }
            },
            {
              path: 'maintenancePlanEdit',
              name: 'MaintenancePlanEditSmartDecoration',
              hidden: true,
              component: () =>
                import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/maintenance/plan/edit'),
              meta: {
                title: '编辑',
                activeMenu: '/supplies-SmartDecoration/equipmentManage/maintenance/maintenancePlan'
              }
            },
            {
              path: 'maintenancePlanDetail',
              name: 'MaintenancePlanDetailSmartDecoration',
              hidden: true,
              component: () =>
                import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/maintenance/plan/detail'),
              meta: {
                title: '详情',
                activeMenu: '/supplies-SmartDecoration/equipmentManage/maintenance/maintenancePlan'
              }
            },
            {
              path: 'equipmentMaintenance',
              name: 'EquipmentMaintenanceSmartDecoration',
              component: () =>
                import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/maintenance/equipmentMaintenance'),
              meta: { title: '设备保养' }
            },
            {
              path: 'equipmentMaintenanceDetail',
              name: 'EquipmentMaintenanceDetailSmartDecoration',
              hidden: true,
              component: () =>
                import(
                  '@/views/suppliesEquipment-SmartDecoration/equipmentManage/maintenance/equipmentMaintenance/detail'
                ),
              meta: {
                title: '详情',
                activeMenu: '/supplies-SmartDecoration/equipmentManage/maintenance/equipmentMaintenance'
              }
            },
            {
              path: 'equipmentRepair',
              name: 'EquipmentRepairSmartDecoration',
              component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/maintenance/repair'),
              meta: { title: '设备故障维修' }
            },
            {
              path: 'equipmentRepairAdd',
              name: 'EquipmentRepairAddSmartDecoration',
              hidden: true,
              component: () =>
                import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/maintenance/repair/edit'),
              meta: {
                title: '添加',
                activeMenu: '/supplies-SmartDecoration/equipmentManage/maintenance/equipmentRepair'
              }
            },
            {
              path: 'equipmentRepairEdit',
              name: 'EquipmentRepairEditSmartDecoration',
              hidden: true,
              component: () =>
                import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/maintenance/repair/edit'),
              meta: {
                title: '编辑',
                activeMenu: '/supplies-SmartDecoration/equipmentManage/maintenance/equipmentRepair'
              }
            },
            {
              path: 'equipmentRepairDetail',
              name: 'EquipmentRepairDetailSmartDecoration',
              hidden: true,
              component: () =>
                import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/maintenance/repair/detail'),
              meta: {
                title: '详情',
                activeMenu: '/supplies-SmartDecoration/equipmentManage/maintenance/equipmentRepair'
              }
            },
            {
              path: 'equipmentRepairBasicDetail',
              name: 'EquipmentRepairBasicDetailSmartDecoration',
              hidden: true,
              component: () =>
                import('@/views/suppliesEquipment-SmartDecoration/equipmentManage/maintenance/repair/basicDetail'),
              meta: {
                title: '详情',
                activeMenu: '/supplies-SmartDecoration/equipmentManage/maintenance/equipmentRepair'
              }
            }
          ]
        },
        {
          path: 'purchaseList',
          name: 'PurchaseListSmartDecoration',
          component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentPurchase'),
          meta: { title: '设备采购' }
        },
        {
          path: 'equipmentPurchaseAdd',
          name: 'EquipmentPurchaseAddSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentPurchase/edit'),
          meta: { title: '新建设备采购申请' }
        },
        {
          path: 'equipmentPurchaseEdit/:id',
          name: 'EquipmentPurchaseEditSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentPurchase/edit'),
          meta: { title: '修改设备采购申请' }
        },
        {
          path: 'equipmentPurchaseDetail/:id',
          name: 'EquipmentPurchaseDetailSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentPurchase/detail'),
          meta: { title: '设备采购详情' }
        },
        /**设备采购结束**/

        {
          path: 'equipmentRent',
          name: 'EquipmentRentSmartDecoration',
          component: shell('EquipmentRentSmartDecoration'),
          children: [
            {
              path: 'list',
              name: 'EquipmentRentListSmartDecoration',
              component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentRent'),
              meta: { title: '设备租赁' }
            },
            {
              path: 'add',
              name: 'EquipmentRentAddSmartDecoration',
              hidden: true,
              component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentRent/edit'),
              meta: {
                title: '新建租赁申请',
                activeMenu: '/supplies-SmartDecoration/equipmentManage/equipmentRent/list'
              }
            },
            {
              path: 'edit',
              name: 'EquipmentRentEditSmartDecoration',
              hidden: true,
              component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentRent/edit'),
              meta: { title: '编辑', activeMenu: '/supplies-SmartDecoration/equipmentManage/equipmentRent/list' }
            },
            {
              path: 'detail',
              name: 'EquipmentRentDetailSmartDecoration',
              hidden: true,
              component: () => import('@/views/suppliesEquipment-SmartDecoration/equipmentRent/detail'),
              meta: { title: '详情', activeMenu: '/supplies-SmartDecoration/equipmentManage/equipmentRent/list' }
            }
          ]
        }
      ]
    },
    {
      path: 'materialManage',
      name: 'MaterialManageSmartDecoration',
      alwaysShow: true,
      component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage'),
      meta: { title: '材料管理' },
      children: [
        {
          path: 'inventory',
          name: 'InventoryListSmartDecoration',
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/inventory/index'),
          meta: { title: '材料库存' }
        },
        {
          path: 'add-inventory',
          name: 'InventoryAddSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/inventory/add'),
          meta: { title: '新建材料', activeMenu: '/materialManage/inventory' }
        },
        {
          path: 'edit-inventory',
          name: 'InventoryEditSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/inventory/add'),
          meta: { title: '编辑材料', activeMenu: '/materialManage/inventory' }
        },
        {
          path: 'inventory-record',
          name: 'InventoryRecordSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/inventory/record'),
          meta: { title: '出入库记录', activeMenu: '/materialManage/inventory' }
        },
        {
          path: 'Procurement',
          name: 'ProcurementSmartDecoration',
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/procurement'),
          meta: { title: '材料采购' }
        },
        {
          path: 'procurementAdd',
          name: 'ProcurementAddSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/procurement/edit'),
          meta: { title: '新建采购申请', activeMenu: '/supplies-SmartDecoration/materialManage/procurement' }
        },
        {
          path: 'procurementEdit',
          name: 'ProcurementEditSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/procurement/edit'),
          meta: { title: '编辑', activeMenu: '/supplies-SmartDecoration/materialManage/procurement' }
        },
        {
          path: 'procurementDetail',
          name: 'ProcurementDetailSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/procurement/detail'),
          meta: { title: '详情', activeMenu: '/materialManage/procurement' }
        },
        {
          path: 'inOutWarehouse',
          name: 'InOutWarehouseSmartDecoration',
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/inOutWarehouse'),
          meta: { title: '出入库管理' },
          children: [
            {
              path: 'in',
              name: 'InWarehouseSmartDecoration',
              component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/inOutWarehouse/in'),
              meta: { title: '入库管理' }
            },
            {
              path: 'out',
              name: 'OutWarehouseSmartDecoration',
              component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/inOutWarehouse/out'),
              meta: { title: '出库管理' }
            }
          ]
        },
        {
          path: 'newInWarehouse',
          name: 'NewInWarehouseSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/inOutWarehouse/newIn'),
          meta: { title: '新建入库单', activeMenu: '/supplies-SmartDecoration/materialManage/inOutWarehouse/in' }
        },
        {
          path: 'editInWarehouse',
          name: 'EditInWarehouseSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/inOutWarehouse/newIn'),
          meta: { title: '修改入库单', activeMenu: '/supplies-SmartDecoration/materialManage/inOutWarehouse/in' }
        },
        {
          path: 'inWarehouseDetail',
          name: 'InWarehouseDetailSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/inOutWarehouse/inDetail'),
          meta: { title: '入库单详情', activeMenu: '/supplies-SmartDecoration/materialManage/inOutWarehouse/in' }
        },
        {
          path: 'addOutWarehouse',
          name: 'AddOutWarehouseSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/inOutWarehouse/addOut'),
          meta: { title: '添加出库信息', activeMenu: '/supplies-SmartDecoration/materialManage/inOutWarehouse/out' }
        },
        {
          path: 'outWarehouseDetail',
          name: 'OutWarehouseDetailSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/inOutWarehouse/outDetail'),
          meta: { title: '出库单详情', activeMenu: '/supplies-SmartDecoration/materialManage/inOutWarehouse/out' }
        },
        {
          path: 'editOutWarehouse',
          name: 'EditOutWarehouseSmartDecoration',
          hidden: true,
          component: () => import('@/views/suppliesEquipment-SmartDecoration/materialManage/inOutWarehouse/addOut'),
          meta: { title: '修改出库信息', activeMenu: '/supplies-SmartDecoration/materialManage/inOutWarehouse/out' }
        }
      ]
    }
  ]
}
