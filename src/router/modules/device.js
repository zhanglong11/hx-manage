import Layout from '@/layout/index'

export default {
  path: '/device',
  redirect: '/device/goodsPlan/totalMaterial',
  name: 'Device',
  component: Layout,
  meta: { title: '物资与设备管理', icon: 'el-icon-receiving' },
  children: [
    {
      path: 'goodsPlan',
      name: 'GoodsPlan',
      component: () => import('@/views/device/goodsPlan'),
      meta: { title: '物资设备计划' },
      children: [
        {
          path: 'totalMaterial',
          name: 'TotalMaterial',
          component: () => import('@/views/device/goodsPlan/totalMaterial'),
          meta: { title: '总物资计划' }
        },
        {
          path: 'needPlan',
          name: 'NeedPlan',
          component: () => import('@/views/device/goodsPlan/needPlan'),
          meta: { title: '需用计划' }
        },
        {
          hidden: true,
          path: 'addNeedPlan',
          name: 'NeedPlanAdd',
          component: () => import('@/views/device/goodsPlan/needPlan/addNeedPlan.vue'),
          meta: { title: '新增需用计划', activeMenu: '/device/goodsPlan/needPlan' }
        },
        {
          hidden: true,
          path: 'editNeedPlan/:id',
          name: 'NeedPlanEdit',
          component: () => import('@/views/device/goodsPlan/needPlan/addNeedPlan.vue'),
          meta: { title: '编辑需用计划', activeMenu: '/device/goodsPlan/needPlan' }
        },
        {
          hidden: true,
          path: 'needPlanDetail/:id',
          name: 'NeedPlanDetail',
          component: () => import('@/views/device/goodsPlan/needPlan/needPlanDetail.vue'),
          meta: { title: '需用计划详情', activeMenu: '/device/goodsPlan/needPlan' }
        },
        {
          path: 'purchaseOrder',
          name: 'PurchaseOrder',
          component: () => import('@/views/device/goodsPlan/purchaseOrder'),
          meta: { title: '采购单' }
        },
        {
          hidden: true,
          path: 'addPurchaseOrder',
          name: 'PurchaseOrderAdd',
          component: () => import('@/views/device/goodsPlan/purchaseOrder/addPurchaseOrder.vue'),
          meta: { title: '新增采购单', activeMenu: '/device/goodsPlan/purchaseOrder' }
        },
        {
          hidden: true,
          path: 'editPurchaseOrder/:id',
          name: 'PurchaseOrderEdit',
          component: () => import('@/views/device/goodsPlan/purchaseOrder/addPurchaseOrder.vue'),
          meta: { title: '编辑采购单', activeMenu: '/device/goodsPlan/purchaseOrder' }
        },
        {
          hidden: true,
          path: 'purchaseOrderDetail/:id',
          name: 'PurchaseOrderDetail',
          component: () => import('@/views/device/goodsPlan/purchaseOrder/purchaseOrderDetail.vue'),
          meta: { title: '采购单详情', activeMenu: '/device/goodsPlan/purchaseOrder' }
        },
        {
          path: 'leasePlan',
          name: 'LeasePlan',
          component: () => import('@/views/device/goodsPlan/leasePlan'),
          meta: { title: '租赁计划' }
        },
        {
          hidden: true,
          path: 'addLeasePlan',
          name: 'LeasePlanAdd',
          component: () => import('@/views/device/goodsPlan/leasePlan/addLeasePlan.vue'),
          meta: { title: '新增租赁计划', activeMenu: '/device/goodsPlan/leasePlan' }
        },
        {
          hidden: true,
          path: 'editLeasePlan/:id',
          name: 'LeasePlanEdit',
          component: () => import('@/views/device/goodsPlan/leasePlan/addLeasePlan.vue'),
          meta: { title: '编辑租赁计划', activeMenu: '/device/goodsPlan/leasePlan' }
        },
        {
          hidden: true,
          path: 'leasePlanDetail/:id',
          name: 'LeasePlanDetail',
          component: () => import('@/views/device/goodsPlan/leasePlan/leasePlanDetail.vue'),
          meta: { title: '租赁计划详情', activeMenu: '/device/goodsPlan/leasePlan' }
        },
        {
          path: 'leaseOrder',
          name: 'LeaseOrder',
          component: () => import('@/views/device/goodsPlan/leaseOrder'),
          meta: { title: '租赁单' }
        },
        {
          hidden: true,
          path: 'addLeaseOrder',
          name: 'LeaseOrderAdd',
          component: () => import('@/views/device/goodsPlan/leaseOrder/addLeaseOrder.vue'),
          meta: { title: '新增租赁单', activeMenu: '/device/goodsPlan/leaseOrder' }
        },
        {
          hidden: true,
          path: 'editLeaseOrder/:id',
          name: 'LeaseOrderEdit',
          component: () => import('@/views/device/goodsPlan/leaseOrder/addLeaseOrder.vue'),
          meta: { title: '编辑租赁单', activeMenu: '/device/goodsPlan/leaseOrder' }
        },
        {
          hidden: true,
          path: 'leaseOrderDetail/:id',
          name: 'LeaseOrderDetail',
          component: () => import('@/views/device/goodsPlan/leaseOrder/leaseOrderDetail.vue'),
          meta: { title: '租赁单详情', activeMenu: '/device/goodsPlan/leaseOrder' }
        },
        {
          path: 'materialCheck',
          name: 'MaterialCheck',
          component: () => import('@/views/device/goodsPlan/materialCheck'),
          meta: { title: '原材料检验计划' }
        }
      ]
    },
    {
      path: 'materialManage',
      name: 'MaterialManage',
      component: () => import('@/views/device/materialManage'),
      meta: { title: '材料管理' },
      children: [
        {
          path: 'weighOrder',
          name: 'WeighOrder',
          component: () => import('@/views/device/materialManage/weighOrder'),
          meta: { title: '过磅单' }
        },
        {
          hidden: true,
          path: 'addWeighOrder',
          name: 'WeighOrderAdd',
          component: () => import('@/views/device/materialManage/weighOrder/addWeighOrder.vue'),
          meta: { title: '新增过磅单', activeMenu: '/device/materialManage/weighOrder' }
        },
        {
          hidden: true,
          path: 'editWeighOrder',
          name: 'WeighOrderEdit',
          component: () => import('@/views/device/materialManage/weighOrder/addWeighOrder.vue'),
          meta: { title: '编辑过磅单', activeMenu: '/device/materialManage/weighOrder' }
        },
        {
          hidden: true,
          path: 'weighOrderDetail',
          name: 'WeighOrderDetail',
          component: () => import('@/views/device/materialManage/weighOrder/weighOrderDetail.vue'),
          meta: { title: '过磅单详情', activeMenu: '/device/materialManage/weighOrder' }
        },
        {
          path: 'samplingOrder',
          name: 'SamplingOrder',
          component: () => import('@/views/device/materialManage/samplingOrder'),
          meta: { title: '取样单' }
        },
        {
          hidden: true,
          path: 'addSamplingOrder',
          name: 'SamplingOrderAdd',
          component: () => import('@/views/device/materialManage/samplingOrder/addSamplingOrder.vue'),
          meta: { title: '新增取样单', activeMenu: '/device/materialManage/samplingOrder' }
        },
        {
          hidden: true,
          path: 'editSamplingOrder',
          name: 'SamplingOrderEdit',
          component: () => import('@/views/device/materialManage/samplingOrder/addSamplingOrder.vue'),
          meta: { title: '编辑取样单', activeMenu: '/device/materialManage/samplingOrder' }
        },
        {
          hidden: true,
          path: 'samplingOrderDetail',
          name: 'SamplingOrderDetail',
          component: () => import('@/views/device/materialManage/samplingOrder/samplingOrderDetail.vue'),
          meta: { title: '取样单详情', activeMenu: '/device/materialManage/samplingOrder' }
        },
        {
          path: 'checkOrder',
          name: 'CheckOrder',
          component: () => import('@/views/device/materialManage/checkOrder'),
          meta: { title: '原材料检验单' }
        },
        {
          hidden: true,
          path: 'addCheckOrder',
          name: 'CheckOrderAdd',
          component: () => import('@/views/device/materialManage/checkOrder/addCheckOrder.vue'),
          meta: { title: '新增原材料检验单', activeMenu: '/device/materialManage/checkOrder' }
        },
        {
          hidden: true,
          path: 'editCheckOrder',
          name: 'CheckOrderEdit',
          component: () => import('@/views/device/materialManage/checkOrder/addCheckOrder.vue'),
          meta: { title: '编辑原材料检验单', activeMenu: '/device/materialManage/checkOrder' }
        },
        {
          hidden: true,
          path: 'checkOrderDetail',
          name: 'CheckOrderDetail',
          component: () => import('@/views/device/materialManage/checkOrder/checkOrderDetail.vue'),
          meta: { title: '原材料检验单详情', activeMenu: '/device/materialManage/checkOrder' }
        },
        {
          path: 'instoreOrder',
          name: 'InstoreOrder',
          component: () => import('@/views/device/materialManage/instoreOrder'),
          meta: { title: '入库单' }
        },
        {
          hidden: true,
          path: 'addInstoreOrder',
          name: 'InstoreOrderAdd',
          component: () => import('@/views/device/materialManage/instoreOrder/addInstoreOrder.vue'),
          meta: { title: '新增入库单', activeMenu: '/device/materialManage/instoreOrder' }
        },
        {
          hidden: true,
          path: 'editInstoreOrder',
          name: 'InstoreOrderEdit',
          component: () => import('@/views/device/materialManage/instoreOrder/addInstoreOrder.vue'),
          meta: { title: '编辑入库单', activeMenu: '/device/materialManage/instoreOrder' }
        },
        {
          hidden: true,
          path: 'instoreOrderDetail',
          name: 'InstoreOrderDetail',
          component: () => import('@/views/device/materialManage/instoreOrder/instoreOrderDetail.vue'),
          meta: { title: '入库单详情', activeMenu: '/device/materialManage/instoreOrder' }
        },
        {
          path: 'pickOrder',
          name: 'PickOrder',
          component: () => import('@/views/device/materialManage/pickOrder'),
          meta: { title: '领料单' }
        },
        {
          hidden: true,
          path: 'addPickOrder',
          name: 'PickOrderAdd',
          component: () => import('@/views/device/materialManage/pickOrder/addPickOrder.vue'),
          meta: { title: '新增领料单', activeMenu: '/device/materialManage/pickOrder' }
        },
        {
          hidden: true,
          path: 'editPickOrder',
          name: 'PickOrderEdit',
          component: () => import('@/views/device/materialManage/pickOrder/addPickOrder.vue'),
          meta: { title: '编辑领料单', activeMenu: '/device/materialManage/pickOrder' }
        },
        {
          hidden: true,
          path: 'pickOrderDetail',
          name: 'PickOrderDetail',
          component: () => import('@/views/device/materialManage/pickOrder/pickOrderDetail.vue'),
          meta: { title: '领料单详情', activeMenu: '/device/materialManage/pickOrder' }
        },
        {
          path: 'outstoreOrder',
          name: 'OutstoreOrder',
          component: () => import('@/views/device/materialManage/outstoreOrder'),
          meta: { title: '出库单' }
        },
        {
          hidden: true,
          path: 'addOutstoreOrder',
          name: 'OutstoreOrderAdd',
          component: () => import('@/views/device/materialManage/outstoreOrder/addOutstoreOrder.vue'),
          meta: { title: '新增出库单', activeMenu: '/device/materialManage/outstoreOrder' }
        },
        {
          hidden: true,
          path: 'editOutstoreOrder',
          name: 'OutstoreOrderEdit',
          component: () => import('@/views/device/materialManage/outstoreOrder/addOutstoreOrder.vue'),
          meta: { title: '编辑出库单', activeMenu: '/device/materialManage/outstoreOrder' }
        },
        {
          hidden: true,
          path: 'outstoreOrderDetail',
          name: 'OutstoreOrderDetail',
          component: () => import('@/views/device/materialManage/outstoreOrder/outstoreOrderDetail.vue'),
          meta: { title: '出库单详情', activeMenu: '/device/materialManage/outstoreOrder' }
        },
        {
          path: 'remnantInventory',
          name: 'RemnantInventory',
          component: () => import('@/views/device/materialManage/remnantInventory'),
          meta: { title: '剩余库存' }
        },
        {
          path: 'consumeCheck',
          name: 'ConsumeCheck',
          component: () => import('@/views/device/materialManage/consumeCheck'),
          meta: { title: '耗料清点' }
        },
        {
          hidden: true,
          path: 'addConsumeCheck',
          name: 'ConsumeCheckAdd',
          component: () => import('@/views/device/materialManage/consumeCheck/addConsumeCheck.vue'),
          meta: { title: '新增耗料清点', activeMenu: '/device/materialManage/consumeCheck' }
        },
        {
          hidden: true,
          path: 'editConsumeCheck',
          name: 'ConsumeCheckEdit',
          component: () => import('@/views/device/materialManage/consumeCheck/addConsumeCheck.vue'),
          meta: { title: '编辑耗料清点', activeMenu: '/device/materialManage/consumeCheck' }
        },

        {
          hidden: true,
          path: 'consumeCheckDetail',
          name: 'ConsumeCheckDetail',
          component: () => import('@/views/device/materialManage/consumeCheck/consumeCheckDetail.vue'),
          meta: { title: '耗料清点详情', activeMenu: '/device/materialManage/consumeCheck' }
        }
      ]
    },
    {
      path: 'equipmentManage',
      name: 'EquipmentManage',
      component: () => import('@/views/device/equipmentManage'),
      meta: { title: '设备管理' },
      children: [
        {
          path: 'standingBook',
          name: 'StandingBook',
          component: () => import('@/views/device/equipmentManage/standingBook'),
          meta: { title: '设备台账' }
        },
        {
          hidden: true,
          path: 'addStandingBook',
          name: 'StandingBookAdd',
          component: () => import('@/views/device/equipmentManage/standingBook/addStandingBook.vue'),
          meta: { title: '新增设备台账', activeMenu: '/device/equipmentManage/standingBook' }
        },
        {
          hidden: true,
          path: 'addStandingBook/:id',
          name: 'StandingBookEdit',
          component: () => import('@/views/device/equipmentManage/standingBook/addStandingBook.vue'),
          meta: { title: '编辑设备台账', activeMenu: '/device/equipmentManage/standingBook' }
        },
        {
          hidden: true,
          path: 'standingBookDetail',
          name: 'StandingBookDetail',
          component: () => import('@/views/device/equipmentManage/standingBook/standingBookDetail.vue'),
          meta: { title: '设备台账详情', activeMenu: '/device/equipmentManage/standingBook' }
        },
        {
          path: 'docimasyRecord',
          name: 'DocimasyRecord',
          component: () => import('@/views/device/equipmentManage/docimasyRecord'),
          meta: { title: '设备检定记录' }
        },
        {
          hidden: true,
          path: 'addDocimasyRecord',
          name: 'DocimasyRecordAdd',
          component: () => import('@/views/device/equipmentManage/docimasyRecord/addDocimasyRecord.vue'),
          meta: { title: '新增设备检定记录', activeMenu: '/device/equipmentManage/docimasyRecord' }
        },
        {
          hidden: true,
          path: 'addDocimasyRecord/:id',
          name: 'DocimasyRecordAddEdit',
          component: () => import('@/views/device/equipmentManage/docimasyRecord/addDocimasyRecord.vue'),
          meta: { title: '编辑设备检定记录', activeMenu: '/device/equipmentManage/docimasyRecord' }
        },
        {
          hidden: true,
          path: 'docimasyRecordDetail',
          name: 'DocimasyRecordDetail',
          component: () => import('@/views/device/equipmentManage/docimasyRecord/docimasyRecordDetail.vue'),
          meta: { title: '设备检定记录详情', activeMenu: '/device/equipmentManage/docimasyRecord' }
        },
        {
          path: 'checkRecord',
          name: 'CheckRecord',
          component: () => import('@/views/device/equipmentManage/checkRecord'),
          meta: { title: '设备验收记录' }
        },
        {
          hidden: true,
          path: 'addCheckRecord',
          name: 'CheckRecordAdd',
          component: () => import('@/views/device/equipmentManage/checkRecord/addCheckRecord.vue'),
          meta: { title: '新增设备验收记录', activeMenu: '/device/equipmentManage/checkRecord' }
        },
        {
          hidden: true,
          path: 'addCheckRecord/:id',
          name: 'CheckRecordAddEdit',
          component: () => import('@/views/device/equipmentManage/checkRecord/addCheckRecord.vue'),
          meta: { title: '编辑设备验收记录', activeMenu: '/device/equipmentManage/checkRecord' }
        },
        {
          hidden: true,
          path: 'checkRecordDetail',
          name: 'CheckRecordDetail',
          component: () => import('@/views/device/equipmentManage/checkRecord/checkRecordDetail.vue'),
          meta: { title: '设备验收记录详情', activeMenu: '/device/equipmentManage/checkRecord' }
        },

        {
          path: 'enterArena',
          name: 'EnterArena',
          component: () => import('@/views/device/equipmentManage/enterArena'),
          meta: { title: '设备进场' }
        },
        {
          hidden: true,
          path: 'addEnterArena',
          name: 'EnterArenaAdd',
          component: () => import('@/views/device/equipmentManage/enterArena/addEnterArena.vue'),
          meta: { title: '新增设备进场', activeMenu: '/device/equipmentManage/enterArena' }
        },
        {
          hidden: true,
          path: 'addEnterArena/:id',
          name: 'EnterArenaAddEdit',
          component: () => import('@/views/device/equipmentManage/enterArena/addEnterArena.vue'),
          meta: { title: '编辑设备进场', activeMenu: '/device/equipmentManage/enterArena' }
        },
        {
          hidden: true,
          path: 'enterArenaDetail',
          name: 'EnterArenaDetail',
          component: () => import('@/views/device/equipmentManage/enterArena/enterArenaDetail.vue'),
          meta: { title: '设备进场详情', activeMenu: '/device/equipmentManage/enterArena' }
        },
        {
          path: 'upKeep',
          name: 'UpKeep',
          component: () => import('@/views/device/equipmentManage/upKeep'),
          meta: { title: '设备保养' }
        },
        {
          hidden: true,
          path: 'addUpKeep',
          name: 'UpKeepAdd',
          component: () => import('@/views/device/equipmentManage/upKeep/addUpKeep.vue'),
          meta: { title: '新增设备保养', activeMenu: '/device/equipmentManage/upKeep' }
        },
        {
          hidden: true,
          path: 'addUpKeep/:id',
          name: 'UpKeepAddEdit',
          component: () => import('@/views/device/equipmentManage/upKeep/addUpKeep.vue'),
          meta: { title: '编辑设备保养', activeMenu: '/device/equipmentManage/upKeep' }
        },
        {
          hidden: true,
          path: 'upKeepDetail',
          name: 'UpKeepDetail',
          component: () => import('@/views/device/equipmentManage/upKeep/upKeepDetail.vue'),
          meta: { title: '设备保养详情', activeMenu: '/device/equipmentManage/upKeep' }
        },
        {
          path: 'breakDown',
          name: 'BreakDown',
          component: () => import('@/views/device/equipmentManage/breakDown'),
          meta: { title: '设备故障维修' }
        },
        {
          hidden: true,
          path: 'addBreakDown',
          name: 'BreakDownAdd',
          component: () => import('@/views/device/equipmentManage/breakDown/addBreakDown.vue'),
          meta: { title: '新增设备故障维修', activeMenu: '/device/equipmentManage/breakDown' }
        },
        {
          hidden: true,
          path: 'addBreakDown/:id',
          name: 'BreakDownAddEdit',
          component: () => import('@/views/device/equipmentManage/breakDown/addBreakDown.vue'),
          meta: { title: '编辑设备故障维修', activeMenu: '/device/equipmentManage/breakDown' }
        },
        {
          hidden: true,
          path: 'breakDownDetail',
          name: 'BreakDownDetail',
          component: () => import('@/views/device/equipmentManage/breakDown/breakDownDetail.vue'),
          meta: { title: '设备故障维修详情', activeMenu: '/device/equipmentManage/breakDown' }
        },
        {
          path: 'stopUsing',
          name: 'StopUsing',
          component: () => import('@/views/device/equipmentManage/stopUsing'),
          meta: { title: '设备停用报废' }
        },
        {
          hidden: true,
          path: 'addStopUsing',
          name: 'StopUsingAdd',
          component: () => import('@/views/device/equipmentManage/stopUsing/addStopUsing.vue'),
          meta: { title: '新增设备停用报废', activeMenu: '/device/equipmentManage/stopUsing' }
        },
        {
          hidden: true,
          path: 'addStopUsing/:id',
          name: 'StopUsingAddEDit',
          component: () => import('@/views/device/equipmentManage/stopUsing/addStopUsing.vue'),
          meta: { title: '编辑设备停用报废', activeMenu: '/device/equipmentManage/stopUsing' }
        },
        {
          hidden: true,
          path: 'stopUsingDetail',
          name: 'StopUsingDetail',
          component: () => import('@/views/device/equipmentManage/stopUsing/stopUsingDetail.vue'),
          meta: { title: '设备停用报废详情', activeMenu: '/device/equipmentManage/stopUsing' }
        },
        {
          path: 'outArena',
          name: 'OutArena',
          component: () => import('@/views/device/equipmentManage/outArena'),
          meta: { title: '设备退场' }
        },
        {
          hidden: true,
          path: 'addOutArena',
          name: 'OutArenaAdd',
          component: () => import('@/views/device/equipmentManage/outArena/addOutArena.vue'),
          meta: { title: '新增设备退场', activeMenu: '/device/equipmentManage/outArena' }
        },
        {
          hidden: true,
          path: 'addOutArena/:id',
          name: 'OutArenaAddEdit',
          component: () => import('@/views/device/equipmentManage/outArena/addOutArena.vue'),
          meta: { title: '编辑设备退场', activeMenu: '/device/equipmentManage/outArena' }
        },
        {
          hidden: true,
          path: 'outArenaDetail',
          name: 'OutArenaDetail',
          component: () => import('@/views/device/equipmentManage/outArena/outArenaDetail.vue'),
          meta: { title: '设备退场详情', activeMenu: '/device/equipmentManage/outArena' }
        }
      ]
    },
    {
      path: 'settleAccounts',
      name: 'SettleAccounts',
      component: () => import('@/views/device/settleAccounts'),
      meta: { title: '物资结算' },
      children: [
        {
          path: 'closingOrder',
          name: 'ClosingOrder',
          component: () => import('@/views/device/settleAccounts/closingOrder'),
          meta: { title: '物资租赁结算单' }
        },
        {
          hidden: true,
          path: 'addClosingOrder',
          name: 'ClosingOrderAdd',
          component: () => import('@/views/device/settleAccounts/closingOrder/addClosingOrder.vue'),
          meta: { title: '新增物资租赁结算单', activeMenu: '/device/settleAccounts/closingOrder' }
        },
        {
          hidden: true,
          path: 'editClosingOrder/:id',
          name: 'ClosingOrderEdit',
          component: () => import('@/views/device/settleAccounts/closingOrder/addClosingOrder.vue'),
          meta: { title: '编辑物资租赁结算单', activeMenu: '/device/settleAccounts/closingOrder' }
        },
        {
          hidden: true,
          path: 'closingOrderDetail/:id',
          name: 'ClosingOrderDetail',
          component: () => import('@/views/device/settleAccounts/closingOrder/closingOrderDetail.vue'),
          meta: { title: '物资租赁结算单详情', activeMenu: '/device/settleAccounts/closingOrder' }
        },
        {
          path: 'depreciationOrder',
          name: 'DepreciationOrder',
          component: () => import('@/views/device/settleAccounts/depreciationOrder'),
          meta: { title: '物资折旧单' }
        },
        {
          hidden: true,
          path: 'addDepreciationOrder',
          name: 'DepreciationOrderAdd',
          component: () => import('@/views/device/settleAccounts/depreciationOrder/addDepreciationOrder.vue'),
          meta: { title: '新增物资折旧单', activeMenu: '/device/settleAccounts/depreciationOrder' }
        },
        {
          hidden: true,
          path: 'editDepreciationOrder/:id',
          name: 'DepreciationOrderEdit',
          component: () => import('@/views/device/settleAccounts/depreciationOrder/addDepreciationOrder.vue'),
          meta: { title: '编辑物资折旧单', activeMenu: '/device/settleAccounts/depreciationOrder' }
        },
        {
          hidden: true,
          path: 'depreciationOrderDetail/:id',
          name: 'DepreciationOrderDetail',
          component: () => import('@/views/device/settleAccounts/depreciationOrder/depreciationOrderDetail.vue'),
          meta: { title: '物资折旧单详情', activeMenu: '/device/settleAccounts/depreciationOrder' }
        },
        {
          path: 'scrapOrder',
          name: 'ScrapOrder',
          component: () => import('@/views/device/settleAccounts/scrapOrder'),
          meta: { title: '物资报废处理单' }
        },
        {
          hidden: true,
          path: 'addScrapOrder',
          name: 'ScrapOrderAdd',
          component: () => import('@/views/device/settleAccounts/scrapOrder/addScrapOrder.vue'),
          meta: { title: '新增物资报废处理单', activeMenu: '/device/settleAccounts/scrapOrder' }
        },
        {
          // 任务号：2623、修改人：董渊海、修改时间：2020-03-16
          hidden: true,
          path: 'editScrapOrder/:id',
          name: 'ScrapOrderEdit',
          component: () => import('@/views/device/settleAccounts/scrapOrder/addScrapOrder.vue'),
          meta: { title: '编辑物资报废处理单', activeMenu: '/device/settleAccounts/scrapOrder' }
        },
        {
          hidden: true,
          path: 'scrapOrderDetail/:id', // 任务号：2623、修改人：董渊海、修改时间：2020-03-16
          name: 'ScrapOrderDetail',
          component: () => import('@/views/device/settleAccounts/scrapOrder/scrapOrderDetail.vue'),
          meta: { title: '物资报废处理单详情', activeMenu: '/device/settleAccounts/scrapOrder' }
        }
      ]
    }
    // {
    //   path: 'audit',
    //   name: 'Audit',
    //   component: () => import('@/views/device/audit'),
    //   meta: { title: '审核' },
    //   children: [
    //     {
    //       path: 'needPlan',
    //       name: 'NeedPlanAudit',
    //       component: () => import('@/views/device/audit/needPlan'),
    //       meta: { title: '需用计划审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditNeedPlan/:id',
    //       name: 'AuditNeedPlan',
    //       component: () => import('@/views/device/audit/needPlan/auditNeedPlan.vue'),
    //       meta: { title: '需用计划审核', activeMenu: '/device/audit/needPlan' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditNeedPlanDetail/:id',
    //       name: 'AuditNeedPlanDetail',
    //       component: () => import('@/views/device/audit/needPlan/needPlanDetail.vue'),
    //       meta: { title: '需用计划审核详情', activeMenu: '/device/audit/needPlan' }
    //     },
    //     {
    //       path: 'purchaseOrder',
    //       name: 'PurchaseOrderAudit',
    //       component: () => import('@/views/device/audit/purchaseOrder'),
    //       meta: { title: '采购单审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditPurchaseOrder/:id',
    //       name: 'AuditPurchaseOrder',
    //       component: () => import('@/views/device/audit/purchaseOrder/auditPurchaseOrder.vue'),
    //       meta: { title: '采购单审核', activeMenu: '/device/audit/purchaseOrder' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditPurchaseOrderDetail/:id',
    //       name: 'AuditPurchaseOrderDetail',
    //       component: () => import('@/views/device/audit/purchaseOrder/purchaseOrderDetail.vue'),
    //       meta: { title: '采购单审核详情', activeMenu: '/device/audit/purchaseOrder' }
    //     },
    //     {
    //       path: 'leasePlan',
    //       name: 'LeasePlanAudit',
    //       component: () => import('@/views/device/audit/leasePlan'),
    //       meta: { title: '租赁计划审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditLeasePlan/:id',
    //       name: 'AuditLeasePlan',
    //       component: () => import('@/views/device/audit/leasePlan/auditLeasePlan.vue'),
    //       meta: { title: '租赁计划审核', activeMenu: '/device/audit/leasePlan' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditLeasePlanDetail/:id',
    //       name: 'AuditLeasePlanDetail',
    //       component: () => import('@/views/device/audit/leasePlan/leasePlanDetail.vue'),
    //       meta: { title: '租赁计划审核详情', activeMenu: '/device/audit/leasePlan' }
    //     },
    //     {
    //       path: 'leaseOrder',
    //       name: 'LeaseOrderAudit',
    //       component: () => import('@/views/device/audit/leaseOrder'),
    //       meta: { title: '租赁单审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditLeaseOrder/:id',
    //       name: 'AuditLeaseOrder',
    //       component: () => import('@/views/device/audit/leaseOrder/auditLeaseOrder.vue'),
    //       meta: { title: '租赁单审核', activeMenu: '/device/audit/leaseOrder' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditLeaseOrderDetail/:id',
    //       name: 'AuditLeaseOrderDetail',
    //       component: () => import('@/views/device/audit/leaseOrder/leaseOrderDetail.vue'),
    //       meta: { title: '租赁单审核详情', activeMenu: '/device/audit/leaseOrder' }
    //     },
    //     {
    //       path: 'pickOrder',
    //       name: 'PickOrder',
    //       component: () => import('@/views/device/audit/pickOrder'),
    //       meta: { title: '领料单审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditPickOrder/:id',
    //       name: 'AuditPickOrder',
    //       component: () => import('@/views/device/audit/pickOrder/auditPickOrder.vue'),
    //       meta: { title: '领料单审核', activeMenu: '/device/audit/pickOrder' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditPickOrderDetail/:id',
    //       name: 'AuditPickOrderDetail',
    //       component: () => import('@/views/device/audit/pickOrder/auditPickOrder.vue'),
    //       meta: { title: '领料单审核详情', activeMenu: '/device/audit/pickOrder' }
    //     },
    //     {
    //       path: 'docimasyRecord',
    //       name: 'DocimasyRecord',
    //       component: () => import('@/views/device/audit/docimasyRecord'),
    //       meta: { title: '设备检定记录审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditDocimasyRecord/:id',
    //       name: 'AuditDocimasyRecord',
    //       component: () => import('@/views/device/audit/docimasyRecord/auditDocimasyRecord.vue'),
    //       meta: { title: '设备检定记录审核', activeMenu: '/device/audit/docimasyRecord' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditDocimasyRecordDetail',
    //       name: 'AuditDocimasyRecordDetail',
    //       component: () => import('@/views/device/audit/docimasyRecord/auditDocimasyRecord.vue'),
    //       meta: { title: '设备检定记录审核详情', activeMenu: '/device/audit/docimasyRecord' }
    //     },
    //     {
    //       path: 'checkRecord',
    //       name: 'CheckRecord',
    //       component: () => import('@/views/device/audit/checkRecord'),
    //       meta: { title: '设备验收记录审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditCheckRecord/:id',
    //       name: 'AuditCheckRecord',
    //       component: () => import('@/views/device/audit/checkRecord/auditCheckRecord.vue'),
    //       meta: { title: '设备验收记录审核', activeMenu: '/device/audit/checkRecord' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditCheckRecordDetail',
    //       name: 'AuditCheckRecordDetail',
    //       component: () => import('@/views/device/audit/checkRecord/auditCheckRecord.vue'),
    //       meta: { title: '设备验收记录审核详情', activeMenu: '/device/audit/checkRecord' }
    //     },
    //     {
    //       path: 'enterArena',
    //       name: 'EnterArena',
    //       component: () => import('@/views/device/audit/enterArena'),
    //       meta: { title: '设备进场审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditEnterArena/:id',
    //       name: 'AuditEnterArena',
    //       component: () => import('@/views/device/audit/enterArena/auditEnterArena.vue'),
    //       meta: { title: '设备进场审核', activeMenu: '/device/audit/enterArena' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditEnterArenaDetail',
    //       name: 'AuditEnterArenaDetail',
    //       component: () => import('@/views/device/audit/enterArena/auditEnterArena.vue'),
    //       meta: { title: '设备进场审核详情', activeMenu: '/device/audit/enterArena' }
    //     },
    //     {
    //       path: 'stopUsing',
    //       name: 'StopUsing',
    //       component: () => import('@/views/device/audit/stopUsing'),
    //       meta: { title: '设备停用报废审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditStopUsing',
    //       name: 'AuditStopUsing',
    //       component: () => import('@/views/device/audit/stopUsing/auditStopUsing.vue'),
    //       meta: { title: '设备停用报废审核', activeMenu: '/device/audit/stopUsing' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditStopUsingDetail',
    //       name: 'AuditStopUsingDetail',
    //       component: () => import('@/views/device/audit/stopUsing/auditStopUsing.vue'),
    //       meta: { title: '设备停用报废审核详情', activeMenu: '/device/audit/stopUsing' }
    //     },
    //     {
    //       path: 'upKeep',
    //       name: 'UpKeep',
    //       component: () => import('@/views/device/audit/upKeep'),
    //       meta: { title: '设备保养审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditUpKeep',
    //       name: 'AuditUpKeep',
    //       component: () => import('@/views/device/audit/upKeep/auditUpKeep.vue'),
    //       meta: { title: '设备保养审核', activeMenu: '/device/audit/upKeep' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditUpKeepDetail',
    //       name: 'AuditUpKeepDetail',
    //       component: () => import('@/views/device/audit/upKeep/auditUpKeep.vue'),
    //       meta: { title: '设备保养审核详情', activeMenu: '/device/audit/upKeep' }
    //     },
    //     {
    //       path: 'breakDown',
    //       name: 'BreakDown',
    //       component: () => import('@/views/device/audit/breakDown'),
    //       meta: { title: '设备故障维修审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditBreakDown',
    //       name: 'AuditBreakDown',
    //       component: () => import('@/views/device/audit/breakDown/auditBreakDown.vue'),
    //       meta: { title: '设备故障维修审核', activeMenu: '/device/audit/breakDown' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditBreakDownDetail',
    //       name: 'AuditBreakDownDetail',
    //       component: () => import('@/views/device/audit/breakDown/auditBreakDown.vue'),
    //       meta: { title: '设备故障维修审核详情', activeMenu: '/device/audit/breakDown' }
    //     },
    //     {
    //       path: 'outArena',
    //       name: 'OutArena',
    //       component: () => import('@/views/device/audit/outArena'),
    //       meta: { title: '设备退场审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditOutArena',
    //       name: 'AuditOutArena',
    //       component: () => import('@/views/device/audit/outArena/auditOutArena.vue'),
    //       meta: { title: '设备退场审核', activeMenu: '/device/audit/outArena' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditOutArenaDetail',
    //       name: 'AuditOutArenaDetail',
    //       component: () => import('@/views/device/audit/outArena/auditOutArena.vue'),
    //       meta: { title: '设备退场审核详情', activeMenu: '/device/audit/outArena' }
    //     },
    //     {
    //       path: 'closingOrder',
    //       name: 'ClosingOrderAudit',
    //       component: () => import('@/views/device/audit/closingOrder'),
    //       meta: { title: '物资租赁结算单审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditClosingOrder/:id',
    //       name: 'AuditClosingOrder',
    //       component: () => import('@/views/device/audit/closingOrder/auditClosingOrder.vue'),
    //       meta: { title: '物资租赁结算单审核', activeMenu: '/device/audit/closingOrder' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditClosingOrderDetail/:id',
    //       name: 'AuditClosingOrderDetail',
    //       component: () => import('@/views/device/audit/closingOrder/closingOrderDetail.vue'),
    //       meta: { title: '物资租赁结算单审核详情', activeMenu: '/device/audit/closingOrder' }
    //     },
    //     {
    //       path: 'depreciationOrder',
    //       name: 'DepreciationOrderAudit',
    //       component: () => import('@/views/device/audit/depreciationOrder'),
    //       meta: { title: '物资折旧单审核' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditDepreciationOrder/:id',
    //       name: 'AuditDepreciationOrder',
    //       component: () => import('@/views/device/audit/depreciationOrder/auditDepreciationOrder.vue'),
    //       meta: { title: '物资折旧单审核', activeMenu: '/device/audit/depreciationOrder' }
    //     },
    //     {
    //       hidden: true,
    //       path: 'auditDepreciationOrderDetail/:id',
    //       name: 'AuditDepreciationOrderDetail',
    //       component: () => import('@/views/device/audit/depreciationOrder/depreciationOrderDetail.vue'),
    //       meta: { title: '物资折旧单审核详情', activeMenu: '/device/audit/depreciationOrder' }
    //     },
    //     {
    //       // 任务号：2623、修改人：董渊海、修改时间：2020-03-16
    //       path: 'scrapOrder',
    //       name: 'ScrapOrderAudit',
    //       component: () => import('@/views/device/audit/scrapOrder'),
    //       meta: { title: '物资报废处理单审核' }
    //     },
    //     {
    //       // 任务号：2623、修改人：董渊海、修改时间：2020-03-16
    //       hidden: true,
    //       path: 'auditScrapOrder/:id',
    //       name: 'AuditScrapOrder',
    //       component: () => import('@/views/device/audit/scrapOrder/auditScrapOrder.vue'),
    //       meta: { title: '物资报废处理单审核', activeMenu: '/device/audit/scrapOrder' }
    //     },
    //     {
    //       // 任务号：2623、修改人：董渊海、修改时间：2020-03-16
    //       hidden: true,
    //       path: 'auditScrapOrderDetail/:id',
    //       name: 'AuditScrapOrderDetail',
    //       component: () => import('@/views/device/audit/scrapOrder/scrapOrderDetail.vue'),
    //       meta: { title: '物资报废处理单审核详情', activeMenu: '/device/audit/scrapOrder' }
    //     }
    //   ]
    // }
  ]
}
