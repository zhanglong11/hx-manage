/**
  任务名称：task#2854 【智慧工地2.0-前端】工作台切图及功能开发
  开发人员：耿为刚
  日期：2020-04-01
  描述：工作台路由
**/

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
export const workBenchRouter = [
  {
    path: '/work-bench',
    component: Layout,
    redirect: '/work-bench/work-bench-home',
    name: 'WorkBench',
    meta: { title: '工作台', icon: 'el-icon-s-platform' },
    children: [
      {
        path: 'work-bench-home',
        name: 'WorkBenchHome',
        component: () => import('@/views/work-bench/index/index'),
        meta: { title: '工作台首页', icon: 'el-icon-s-home' }
      },
      {
        path: 'work-bench-project',
        name: 'WorkBenchProject',
        component: () => import('@/views/work-bench/project/index'),
        meta: { title: '项目管理', icon: 'el-icon-office-building' }
      },
      {
        path: 'work-bench-approval',
        name: 'WorkBenchApproval',
        component: () => import('@/views/work-bench/approval/approval-list'),
        meta: { title: '审核管理', icon: 'el-icon-s-check' },
        children: [
          {
            path: 'work-bench-approval-mine',
            name: 'WorkBenchApprovalMine',
            component: () => import('@/views/work-bench/approval/mine'),
            meta: { title: '我发起的' }
          },
          {
            path: 'work-bench-approval-todo',
            name: 'WorkBenchApprovalTodo',
            component: () => import('@/views/work-bench/approval/todo'),
            meta: { title: '待办' }
          },
          {
            path: 'work-bench-approval-done',
            name: 'WorkBenchApprovalDone',
            component: () => import('@/views/work-bench/approval/done'),
            meta: { title: '已办' }
          }
        ]
      },
      {
        path: 'work-bench-events',
        name: 'WorkBenchEvents',
        component: () => import('@/views/work-bench/events/events-list'),
        meta: { title: '大事记', icon: 'el-icon-s-flag' }
      },
      {
        path: 'work-bench-events-add',
        name: 'AddWorkBenchEvents',
        hidden: true,
        component: () => import('@/views/work-bench/events/add-events'),
        meta: { title: '新增大事记', activeMenu: '/work-bench/work-bench-events' }
      },
      {
        path: 'work-bench-events-edit',
        name: 'EditWorkBenchEvents',
        hidden: true,
        component: () => import('@/views/work-bench/events/add-events'),
        meta: { title: '编辑大事记', activeMenu: '/work-bench/work-bench-events' }
      },
      {
        path: 'work-bench-events/:id',
        name: 'WorkBenchEventsDetails',
        hidden: true,
        component: () => import('@/views/work-bench/events/events-details'),
        meta: { title: '大事记详情', icon: 'el-icon-s-comment', activeMenu: '/work-bench/work-bench-events' }
      },
      {
        path: 'work-bench-message',
        name: 'WorkBenchMessage',
        component: () => import('@/views/work-bench/message/message-list'),
        meta: { title: '消息', icon: 'el-icon-s-comment' }
      },
      {
        path: 'work-bench-message/:id',
        name: 'WorkBenchMessageDetails',
        hidden: true,
        component: () => import('@/views/work-bench/message/message-details'),
        meta: { title: '消息详情', icon: 'el-icon-s-comment', activeMenu: '/work-bench/work-bench-message' }
      }
    ]
  }
]
