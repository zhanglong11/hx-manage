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
export const recruitManageRoutesEpc = [
  {
    path: '/recruit-manage',
    component: Layout,
    redirect: '/recruit-manage/tender-list',
    name: 'RecruitManageEpc',
    meta: { title: '招采管理', icon: 'el-icon-s-check' },
    children: [
      {
        path: 'tender-list',
        name: 'TenderListEpc',
        component: () => import('@/views/recruitManage-epc/tender'),
        meta: { title: '招标公告登记' }
      },
      {
        path: 'add-tender',
        name: 'AddTenderEpc',
        hidden: true,
        component: () => import('@/views/recruitManage-epc/tender/add'),
        meta: { title: '新建招标公告', activeMenu: '/recruit-manage/tender-list' }
      },
      {
        path: 'edit-tender/:id',
        name: 'EditTenderEpc',
        hidden: true,
        component: () => import('@/views/recruitManage-epc/tender/add'),
        meta: { title: '编辑招标公告', activeMenu: '/recruit-manage/tender-list' }
      },
      {
        path: 'tender-detail/:id/:isCheck',
        name: 'TenderDetailEpc',
        hidden: true,
        component: () => import('@/views/recruitManage-epc/tender/detail'),
        meta: { title: '招标公告详情', activeMenu: '/recruit-manage/tender-list' }
      },
      {
        path: 'winning-list',
        name: 'WinningListEpc',
        component: () => import('@/views/recruitManage-epc/winning'),
        meta: { title: '中标资料登记' }
      },
      {
        path: 'add-winning',
        name: 'AddWinningEpc',
        hidden: true,
        component: () => import('@/views/recruitManage-epc/winning/add'),
        meta: { title: '新建中标资料', activeMenu: '/recruit-manage/winning-list' }
      },
      {
        path: 'edit-winning/:id',
        name: 'EditWinningEpc',
        hidden: true,
        component: () => import('@/views/recruitManage-epc/winning/add'),
        meta: { title: '编辑中标资料', activeMenu: '/recruit-manage/winning-list' }
      },
      {
        path: 'winning-detail/:id/:isCheck',
        name: 'WinningDetailEpc',
        hidden: true,
        component: () => import('@/views/recruitManage-epc/winning/detail'),
        meta: { title: '中标资料详情', activeMenu: '/recruit-manage/winning-list' }
      }
    ]
  }
]
