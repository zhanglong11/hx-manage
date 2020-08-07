import Layout from '@/layout'

export default {
  path: '/quality',
  name: 'Quality',
  component: Layout,
  redirect: '/quality/plan/checkStandard',
  meta: { title: '质量管理', icon: 'el-icon-magic-stick' },
  children: [
    {
      path: 'plan',
      name: 'Plan',
      component: () => import('@/views/quality/plan'),
      meta: { title: '质量计划' },
      children: [
        {
          path: 'checkStandard',
          name: 'QualityPlanCheckStandard',
          component: () => import('@/views/quality/plan/checkStandard'),
          meta: { title: '验收规范' }
        },
        {
          path: 'checkStandardEdit',
          name: 'QualityPlanCheckStandardAdd',
          meta: { title: '新建', activeMenu: '/quality/plan/checkStandard' },
          hidden: true,
          component: () => import('@/views/quality/plan/checkStandard/edit')
        },
        {
          path: 'checkStandardEdit/:id',
          name: 'QualityPlanCheckStandardEdit',
          meta: { title: '编辑', activeMenu: '/quality/plan/checkStandard' },
          hidden: true,
          component: () => import('@/views/quality/plan/checkStandard/edit')
        },
        {
          path: 'checkStandardDetail',
          name: 'QualityPlanCheckStandardDetail',
          meta: { title: '详情', activeMenu: '/quality/plan/checkStandard' },
          hidden: true,
          component: () => import('@/views/quality/plan/checkStandard/detail')
        },
        {
          path: 'constructModel',
          name: 'QualityPlanConstructModel',
          component: () => import('@/views/quality/plan/constructModel'),
          meta: { title: '质量样板' }
        },
        {
          path: 'constructModelEdit',
          name: 'QualityPlanConstructModelAdd',
          meta: { title: '新建', activeMenu: '/quality/plan/constructModel' },
          hidden: true,
          component: () => import('@/views/quality/plan/constructModel/edit')
        },
        {
          path: 'constructModelEdit/:id',
          name: 'QualityPlanConstructEdit',
          meta: { title: '编辑', activeMenu: '/quality/plan/constructModel' },
          hidden: true,
          component: () => import('@/views/quality/plan/constructModel/edit')
        },
        {
          path: 'constructModelDetail',
          name: 'QualityPlanConstructDetail',
          meta: { title: '详情', activeMenu: '/quality/plan/constructModel' },
          hidden: true,
          component: () => import('@/views/quality/plan/constructModel/detail')
        },
        {
          path: 'targetResolve',
          name: 'QualityPlanTargetResolve',
          component: () => import('@/views/quality/plan/targetResolve'),
          meta: { title: '质量目标分解' }
        }
      ]
    },
    {
      path: 'control',
      name: 'Control',
      component: () => import('@/views/quality/control'),
      meta: { title: '质量控制' },
      children: [
        {
          path: 'checkPlan',
          name: 'QualityControlCheckPlan',
          component: () => import('@/views/quality/control/checkPlan'),
          meta: { title: '检查计划' }
        },
        {
          path: 'checkPlanEdit',
          name: 'QualityControlCheckPlanAdd',
          meta: { title: '新建', activeMenu: '/quality/control/checkPlan' },
          hidden: true,
          component: () => import('@/views/quality/control/checkPlan/edit')
        },
        {
          path: 'checkPlanEdit/:id',
          name: 'QualityControlCheckPlanEdit',
          meta: { title: '编辑', activeMenu: '/quality/control/checkPlan' },
          hidden: true,
          component: () => import('@/views/quality/control/checkPlan/edit')
        },
        {
          path: 'checkPlanDetail/:id',
          name: 'QualityControlCheckPlanDetail',
          meta: { title: '详情', activeMenu: '/quality/control/checkPlan' },
          hidden: true,
          component: () => import('@/views/quality/control/checkPlan/detail')
        },
        {
          path: 'qualityCheck',
          name: 'QualityControlQualityCheck',
          component: () => import('@/views/quality/control/qualityCheck'),
          meta: { title: '质量检查' }
        },
        {
          path: 'qualityCheckEdit',
          name: 'QualityControlQualityCheckAdd',
          meta: { title: '新建', activeMenu: '/quality/control/qualityCheck' },
          hidden: true,
          component: () => import('@/views/quality/control/qualityCheck/edit')
        },
        {
          path: 'qualityCheckEdit/:id',
          name: 'QualityControlQualityCheckEdit',
          meta: { title: '编辑', activeMenu: '/quality/control/qualityCheck' },
          hidden: true,
          component: () => import('@/views/quality/control/qualityCheck/edit')
        },
        {
          path: 'qualityCheckDetail',
          name: 'QualityControlQualityCheckDetail',
          meta: { title: '详情', activeMenu: '/quality/control/qualityCheck' },
          hidden: true,
          component: () => import('@/views/quality/control/qualityCheck/detail')
        },
        // {
        //   path: 'questionTidy',
        //   name: 'questionTidy',
        //   component: () => import('@/views/quality/control/questionTidy'),
        //   meta: { title: '问题整改' }
        // },
        // {
        //   path: 'questionTidyEdit',
        //   meta: { title: '编辑', activeMenu: '/quality/control/questionTidy' },
        //   hidden: true,
        //   component: () => import('@/views/quality/control/questionTidy/edit')
        // },
        // {
        //   path: 'questionTidyDetail',
        //   meta: { title: '详情', activeMenu: '/quality/control/questionTidy' },
        //   hidden: true,
        //   component: () => import('@/views/quality/control/questionTidy/detail')
        // },
        // {
        //   path: 'tidyReview',
        //   name: 'tidyReview',
        //   component: () => import('@/views/quality/control/tidyReview'),
        //   meta: { title: '整改复查' }
        // },
        // {
        //   path: 'tidyReviewEdit',
        //   meta: { title: '编辑', activeMenu: '/quality/control/tidyReview' },
        //   hidden: true,
        //   component: () => import('@/views/quality/control/tidyReview/edit')
        // },
        // {
        //   path: 'tidyReviewDetail',
        //   meta: { title: '详情', activeMenu: '/quality/control/tidyReview' },
        //   hidden: true,
        //   component: () => import('@/views/quality/control/tidyReview/detail')
        // },
        {
          path: 'actualMeasure',
          name: 'QualityControlActualMeasure',
          component: () => import('@/views/quality/control/actualMeasure'),
          meta: { title: '实测实量' }
        },
        {
          path: 'actualMeasureEdit',
          name: 'QualityControlActualMeasureAdd',
          meta: { title: '新建', activeMenu: '/quality/control/actualMeasure' },
          hidden: true,
          component: () => import('@/views/quality/control/actualMeasure/edit')
        },
        {
          path: 'actualMeasureEdit/:id',
          name: 'QualityControlActualMeasureEdit',
          meta: { title: '编辑', activeMenu: '/quality/control/actualMeasure' },
          hidden: true,
          component: () => import('@/views/quality/control/actualMeasure/edit')
        },
        {
          path: 'actualMeasureDetail',
          name: 'QualityControlActualMeasureDetail',
          meta: { title: '详情', activeMenu: '/quality/control/actualMeasure' },
          hidden: true,
          component: () => import('@/views/quality/control/actualMeasure/detail')
        },
        {
          path: 'rewardPunishment',
          name: 'QualityControlRewardPunishment',
          component: () => import('@/views/quality/control/rewardPunishment'),
          meta: { title: '质量奖惩' }
        },
        {
          path: 'rewardPunishmentEdit',
          name: 'QualityControlRewardPunishmentAdd',
          meta: { title: '新建', activeMenu: '/quality/control/rewardPunishment' },
          hidden: true,
          component: () => import('@/views/quality/control/rewardPunishment/edit')
        },
        {
          path: 'rewardPunishmentEdit/:id',
          name: 'QualityControlRewardPunishmentEdit',
          meta: { title: '编辑', activeMenu: '/quality/control/rewardPunishment' },
          hidden: true,
          component: () => import('@/views/quality/control/rewardPunishment/edit')
        },
        {
          path: 'rewardPunishmentDetail',
          name: 'QualityControlRewardPunishmentDetail',
          meta: { title: '详情', activeMenu: '/quality/control/rewardPunishment' },
          hidden: true,
          component: () => import('@/views/quality/control/rewardPunishment/detail')
        }
      ]
    },
    {
      path: 'acceptance',
      name: 'Acceptance',
      component: () => import('@/views/quality/acceptance'),
      meta: { title: '质量验收' },
      children: [
        {
          path: 'projectInfo',
          name: 'QualityAcceptanceProjectInfo',
          component: () => import('@/views/quality/acceptance/projectInfo'),
          meta: { title: '单位工程资料' }
        },
        {
          path: 'projectInfoEdit',
          name: 'QualityAcceptanceProjectInfoAdd',
          meta: { title: '新建', activeMenu: '/quality/acceptance/projectInfo' },
          hidden: true,
          component: () => import('@/views/quality/acceptance/projectInfo/edit')
        },
        {
          path: 'projectInfoEdit/:id',
          name: 'QualityAcceptanceProjectInfoEdit',
          meta: { title: '编辑', activeMenu: '/quality/acceptance/projectInfo' },
          hidden: true,
          component: () => import('@/views/quality/acceptance/projectInfo/edit')
        },
        {
          path: 'projectInfoDetail',
          name: 'QualityAcceptanceProjectInfoDetail',
          meta: { title: '详情', activeMenu: '/quality/acceptance/projectInfo' },
          hidden: true,
          component: () => import('@/views/quality/acceptance/projectInfo/detail')
        },
        {
          path: 'checkApply',
          name: 'QualityAcceptanceCheckApply',
          component: () => import('@/views/quality/acceptance/apply'),
          meta: { title: '验收申请' }
        },
        {
          path: 'qualityApplyEdit',
          name: 'QualityAcceptanceCheckApplyAdd',
          meta: { title: '新建', activeMenu: '/quality/acceptance/checkApply' },
          hidden: true,
          component: () => import('@/views/quality/acceptance/apply/edit')
        },
        {
          path: 'qualityApplyEdit/:id',
          name: 'QualityAcceptanceCheckApplyEdit',
          meta: { title: '编辑', activeMenu: '/quality/acceptance/checkApply' },
          hidden: true,
          component: () => import('@/views/quality/acceptance/apply/edit')
        },
        {
          path: 'qualityApplyDetail/:id',
          name: 'QualityAcceptanceQualityApplyDetail',
          meta: { title: '详情', activeMenu: '/quality/acceptance/checkApply' },
          hidden: true,
          component: () => import('@/views/quality/acceptance/apply/detail')
        },
        /*
         * @任务编号:2686||质量申请-验收记录部分功能开发
         * @开发人员:张龙
         * @日期:2020-03-24
         * @任务类型: 全新代码
         */
        {
          path: 'qualityAcceptDetail',
          name: 'QualityAcceptanceQualityAcceptDetail',
          meta: { title: '详情', activeMenu: '/quality/acceptance/checkApply' },
          hidden: true,
          component: () => import('@/views/quality/acceptance/apply/acceptDetail')
        },
        {
          path: 'finishProtect',
          name: 'QualityAcceptanceFinishProtect',
          component: () => import('@/views/quality/acceptance/finishProtect'),
          meta: { title: '成品保护' }
        },
        {
          path: 'finishProtectEdit',
          name: 'QualityAcceptanceFinishProtectAdd',
          meta: { title: '新建', activeMenu: '/quality/acceptance/finishProtect' },
          hidden: true,
          component: () => import('@/views/quality/acceptance/finishProtect/edit')
        },
        {
          path: 'finishProtect /:id',
          name: 'QualityAcceptanceFinishProtectEdit',
          meta: { title: '编辑', activeMenu: '/quality/acceptance/finishProtect' },
          hidden: true,
          component: () => import('@/views/quality/acceptance/finishProtect/edit')
        },
        {
          path: 'finishProtectDetail',
          name: 'QualityAcceptanceFinishProtectDetail',
          meta: { title: '详情', activeMenu: '/quality/acceptance/finishProtect' },
          hidden: true,
          component: () => import('@/views/quality/acceptance/finishProtect/detail')
        }
      ]
    },
    {
      path: 'toggleManage',
      name: 'Toggle',
      component: () => import('@/views/quality/toggleManage'),
      meta: { title: '开停工管理' },
      children: [
        {
          path: 'start',
          name: 'QualityToggleStart',
          component: () => import('@/views/quality/toggleManage/start'),
          meta: { title: '开工申请' }
        },
        {
          path: 'startEdit',
          name: 'QualityToggleStartAdd',
          meta: { title: '新建', activeMenu: '/quality/toggleManage/start' },
          hidden: true,
          component: () => import('@/views/quality/toggleManage/start/edit')
        },
        {
          path: 'startEdit/:id',
          name: 'QualityToggleStartEdit',
          meta: { title: '编辑', activeMenu: '/quality/toggleManage/start' },
          hidden: true,
          component: () => import('@/views/quality/toggleManage/start/edit')
        },
        {
          path: 'startDetail/:id',
          name: 'QualityToggleStartDetail',
          meta: { title: '详情', activeMenu: '/quality/toggleManage/start' },
          hidden: true,
          component: () => import('@/views/quality/toggleManage/start/detail')
        },
        {
          path: 'stop',
          name: 'QualityToggleStop',
          component: () => import('@/views/quality/toggleManage/stop'),
          meta: { title: '停工令' }
        },
        {
          path: 'stopEdit',
          name: 'QualityToggleStopAdd',
          meta: { title: '新建', activeMenu: '/quality/toggleManage/stop' },
          hidden: true,
          component: () => import('@/views/quality/toggleManage/stop/edit')
        },
        {
          path: 'stopEdit/:id',
          name: 'QualityToggleStopEdit',
          meta: { title: '编辑', activeMenu: '/quality/toggleManage/stop' },
          hidden: true,
          component: () => import('@/views/quality/toggleManage/stop/edit')
        },
        {
          path: 'stopDetail/:id',
          name: 'QualityToggleStopDetail',
          meta: { title: '详情', activeMenu: '/quality/toggleManage/stop' },
          hidden: true,
          component: () => import('@/views/quality/toggleManage/stop/detail')
        }
      ]
    },
    {
      path: 'audit',
      name: 'audit',
      hidden: true,
      component: () => import('@/views/quality/audit'),
      meta: { title: '审核' },
      children: [
        // {
        //   path: 'checkPlanAudit',
        //   name: 'checkPlanAudit',
        //   component: () => import('@/views/quality/control/checkPlan'),
        //   meta: { title: '检查计划审核', isAudit: true }
        // },
        // {
        //   path: 'checkPlanAuditDetail/:id',
        //   name: 'CheckPlanAuditDetail',
        //   hidden: true,
        //   component: () => import('@/views/quality/control/checkPlan/detail'),
        //   meta: { title: '审核', activeMenu: '/quality/audit/checkPlanAudit', isAudit: true }
        // },
        // {
        //   path: 'checkApplyAudit',
        //   name: 'checkApplyAudit',
        //   component: () => import('@/views/quality/acceptance/apply'),
        //   meta: { title: '验收申请审核', isAudit: true }
        // },
        // {
        //   path: 'checkApplyAuditDetail/:id',
        //   name: 'CheckApplyAuditDetail',
        //   meta: { title: '审核', activeMenu: '/quality/audit/checkApplyAudit', isAudit: true },
        //   hidden: true,
        //   component: () => import('@/views/quality/acceptance/apply/detail')
        // },
        {
          path: 'checkRecordAudit',
          name: 'checkRecordAudit',
          hidden: true,
          component: () => import('@/views/quality/audit/checkRecord'),
          meta: { title: '验收记录审核', isAudit: true }
        },
        {
          path: 'checkRecordAuditDetail',
          name: 'CheckRecordAuditDetail',
          meta: { title: '审核', activeMenu: '/quality/audit/checkRecordAudit', isAudit: true },
          hidden: true,
          component: () => import('@/views/quality/audit/checkRecord/detail')
        },
        {
          path: 'startApply',
          name: 'startApply',
          component: () => import('@/views/quality/toggleManage/start'),
          meta: { title: '开工申请审核', isAudit: true }
        },
        {
          path: 'startApplyDetail/:id',
          name: 'StartApplyDetail',
          meta: { title: '审核', activeMenu: '/quality/audit/startApply', isAudit: true },
          hidden: true,
          component: () => import('@/views/quality/toggleManage/start/detail')
        },
        {
          path: 'resetApply',
          name: 'resetApply',
          component: () => import('@/views/quality/toggleManage/stop'),
          meta: { title: '复工申请审核', isAudit: true }
        },
        {
          path: 'resetApplyDetail/:id',
          name: 'ResetApplyDetail',
          meta: { title: '审核', activeMenu: '/quality/audit/resetApply', isAudit: true },
          hidden: true,
          component: () => import('@/views/quality/toggleManage/stop/detail')
        }
      ]
    }
  ]
}
