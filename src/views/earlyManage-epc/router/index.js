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
    path: '/early-manage',
    component: Layout,
    redirect: '/early-manage/file-executor',
    name: 'EarlyManageEpc',
    meta: { title: '前期管理', icon: 'el-icon-s-check' },
    children: [
      {
        path: 'file-executor',
        name: 'FileExecutorEpc',
        component: () => import('@/views/earlyManage-epc/executor'),
        meta: { title: '前期资料准备' }
      },
      {
        path: 'add-file',
        name: 'AddFileEpc',
        hidden: true,
        component: () => import('@/views/earlyManage-epc/executor/editFile'),
        meta: { title: '新建', activeMenu: '/early-manage/file-executor' }
      },
      {
        path: 'edit-file/:id',
        name: 'EditFileEpc',
        hidden: true,
        component: () => import('@/views/earlyManage-epc/executor/editFile'),
        meta: { title: '编辑', activeMenu: '/early-manage/file-executor' }
      },
      {
        path: 'file-detail/:id',
        name: 'FileDetailEpc',
        hidden: true,
        component: () => import('@/views/earlyManage-epc/executor/detail'),
        meta: { title: '详情', activeMenu: '/early-manage/file-executor' }
      },
      {
        path: 'add-task',
        name: 'AddTaskEpc',
        hidden: true,
        component: () => import('@/views/earlyManage-epc/executor/editTask'),
        meta: { title: '新建', activeMenu: '/early-manage/file-executor' }
      },
      {
        path: 'edit-task/:id',
        name: 'EditTaskEpc',
        hidden: true,
        component: () => import('@/views/earlyManage-epc/executor/editTask'),
        meta: { title: '编辑', activeMenu: '/early-manage/file-executor' }
      },
      {
        path: 'task-detail/:id',
        name: 'TaskDetailEpc',
        hidden: true,
        component: () => import('@/views/earlyManage-epc/executor/detailTask'),
        meta: { title: '详情', activeMenu: '/early-manage/file-executor' }
      },
      {
        path: 'file-archive',
        name: 'FileArchiveEpc',
        component: () => import('@/views/earlyManage-epc/archive'),
        meta: { title: '前期文件归档' }
      },
      {
        path: 'fileArchiveEdit/:id',
        name: 'FileArchiveEditEpc',
        hidden: true,
        component: () => import('@/views/earlyManage-epc/archive/edit'),
        meta: { title: '编辑', activeMenu: '/early-manage/file-archive' }
      }
    ]
  }
]
