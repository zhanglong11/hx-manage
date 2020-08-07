/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-31
 * @Last Modified by: gengweigang
 * @Desc 工序进度路由
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
export const processProgressRouter = [
  {
    path: '/process-progress',
    component: Layout,
    redirect: '/process-progress/template-list',
    name: 'ProcessProgress',
    meta: { title: '工序进度', icon: 'el-icon-notebook-2' },
    children: [
      {
        path: 'template-list',
        name: 'ProcessProgressTemplateList',
        component: () => import('@/views/process-progress/template-list'),
        meta: { title: '工序模板管理' }
      },
      {
        path: 'add-template',
        name: 'ProcessProgressAddTemplate',
        hidden: true,
        component: () => import('@/views/process-progress/add-template'),
        meta: { title: '新建模板', activeMenu: '/process-progress/template-list' }
      },
      {
        path: 'edit-template',
        name: 'ProcessProgressEditTemplate',
        hidden: true,
        component: () => import('@/views/process-progress/add-template'),
        meta: { title: '编辑模板', activeMenu: '/process-progress/template-list' }
      },
      {
        path: 'interleaving',
        name: 'ProcessProgressInterleaving',
        hidden: true,
        component: () => import('@/views/process-progress/interleaving'),
        meta: { title: '穿插工序', activeMenu: '/process-progress/template-list' }
      },
      {
        path: 'add-interleaving',
        name: 'ProcessProgressAddInterleaving',
        hidden: true,
        component: () => import('@/views/process-progress/add-interleaving'),
        meta: { title: '添加工序', activeMenu: '/process-progress/template-list' }
      },
      {
        path: 'edit-interleaving',
        name: 'ProcessProgressEditInterleaving',
        hidden: true,
        component: () => import('@/views/process-progress/add-interleaving'),
        meta: { title: '编辑工序', activeMenu: '/process-progress/template-list' }
      },
      {
        path: 'working-procedure-list',
        name: 'ProcessProgressWorkingProcedure',
        component: () => import('@/views/process-progress/working-procedure/working-procedure-list'),
        meta: { title: '规则配置' }
      },
      {
        path: 'add-working-procedure',
        name: 'ProcessProgressAddWorkingProcedure',
        hidden: true,
        component: () => import('@/views/process-progress/working-procedure/add-working-procedure'),
        meta: { title: '规则配置', activeMenu: '/process-progress/working-procedure-list' }
      },
      {
        path: 'preview-working-procedure',
        name: 'ProcessProgressPreviewWorkingProcedure',
        hidden: true,
        component: () => import('@/views/process-progress/working-procedure/add-working-procedure'),
        meta: { title: '预览规则配置', activeMenu: '/process-progress/working-procedure-list' }
      },
      {
        path: 'bim-relation',
        name: 'BimRelation',
        hidden: true,
        component: () => import('@/views/process-progress/working-procedure/bim-relation'),
        meta: { title: 'BIM关联', activeMenu: '/process-progress/working-procedure-list' }
      }
    ]
  }
]
