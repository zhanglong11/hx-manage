/**
  任务名称：【智慧工地2.0-前端】系统参数模块切图及功能开发
  开发人员：耿为刚
  日期：2020-04-02
  任务类型：全新代码
**/

/* 系统参数 */
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
export const systemConfigRouter = [
  {
    path: '/system-config',
    component: Layout,
    redirect: '/system-config/system-config-list',
    name: 'SystemConfig',
    meta: { title: '系统配置', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'system-config-list',
        name: 'SystemConfigList',
        component: () => import('@/views/system-config/config-list'),
        meta: { title: '系统参数' }
      }
    ]
  }
]
