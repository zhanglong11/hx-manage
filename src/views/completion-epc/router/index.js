/*
 * @Author: 耿为刚 创建
 * @Date: 2020-07-05 17:00:53
 * @Last Modified by: gengweigang
 * @Desc 匿名留言路由
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
    path: '/completion-epc',
    component: Layout,
    redirect: '/completion-epc/dataManage',
    name: 'CompletionEpc',
    meta: { title: '竣工管理', icon: 'el-icon-s-check' },
    children: [
      {
        path: 'dataManage',
        name: 'DataManageEpc',
        component: () => import('@/views/completion-epc/dataManage'),
        meta: { title: '竣工资料管理' },
        children: [
          {
            path: 'executorEpc',
            name: 'ExecutorEpc',
            component: () => import('@/views/completion-epc/dataManage/executor'),
            meta: { title: '竣工资料准备' }
          },
          {
            path: 'addExecutorEpc',
            name: 'AddExecutorEpc',
            hidden: true,
            component: () => import('@/views/completion-epc/dataManage/executor/editFile'),
            meta: { title: '新建', activeMenu: '/completion-epc/dataManage/executorEpc' }
          },
          {
            path: 'editExecutorEpc/:id',
            name: 'EditExecutorEpc',
            hidden: true,
            component: () => import('@/views/completion-epc/dataManage/executor/editFile'),
            meta: { title: '编辑', activeMenu: '/completion-epc/dataManage/executorEpc' }
          },
          {
            path: 'detailExecutorEpc/:id',
            name: 'DetailExecutorEpc',
            hidden: true,
            component: () => import('@/views/completion-epc/dataManage/executor/detail'),
            meta: { title: '详情', activeMenu: '/completion-epc/dataManage/executorEpc' }
          },
          {
            path: 'addExecutorTaskEpc',
            name: 'AddExecutorTaskEpc',
            hidden: true,
            component: () => import('@/views/completion-epc/dataManage/executor/editTask'),
            meta: { title: '新建', activeMenu: '/completion-epc/dataManage/executorEpc' }
          },
          {
            path: 'editExecutorTaskEpc/:id',
            name: 'EditExecutorTaskEpc',
            hidden: true,
            component: () => import('@/views/completion-epc/dataManage/executor/editTask'),
            meta: { title: '编辑', activeMenu: '/completion-epc/dataManage/executorEpc' }
          },
          {
            path: 'detailExecutorTaskEpc/:id',
            name: 'DetailExecutorTaskEpc',
            hidden: true,
            component: () => import('@/views/completion-epc/dataManage/executor/detailTask'),
            meta: { title: '详情', activeMenu: '/completion-epc/dataManage/executorEpc' }
          },

          // {
          //   path: 'operatorEpc',
          //   name: 'OperatorEpc',
          //   component: () => import('@/views/completion-epc/dataManage/operator'),
          //   meta: { title: '竣工资料管理-操作人' }
          // },
          // {
          //   path: 'addOperatorEpc',
          //   name: 'AddOperatorEpc',
          //   hidden: true,
          //   component: () => import('@/views/completion-epc/dataManage/operator/editFile'),
          //   meta: { title: '新建', activeMenu: '/completion-epc/dataManage/OperatorEpc' }
          // },
          // {
          //   path: 'editOperatorEpc/:id',
          //   name: 'EditOperatorEpc',
          //   hidden: true,
          //   component: () => import('@/views/completion-epc/dataManage/operator/editFile'),
          //   meta: { title: '编辑', activeMenu: '/completion-epc/dataManage/operatorEpc' }
          // },
          // {
          //   path: 'detailOperatorEpc/:id',
          //   name: 'DetailOperatorEpc',
          //   hidden: true,
          //   component: () => import('@/views/completion-epc/dataManage/operator/detail'),
          //   meta: { title: '详情', activeMenu: '/completion-epc/dataManage/operatorEpc' }
          // },
          {
            path: 'archiveEpc',
            name: 'ArchiveEpc',
            component: () => import('@/views/completion-epc/dataManage/archive'),
            meta: { title: '竣工资料归档' }
          },
          {
            path: 'detailEditArchive/:id',
            name: 'EditArchive',
            hidden: true,
            component: () => import('@/views/completion-epc/dataManage/archive/edit'),
            meta: { title: '编辑', activeMenu: '/completion-epc/dataManage/archiveEpc' }
          },
          {
            path: 'detailArchive/:id',
            name: 'DetailArchive',
            hidden: true,
            component: () => import('@/views/completion-epc/dataManage/archive/edit'),
            meta: { title: '详情', activeMenu: '/completion-epc/dataManage/archiveEpc' }
          }
        ]
      },
      {
        path: 'projectOverEpc',
        name: 'ProjectOverEpc',
        component: () => import('@/views/completion-epc/projectOver'),
        meta: { title: '项目移交' }
      },
      {
        path: 'editProjectOverEpc',
        name: 'EditProjectOverEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/projectOver/edit'),
        meta: { title: '编辑', activeMenu: '/completion-epc/projectOver/ProjectOverEpc' }
      },
      {
        path: 'detailProjectOverEpc',
        name: 'DetailProjectOverEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/projectOver/detail'),
        meta: { title: '详情', activeMenu: '/completion-epc/projectOver/ProjectOverEpc' }
      },
      {
        path: 'project-first-inspect-list',
        name: 'ProjectFirstInspectList',
        component: () => import('@/views/completion-epc/projectFirstInspect'),
        meta: { title: '工程初验管理' }
      },
      {
        path: 'add-project-first-inspect',
        name: 'AddProjectFirstInspectEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/projectFirstInspect/add.vue'),
        meta: { title: '添加工程初验', activeMenu: '/completion-epc/project-first-inspect-list' }
      },
      {
        path: 'edit-project-first-inspect/:id',
        name: 'EditProjectFirstInspectEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/projectFirstInspect/add.vue'),
        meta: { title: '编辑工程初验', activeMenu: '/completion-epc/project-first-inspect-list' }
      },
      {
        path: 'project-first-inspect-detail/:id',
        name: 'ProjectFirstInspectDetailEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/projectFirstInspect/detail.vue'),
        meta: { title: '工程初验详情', activeMenu: '/completion-epc/project-first-inspect-list' }
      },
      {
        path: 'edit-reject-project-first-inspect/:id/:isReject',
        name: 'EditRejectProjectFirstInspectEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/projectFirstInspect/add.vue'),
        meta: { title: '驳回-修改', activeMenu: '/completion-epc/project-first-inspect-list' }
      },
      {
        path: 'first-inspect-rectify-list',
        name: 'FirstInspectRectifyListEpc',
        component: () => import('@/views/completion-epc/firstInspectRectify'),
        meta: { title: '初验整改管理' }
      },
      {
        path: 'first-inspect-rectify-writeResult/:id',
        name: 'FirstInspectRectifyWriteResultEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/firstInspectRectify/writeResult.vue'),
        meta: { title: '填写整改结果', activeMenu: '/completion-epc/first-inspect-rectify-list' }
      },
      {
        path: 'first-inspect-detail-write/:id/:isCheck',
        name: 'FirstInspectDetailWriteEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/projectFirstInspect/detail.vue'),
        meta: { title: '初验整改详情(填写验收结果)', activeMenu: '/completion-epc/project-first-inspect-list' }
      },
      {
        path: 'over-inspect-list',
        name: 'OverInspectListEpc',
        component: () => import('@/views/completion-epc/overInspect'),
        meta: { title: '竣工验收管理' }
      },
      {
        path: 'add-over-inspect',
        name: 'AddOverInspectEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/overInspect/add.vue'),
        meta: { title: '添加竣工验收', activeMenu: '/completion-epc/over-inspect-list' }
      },
      {
        path: 'edit-over-inspect/:id',
        name: 'EditOverInspectEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/overInspect/add.vue'),
        meta: { title: '编辑竣工验收', activeMenu: '/completion-epc/over-inspect-list' }
      },
      {
        path: 'over-inspect-detail/:id/:isCheck',
        name: 'OverInspectDetailEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/projectFirstInspect/detail.vue'),
        meta: { title: '竣工验收详情', activeMenu: '/completion-epc/over-inspect-list' }
      },
      {
        path: 'over-inspect-rectify-list',
        name: 'OverInspectRectifyListEpc',
        component: () => import('@/views/completion-epc/overInspectRectify'),
        meta: { title: '竣工验收整改' }
      },
      {
        path: 'over-inspect-rectify-detail/:id/:isCheck',
        name: 'OverInspectRectifyDetailEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/projectFirstInspect/detail.vue'),
        meta: { title: '竣工验收整改详情', activeMenu: '/completion-epc/over-inspect-rectify-list' }
      },
      {
        path: 'over-inspect-rectify-writeResult/:id',
        name: 'OverInspectRectifyWriteResultEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/overInspectRectify/writeResult.vue'),
        meta: { title: '填写整改结果', activeMenu: '/completion-epc/over-inspect-rectify-list' }
      },
      {
        path: 'over-inspect-detail-write/:id/:isCheck',
        name: 'OverInspectDetailWriteEpc',
        hidden: true,
        component: () => import('@/views/completion-epc/projectFirstInspect/detail.vue'),
        meta: { title: '竣工验收整改(填写验收结果)', activeMenu: '/completion-epc/over-inspect-rectify-list' }
      }
    ]
  }
]
