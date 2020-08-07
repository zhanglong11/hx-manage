/*
 * @Desc 资金管理路由
 */
/* 主模板 */
import Layout from '@/layout'
/**
 *
 * hidden: true                   如果设置为true，则项目将不会显示在侧边栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果不始终设置Show，则当项具有多个子路由时，
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置为no redirect，则breadcrumb中不会重定向
 * name:'router-name'             名称由<keep alive>使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               侧边栏和面包屑中显示的名称（推荐集）
    icon: 'svg-name'             图标显示在侧栏中,支持/src/icons/svg格式和element-ui icon两种形式
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中（默认为true）
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
  }
 */
export default [
  {
    path: '/fund-flow',
    component: Layout,
    redirect: '/fund-flow/income/plan',
    name: 'FundManageEpc',
    meta: { title: '资金管理', icon: 'el-icon-coin' },
    children: [
      {
        path: 'income',
        name: 'FundIncomeManageEpc',
        component: () => import('@/views/fundFlow-epc/income'),
        meta: { title: '收入管理' },
        children: [
          {
            path: 'plan',
            name: 'FundIncomePlanEpc',
            component: () => import('@/views/fundFlow-epc/income/plan'),
            meta: { title: '收入计划' }
          },
          {
            path: 'add',
            name: 'FundIncomePlanAddEpc',
            hidden: true,
            component: () => import('@/views/fundFlow-epc/income/plan/add'),
            meta: { title: '新增收入计划' }
          },
          {
            path: 'edit',
            name: 'FundIncomePlanEditEpc',
            hidden: true,
            component: () => import('@/views/fundFlow-epc/income/plan/add'),
            meta: { title: '编辑收入计划' }
          },
          {
            path: 'detail',
            name: 'FundIncomePlanDetailEpc',
            hidden: true,
            component: () => import('@/views/fundFlow-epc/income/plan/detail'),
            meta: { title: '查看收入计划' }
          },
          {
            path: 'payment',
            name: 'FundIncomePlanPaymentEpc',
            hidden: true,
            component: () => import('@/views/fundFlow-epc/income/plan/actualPayment'),
            meta: { title: '实际收入明细' }
          }
        ]
      },
      {
        path: 'expenses',
        name: 'FundExpensesManageEpc',
        component: () => import('@/views/fundFlow-epc/expenses'),
        meta: { title: '支出管理' },
        children: [
          {
            path: 'plan',
            name: 'FundExpensesPlanEpc',
            component: () => import('@/views/fundFlow-epc/expenses/plan'),
            meta: { title: '合同支出' }
          },
          {
            path: 'plan-add',
            name: 'FundExpensesPlanAddEpc',
            hidden: true,
            component: () => import('@/views/fundFlow-epc/expenses/plan/add'),
            meta: { title: '新建合同支出计划' }
          },
          {
            path: 'plan-edit',
            name: 'FundExpensesPlanEditEpc',
            hidden: true,
            component: () => import('@/views/fundFlow-epc/expenses/plan/add'),
            meta: { title: '编辑合同支出计划' }
          },
          {
            path: 'plan-detail',
            name: 'FundExpensesPlanDetailEpc',
            hidden: true,
            component: () => import('@/views/fundFlow-epc/expenses/plan/detail'),
            meta: { title: '合同支出计划详情' }
          },
          {
            path: 'payment',
            name: 'FundExpensesPlanPaymentEpc',
            hidden: true,
            component: () => import('@/views/fundFlow-epc/income/plan/actualPayment'),
            meta: { title: '实际支出明细' }
          },
          {
            path: 'management',
            name: 'FundExpensesManagementEpc',
            component: () => import('@/views/fundFlow-epc/expenses/management'),
            meta: { title: '管理费用支出' }
          },
          {
            path: 'management-add',
            name: 'FundExpensesManagementAddEpc',
            hidden: true,
            component: () => import('@/views/fundFlow-epc/expenses/management/add'),
            meta: { title: '新建管理费用支出计划' }
          },
          {
            path: 'management-edit',
            name: 'FundExpensesManagementEditEpc',
            hidden: true,
            component: () => import('@/views/fundFlow-epc/expenses/management/add'),
            meta: { title: '编辑管理费用支出计划' }
          },
          {
            path: 'management-actual',
            name: 'FundExpensesManagementActualEpc',
            hidden: true,
            component: () => import('@/views/fundFlow-epc/expenses/management/actual'),
            meta: { title: '管理费用支出填报' }
          },
          {
            path: 'management-detail',
            name: 'FundExpensesManagementnDetailEpc',
            hidden: true,
            component: () => import('@/views/fundFlow-epc/expenses/management/detail'),
            meta: { title: '管理费用支出计划明细' }
          }
        ]
      },
      {
        path: 'statistic',
        name: 'FundStatisticEpc',
        component: () => import('@/views/fundFlow-epc/statistic'),
        meta: { title: '资金分析' }
      }
    ]
  }
]
