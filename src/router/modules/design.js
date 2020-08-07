/*
 * @Description:设计管理
 * @Author:
 * @Date: 2020-01-09 15:14:24
 */
import Layout from '@/layout/index'

export default {
  path: '/design',
  redirect: '/design/main/projectOverview',
  name: 'Design',
  component: Layout,
  meta: { title: '设计管理', icon: 'el-icon-edit' },
  children: [
    // {
    //   path: 'main',
    //   meta: { title: '设计管理' },
    //   component: () => import('@/views/design/index.vue'),
    //   children: [
    //
    //   ]
    // },
    {
      path: 'projectOverview',
      name: 'ProjectOverview',
      component: () => import('@/views/design/projectOverview/index.vue'),
      meta: { title: '项目概况' }
    },
    {
      path: 'task',
      name: 'DesignTask',
      component: () => import('@/views/design/task/index.vue'),
      meta: { title: '任务管理' }
    },
    {
      path: 'file',
      name: 'DesignFile',
      component: () => import('@/views/design/file/index.vue'),
      meta: { title: '文件管理' }
    },
    {
      path: 'meetingLog',
      name: 'MeetingLog',
      component: () => import('@/views/design/meetingLog/index.vue'),
      meta: { title: '会议记录' }
    },
    {
      path: 'dynamic',
      name: 'DesignDynamic',
      component: () => import('@/views/design/dynamic/index.vue'),
      meta: { title: '项目动态' }
    },
    {
      path: 'Designapproval',
      name: 'DesignApproval',
      meta: { title: '审核' },
      component: () => import('@/views/design/index.vue'),
      children: [
        {
          path: '/design/approval',
          name: 'DesignApprovalList',
          component: () => import('@/views/design/approval/index.vue'),
          meta: { title: '审批' }
        },
        {
          path: '/design/process',
          name: 'DesignProcess',
          component: () => import('@/views/design/process/index.vue'),
          meta: { title: '流程' }
        }
      ]
    },
    {
      path: 'breakingNew',
      name: 'DesignBreakingNew',
      hidden: true,
      component: () => import('@/views/design/breakingNews/index.vue'),
      meta: { title: '大事记' }
    },
    {
      path: 'breakingNewPreview',
      name: 'BreakingNewPreview',
      hidden: true,
      component: () => import('@/views/design/breakingNews/preview.vue'),
      meta: { title: '大事记预览' }
    },
    {
      path: 'message',
      name: 'DesignMessage',
      hidden: true,
      meta: {
        title: '消息'
      },
      component: () => import('@/views/message')
    }
  ]
}
