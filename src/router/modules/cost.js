import Layout from '@/layout/index'

export default {
  path: '/cost',
  redirect: '/cost/contractBudget',
  name: 'Cost',
  component: Layout,
  meta: { title: '成本管理', icon: 'el-icon-collection' },
  children: [
    // {
    //   path: 'manage',
    //   name: 'Manage',
    //   component: () => import('@/views/cost/manage'),
    //   meta: { title: '成本管理' },
    //   children: []
    // },
    {
      path: 'contractBudget',
      name: 'ContractBudgetList',
      component: () => import('@/views/cost/manage/contractBudget'),
      meta: { title: '合同预算' }
    },
    /**
       任务名称：TASK#2828 3月7号注释
       开发人员：崔洛宜
       日期：2020-03-31
       任务类型：注释(添加路由)
       **/
    {
      path: 'budgetChangeList',
      name: 'BudgetChangeList',
      component: () => import('@/views/cost/manage/contractBudget/BudgetChangeList'),
      //meta: { title: '合同预算调整', activeMenu: '/cost/manage/contractBudget' }
      meta: { title: '合同预算调整' }
    },
    /**
       任务名称：TASK#2829 3月9日注释
       开发人员：崔洛宜
       日期：2020-04-03
       任务类型：注释(修改路由)
       **/
    {
      path: 'addContractBudget',
      name: 'ContractBudgetAdd',
      hidden: true,
      component: () => import('@/views/cost/manage/contractBudget/ContractBudgetAdd'),
      meta: { title: '添加合同预算', activeMenu: '/cost/budgetChangeList' }
    },
    {
      path: 'contractBudgetDetail/:id',
      name: 'ContractBudgetDetail',
      hidden: true,
      component: () => import('@/views/cost/manage/contractBudget/Detail'),
      meta: { title: '合同预算详情', activeMenu: '/cost/budgetChangeList' }
    },
    {
      path: 'editContractBudget',
      name: 'ContractBudgetEdit',
      hidden: true,
      component: () => import('@/views/cost/manage/contractBudget/ContractBudgetAdd'),
      meta: { title: '编辑合同预算', activeMenu: '/cost/budgetChangeList' }
    },
    {
      path: 'contractTargetCostBudget',
      name: 'ContractTargetCostBudget',
      component: () => import('@/views/cost/manage/contractTargetCostBudget'),
      meta: { title: '目标成本测算' }
    },
    {
      path: 'contractTargetCostBudgetChangeList',
      name: 'ContractTargetCostBudgetChangeList',
      component: () => import('@/views/cost/manage/contractTargetCostBudget/ContractTargetCostBudgetChangeList'),
      // meta: { title: '目标成本测算调整', activeMenu: '/cost/manage/contractTargetCostBudget' }
      meta: { title: '目标成本测算调整' }
    },
    {
      path: 'addContractTargetCostBudget',
      name: 'ContractTargetCostBudgetAdd',
      hidden: true,
      component: () => import('@/views/cost/manage/contractTargetCostBudget/ContractTargetCostBudgetAdd'),
      meta: { title: '添加合同目标成本测算', activeMenu: '/cost/contractTargetCostBudgetChangeList' }
    },
    /**
       任务名称：TASK#2830 3月10日注释
       开发人员：崔洛宜
       日期：2020-03-10
       任务类型：注释(添加路由)(14)
       **/
    {
      path: 'contractTargetCostBudgetDetail/:id',
      name: 'ContractTargetCostBudgetDetail',
      hidden: true,
      component: () => import('@/views/cost/manage/contractTargetCostBudget/Detail'),
      meta: { title: '合同目标成本测算详情', activeMenu: '/cost/contractTargetCostBudgetChangeList' }
    },
    {
      path: 'editContractTargetCostBudget',
      name: 'ContractTargetCostBudgetEdit',
      hidden: true,
      component: () => import('@/views/cost/manage/contractTargetCostBudget/ContractTargetCostBudgetAdd'),
      meta: { title: '编辑合同目标成本测算', activeMenu: '/cost/contractTargetCostBudgetChangeList' }
    },
    {
      path: 'contractCostAccount',
      name: 'ContractCostAccount',
      component: () => import('@/views/cost/manage/contractCostAccount'),
      meta: { title: '合同成本核算' }
    },
    {
      path: 'addContractCostAccount/:id',
      name: 'ContractCostAccountAdd',
      hidden: true,
      component: () => import('@/views/cost/manage/contractCostAccount/ContractCostAccountAdd'),
      meta: { title: '添加合同成本核算', activeMenu: '/cost/contractCostAccount' }
    },
    {
      path: 'addContractCostAccountDetail/:id',
      name: 'ContractCostAccountDetailAdd',
      hidden: true,
      component: () => import('@/views/cost/manage/contractCostAccount/ContractCostAccountAdd'),
      meta: {
        title: '合同成本核算详情',
        activeMenu: '/cost/contractCostAccount',
        isDetail: true,
        isAudit: false
      }
    },
    {
      path: 'adjustmentTargetCost',
      name: 'AdjustmentTargetCost',
      hidden: true,
      component: () => import('@/views/cost/manage/adjustmentTargetCost'),
      meta: { title: '调整目标成本' }
    },
    {
      path: 'contractProjectsFunding',
      name: 'ContractProjectsFunding',
      component: () => import('@/views/cost/manage/contractProjectsFunding'),
      meta: { title: '合同项目经费核算' }
    },
    {
      path: 'contractProjectsFundingDetail/:id',
      name: 'ContractProjectsFundingDetail',
      hidden: true,
      component: () => import('@/views/cost/manage/contractProjectsFunding/Detail'),
      meta: { title: '合同项目经费核算详情' }
    },
    {
      path: 'addContractProjectsFunding',
      name: 'ContractProjectsFundingAdd',
      hidden: true,
      component: () => import('@/views/cost/manage/contractProjectsFunding/ContractProjectsFundingAdd'),
      meta: { title: '合同项目经费核算详情' }
    },
    {
      path: 'addFundList/:expenditureId',
      name: 'FundListAdd',
      hidden: true,
      component: () => import('@/views/cost/manage/contractProjectsFunding/FundListEdit'),
      meta: { title: '新建合同项目经费核算', activeMenu: '/cost/contractProjectsFunding' }
    },
    {
      path: 'editFundList/:expenditureId',
      name: 'FundListEdit',
      hidden: true,
      component: () => import('@/views/cost/manage/contractProjectsFunding/FundListEdit'),
      meta: { title: '编辑合同项目经费核算', activeMenu: '/cost/contractProjectsFunding' }
    },
    {
      path: 'fundListDetail/:id',
      name: 'FundListDetail',
      hidden: true,
      component: () => import('@/views/cost/manage/contractProjectsFunding/FundListDetail.vue'),
      meta: { title: '合同项目经费核算详情', activeMenu: '/cost/contractProjectsFunding' }
    },
    {
      path: 'check',
      name: 'CostCheck',
      hidden: true,
      component: () => import('@/views/cost/check'),
      meta: { title: '审核' },
      children: [
        {
          path: 'contractBudgetCheck',
          name: 'ContractBudgetCheck',
          component: () => import('@/views/cost/check/contractBudgetCheck'),
          meta: { title: '合同预算审核' }
        },
        {
          path: 'contractBudgetCheckDetail/:id',
          name: 'ContractBudgetCheckDetail',
          hidden: true,
          component: () => import('@/views/cost/check/contractBudgetCheck/ContractBudgetCheckDetail'),
          meta: { title: '合同预算审核详情', activeMenu: '/cost/check/contractBudgetCheck' }
        },
        {
          path: 'contractTargetCostBudgetCheck',
          name: 'ContractTargetCostBudgetCheck',
          component: () => import('@/views/cost/check/contractTargetCostBudgetCheck'),
          meta: { title: '合同目标成本测算审核' }
        },
        {
          path: 'contractTargetCostBudgetCheck/:id',
          name: 'ContractTargetCostBudgetCheckDetail',
          hidden: true,
          component: () =>
            import('@/views/cost/check/contractTargetCostBudgetCheck/ContractTargetCostBudgetCheckDetail'),
          meta: { title: '合同目标成本测算审核详情', activeMenu: '/cost/contractTargetCostBudgetChangeList' }
        },
        {
          path: 'adjustmentTargetCostCheck',
          name: 'AdjustmentTargetCostCheck',
          hidden: true,
          component: () => import('@/views/cost/check/adjustmentTargetCostCheck'),
          meta: { title: '调整目标成本审核' }
        },
        {
          path: 'contractCostAccountCheck',
          name: 'ContractCostAccountCheck',
          component: () => import('@/views/cost/manage/contractCostAccount'),
          meta: { title: '合同成本核算审核', isAudit: true }
        },
        {
          path: 'contractCostAccountCheckDetail/:id',
          name: 'ContractCostAccountCheckDetail',
          hidden: true,
          component: () => import('@/views/cost/manage/contractCostAccount/ContractCostAccountAdd'),
          meta: { title: '合同成本核算审核详情', activeMenu: '/cost/contractCostAccount', isAudit: true }
        },
        {
          path: 'contractProjectsFundingCheck',
          name: 'ContractProjectsFundingCheck',
          component: () => import('@/views/cost/check/contractProjectsFundingCheck'),
          meta: { title: '合同项目经费核算审核' }
        },
        {
          path: 'checkContractProjectsFunding/:id',
          name: 'CheckContractProjectsFunding',
          hidden: true,
          component: () => import('@/views/cost/check/contractProjectsFundingCheck/checkContractProjectsFunding'),
          meta: { title: '审核合同项目经费核算', activeMenu: '/cost/check/contractProjectsFundingCheck' }
        },
        {
          path: 'checkContractProjectsFundingDetail/:id',
          name: 'CheckContractProjectsFundingDetail',
          hidden: true,
          component: () => import('@/views/cost/check/contractProjectsFundingCheck/contractProjectsFundingDetail'),
          meta: { title: '审核合同项目经费核算详情', activeMenu: '/cost/check/contractProjectsFundingCheck' }
        }
      ]
    }
  ]
}
