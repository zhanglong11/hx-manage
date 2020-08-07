/**
 任务名称：TASK#2848 【智慧工地2.0-前端】资料管理》项目资料》列表、新增、编辑、详情切图及功能开发
 开发人员：崔洛宜
 日期：2020-04-01
 任务类型：路由
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
export const dataManageRouter = [
  {
    path: '/data-manage',
    alwaysShow: true,
    component: Layout,
    redirect: '/data-manage/group-data-list',
    name: 'DataManage',
    meta: { title: '资料管理', icon: 'el-icon-video-camera' },
    children: [
      {
        path: '/data-manage/group-data-list',
        name: 'GroupDataList',
        component: () => import('@/views/data-manage/groupData/list'),
        meta: { title: '集团资料' }
      },
      {
        path: '/data-manage/group-data-add',
        name: 'GroupDataAdd',
        hidden: true,
        component: () => import('@/views/data-manage/groupData/add'),
        meta: { title: '添加集团资料', activeMenu: '/data-manage/group-data-list' }
      },
      {
        path: '/data-manage/group-data-edit/:id',
        name: 'GroupDataEdit',
        hidden: true,
        component: () => import('@/views/data-manage/groupData/add'),
        meta: { title: '编辑集团资料', activeMenu: '/data-manage/group-data-list' }
      },
      {
        path: '/data-manage/group-data-detail/:id',
        name: 'GroupDataDetail',
        hidden: true,
        component: () => import('@/views/data-manage/groupData/detail'),
        meta: { title: '集团资料详情', activeMenu: '/data-manage/group-data-list' }
      },
      //行业资料
      {
        path: '/data-manage/industry-data-list',
        name: 'IndustryDataList',
        component: () => import('@/views/data-manage/industryData/list'),
        meta: { title: '行业资料' }
      },
      {
        path: '/data-manage/industry-data-add',
        name: 'IndustryDataAdd',
        hidden: true,
        component: () => import('@/views/data-manage/industryData/add'),
        meta: { title: '添加行业资料', activeMenu: '/data-manage/industry-data-list' }
      },
      {
        path: '/data-manage/industry-data-edit/:id',
        name: 'IndustryDataEdit',
        hidden: true,
        component: () => import('@/views/data-manage/industryData/add'),
        meta: { title: '编辑行业资料', activeMenu: '/data-manage/industry-data-list' }
      },
      {
        path: '/data-manage/industry-data-detail/:id',
        name: 'IndustryDetail',
        hidden: true,
        component: () => import('@/views/data-manage/industryData/detail'),
        meta: { title: '行业资料详情', activeMenu: '/data-manage/industry-data-list' }
      },
      //项目资料
      {
        path: '/data-manage/project-data-list',
        name: 'ProjectDataList',
        component: () => import('@/views/data-manage/projectData/list'),
        meta: { title: '项目资料' }
      },
      {
        path: '/data-manage/project-data-add',
        name: 'ProjectDataAdd',
        hidden: true,
        component: () => import('@/views/data-manage/projectData/add'),
        meta: { title: '添加项目资料', activeMenu: '/data-manage/project-data-list' }
      },
      {
        path: '/data-manage/project-data-edit/:id',
        name: 'ProjectDataEdit',
        hidden: true,
        component: () => import('@/views/data-manage/projectData/add'),
        meta: { title: '编辑项目资料', activeMenu: '/data-manage/project-data-list' }
      },
      {
        path: '/data-manage/project-data-detail/:id',
        name: 'ProjectDataDetail',
        hidden: true,
        component: () => import('@/views/data-manage/projectData/detail'),
        meta: { title: '项目资料详情', activeMenu: '/data-manage/project-data-list' }
      }
    ]
  }
]
