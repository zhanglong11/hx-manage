/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-31
 * @Last Modified by: gengweigang
 * @Desc 精装修项目工序进度路由
 */

/* 工作台 */
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

export const decorationProgressRouter = [
  {
    path: '/decoration-progress-smart-decoration',
    component: Layout,
    redirect: '/decoration-progress-smart-decoration/template-list',
    name: 'DecorationProgressSmartDecoration',
    meta: { title: '工序进度', icon: 'el-icon-notebook-2' },
    children: [
      {
        path: 'template-list',
        name: 'DecorationProgressTemplateListSmartDecoration',
        component: () => import('@/views/decoration-progress-smart-decoration/working-template'),
        meta: { title: '工序模板管理' }
      },
      {
        path: 'add-template',
        name: 'DecorationProgressAddTemplateSmartDecoration',
        hidden: true,
        component: () => import('@/views/decoration-progress-smart-decoration/working-template/add'),
        meta: { title: '新建模板', activeMenu: '/decoration-progress-smart-decoration/template-list' }
      },
      {
        path: 'edit-template',
        name: 'DecorationProgressEditTemplateSmartDecoration',
        hidden: true,
        component: () => import('@/views/decoration-progress-smart-decoration/working-template/add'),
        meta: { title: '编辑模板', activeMenu: '/decoration-progress-smart-decoration/template-list' }
      },
      {
        path: 'template-detail',
        name: 'DecorationProgressTemplateDetailSmartDecoration',
        hidden: true,
        component: () => import('@/views/decoration-progress-smart-decoration/working-template/detail'),
        meta: { title: '模板信息', activeMenu: '/decoration-progress-smart-decoration/template-list' }
      },
      {
        path: 'interleaving',
        name: 'DecorationProgressInterleavingSmartDecoration',
        hidden: true,
        component: () => import('@/views/decoration-progress-smart-decoration/working-template/interleaving'),
        meta: { title: '穿插工序', activeMenu: '/decoration-progress-smart-decoration/template-list' }
      },
      {
        path: 'add-interleaving',
        name: 'DecorationProgressAddInterleavingSmartDecoration',
        hidden: true,
        component: () => import('@/views/decoration-progress-smart-decoration/working-template/interleaving-add'),
        meta: { title: '添加工序', activeMenu: '/decoration-progress-smart-decoration/template-list' }
      },
      {
        path: 'edit-interleaving',
        name: 'DecorationProgressEditInterleavingSmartDecoration',
        hidden: true,
        component: () => import('@/views/decoration-progress-smart-decoration/working-template/interleaving-add'),
        meta: { title: '编辑工序', activeMenu: '/decoration-progress-smart-decoration/template-list' }
      },
      {
        path: 'working-procedure-list',
        name: 'ProgressWorkingProcedureSmartDecoration',
        component: () =>
          import('@/views/decoration-progress-smart-decoration/working-procedure/working-procedure-list'),
        meta: { title: '工序管理' }
      },
      {
        path: 'add-working-procedure',
        name: 'ProgressAddWorkingProcedureSmartDecoration',
        hidden: true,
        component: () => import('@/views/decoration-progress-smart-decoration/working-procedure/add-working-procedure'),
        meta: { title: '规则配置', activeMenu: '/decoration-progress-smart-decoration/working-procedure-list' }
      },
      {
        path: 'preview-working-procedure',
        name: 'ProgressPreviewWorkingProcedureSmartDecoration',
        hidden: true,
        component: () => import('@/views/decoration-progress-smart-decoration/working-procedure/add-working-procedure'),
        meta: { title: '预览规则配置', activeMenu: '/decoration-progress-smart-decoration/working-procedure-list' }
      },
      // 规则配置详情
      {
        path: 'working-procedure-list/:id/detail',
        name: 'ProgressAddWorkingProcedureDetailSmartDecoration',
        hidden: true,
        component: () => import('@/views/decoration-progress-smart-decoration/working-procedure/detail'),
        meta: { title: '规则配置详情', activeMenu: '/decoration-progress-smart-decoration/working-procedure-list' }
      },
      // 工序列表,从工序管理中进去
      {
        path: 'working-procedure-schedule',
        name: 'ProgressProcedureScheduleSmartDecoration',
        component: () => import('@/views/decoration-progress-smart-decoration/working-procedure-schedule'),
        meta: { title: '工序列表' }
      },
      {
        path: 'working-procedure-schedule/:id/tree',
        name: 'ProcedureScheduleTreeSmartDecoration',
        hidden: true,
        component: () =>
          import(
            '@/views/decoration-progress-smart-decoration/working-procedure-schedule/working-procedure-schedule-tree'
          ),
        meta: { title: '工序进度', activeMenu: '/decoration-progress-smart-decoration/working-procedure-list' }
      },
      // 工序耗材确认
      {
        path: 'working-procedure-schedule/:configId/confirm/:scheduleId',
        name: 'ProgressScheduleConfirmSmartDecoration',
        hidden: true,
        component: () => import('@/views/decoration-progress-smart-decoration/working-procedure-schedule/confirm'),
        meta: { title: '工序确认', activeMenu: '/decoration-progress-smart-decoration/working-procedure-schedule' }
      },
      // 已确认工序的详情
      {
        path: 'working-procedure-schedule/:configId/detail/:scheduleId',
        name: 'ProgressScheduleDetailSmartDecoration',
        hidden: true,
        component: () => import('@/views/decoration-progress-smart-decoration/working-procedure-schedule/detail'),
        meta: { title: '工序详情', activeMenu: '/decoration-progress-smart-decoration/working-procedure-schedule' }
      },
      {
        path: 'working-procedure-statistics',
        name: 'WorkingProcedureStatisticsSmartDecoration',
        component: () => import('@/views/decoration-progress-smart-decoration/working-procedure-statistics'),
        meta: { title: '工序统计表' }
      },
      {
        path: 'monthly-precontrol',
        name: 'MonthlyPrecontrolSmartDecoration',
        component: () => import('@/views/decoration-progress-smart-decoration/monthly-precontrol'),
        meta: { title: '月度预控表' }
      }
      // {
      //   path: 'bim-relation',
      //   name: 'BimRelationSmartDecoration',
      //   hidden: true,
      //   component: () => import('@/views/process-progress/working-procedure/bim-relation'),
      //   meta: { title: 'BIM关联', activeMenu: '/process-progress/working-procedure-list' }
      // },
      // // 新增工序列表和工序确认，工序详情路由
      // {
      //   path: 'bim-relation',
      //   name: 'BimRelationSmartDecoration',
      //   hidden: true,
      //   component: () => import('@/views/process-progress/working-procedure/bim-relation'),
      //   meta: { title: 'BIM关联', activeMenu: '/process-progress/working-procedure-list' }
      // }
    ]
  }
]
