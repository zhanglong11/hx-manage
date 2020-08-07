import Layout from '@/layout'
import shell from '@/utils/shell'
export default {
  path: '/quality',
  name: 'Quality',
  component: Layout,
  redirect: '/quality/plan/checkStandard',
  meta: { title: '质量管理', icon: 'el-icon-magic-stick' },
  children: [
    {
      path: 'plan',
      name: 'QualityPlan',
      component: () => import('@/views/quality-kaifashang/plan'),
      meta: { title: '质量计划' },
      children: [
        {
          path: 'checkStandard',
          name: 'QualityPlanCheckStandard',
          component: () => import('@/views/quality-kaifashang/plan/checkStandard'),
          meta: { title: '验收规范' }
        },
        {
          path: 'checkStandardEdit',
          name: 'QualityPlanCheckStandardAdd',
          meta: { title: '新建', activeMenu: '/quality/plan/checkStandard' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/plan/checkStandard/edit')
        },
        {
          path: 'checkStandardEdit/:id',
          name: 'QualityPlanCheckStandardEdit',
          meta: { title: '编辑', activeMenu: '/quality/plan/checkStandard' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/plan/checkStandard/edit')
        },
        {
          path: 'checkStandardDetail/:id',
          name: 'QualityPlanCheckStandardDetail',
          meta: { title: '详情', activeMenu: '/quality/plan/checkStandard' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/plan/checkStandard/detail')
        },
        {
          path: 'constructModel',
          name: 'QualityPlanConstructModel',
          component: () => import('@/views/quality-kaifashang/plan/constructModel'),
          meta: { title: '质量样板' }
        },
        {
          path: 'constructModelEdit',
          name: 'QualityPlanConstructModelAdd',
          meta: { title: '新建', activeMenu: '/quality/plan/constructModel' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/plan/constructModel/edit')
        },
        {
          path: 'constructModelEdit/:id',
          name: 'QualityPlanConstructEdit',
          meta: { title: '编辑', activeMenu: '/quality/plan/constructModel' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/plan/constructModel/edit')
        },
        {
          path: 'constructModelDetail/:id',
          name: 'QualityPlanConstructDetail',
          meta: { title: '详情', activeMenu: '/quality/plan/constructModel' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/plan/constructModel/detail')
        },
        {
          path: 'targetResolve',
          name: 'QualityPlanTargetResolve',
          component: () => import('@/views/quality-kaifashang/plan/targetResolve'),
          meta: { title: '质量目标分解' }
        }
      ]
    },
    {
      path: 'control',
      name: 'QualityControl',
      component: () => import('@/views/quality-kaifashang/control'),
      meta: { title: '质量控制' },
      children: [
        {
          path: 'checkPlan',
          name: 'QualityControlCheckPlan',
          component: () => import('@/views/quality-kaifashang/control/checkPlan'),
          meta: { title: '检查计划' }
        },
        {
          path: 'checkPlanEdit',
          name: 'QualityControlCheckPlanAdd',
          meta: { title: '新建', activeMenu: '/quality/control/checkPlan' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/control/checkPlan/edit')
        },
        {
          path: 'checkPlanEdit/:id',
          name: 'QualityControlCheckPlanEdit',
          meta: { title: '编辑', activeMenu: '/quality/control/checkPlan' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/control/checkPlan/edit')
        },
        {
          path: 'checkPlanDetail/:id',
          name: 'QualityControlCheckPlanDetail',
          meta: { title: '详情', activeMenu: '/quality/control/checkPlan' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/control/checkPlan/detail')
        },
        {
          path: 'qualityCheck',
          name: 'QualityControlQualityCheck',
          component: () => import('@/views/quality-kaifashang/control/qualityCheck'),
          meta: { title: '质量检查' }
        },
        {
          path: 'qualityCheck/add',
          name: 'QualityControlQualityCheckAdd',
          meta: { title: '新建', activeMenu: '/quality/control/qualityCheck' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/control/qualityCheck/edit')
        },
        {
          path: 'qualityCheck/:id',
          name: 'QualityControlQualityCheckEdit',
          meta: { title: '编辑', activeMenu: '/quality/control/qualityCheck' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/control/qualityCheck/edit')
        },
        {
          path: 'qualityCheck/:id/view',
          name: 'QualityControlQualityCheckDetail',
          meta: { title: '详情', activeMenu: '/quality/control/qualityCheck' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/control/qualityCheck/detail')
        },
        {
          path: 'measureQuantity',
          name: 'MeasureQuantity',
          component: shell('MeasureQuantity'),
          redirect: '/quality/control/measureQuantity/actualMeasure',
          meta: { title: '实测实量' },
          children: [
            {
              path: 'actualMeasure',
              name: 'QualityControlActualMeasureList',
              component: () => import('@/views/measureQuantity/actualMeasure'),
              meta: { title: '实测实量' }
            },
            {
              path: 'actualMeasureEdit',
              name: 'ActualMeasureAdd',
              meta: { title: '新建', activeMenu: '/quality/control/measureQuantity/actualMeasure' },
              hidden: true,
              component: () => import('@/views/measureQuantity/actualMeasure/edit')
            },
            {
              path: 'actualMeasureEdit/:id',
              name: 'ActualMeasureEdit',
              meta: { title: '编辑', activeMenu: '/quality/control/measureQuantity/actualMeasure' },
              hidden: true,
              component: () => import('@/views/measureQuantity/actualMeasure/edit')
            },
            {
              path: 'actualMeasureDetail/:id',
              name: 'ActualMeasureDetail',
              meta: { title: '详情', activeMenu: '/quality/control/measureQuantity/actualMeasure' },
              hidden: true,
              component: () => import('@/views/measureQuantity/actualMeasure/detail')
            },
            {
              path: 'actualMeasureReMeasure/:id',
              name: 'ActualMeasureReMeasure',
              meta: { title: '复测', activeMenu: '/quality/control/measureQuantity/actualMeasure' },
              hidden: true,
              component: () => import('@/views/measureQuantity/actualMeasure/reMeasure')
            },
            {
              path: 'actualMeasureRecordDetail',
              name: 'ActualMeasureRecordDetail',
              meta: { title: '实测实量（复测)', activeMenu: '/quality/control/measureQuantity/actualMeasure' },
              hidden: true,
              component: () => import('@/views/measureQuantity/actualMeasure/recordDetail')
            },
            {
              path: 'standardLibrary',
              name: 'StandardLibrary',
              component: () => import('@/views/measureQuantity/standardLibrary'),
              meta: { title: '合格标准库' }
            }
          ]
        },
        {
          path: 'rewardPunishment',
          name: 'QualityControlRewardPunishment',
          component: () => import('@/views/quality-kaifashang/control/rewardPunishment'),
          meta: { title: '质量奖惩' }
        },
        {
          path: 'rewardPunishmentEdit',
          name: 'QualityControlRewardPunishmentAdd',
          meta: { title: '新建', activeMenu: '/quality/control/rewardPunishment' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/control/rewardPunishment/edit')
        },
        {
          path: 'rewardPunishmentEdit/:id',
          name: 'QualityControlRewardPunishmentEdit',
          meta: { title: '编辑', activeMenu: '/quality/control/rewardPunishment' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/control/rewardPunishment/edit')
        },
        {
          path: 'rewardPunishmentDetail/:id',
          name: 'QualityControlRewardPunishmentDetail',
          meta: { title: '详情', activeMenu: '/quality/control/rewardPunishment' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/control/rewardPunishment/detail')
        }
      ]
    },
    {
      path: 'acceptance',
      name: 'QualityAcceptance',
      component: () => import('@/views/quality-kaifashang/acceptance'),
      meta: { title: '质量验收' },
      children: [
        {
          path: 'projectInfo',
          name: 'QualityAcceptanceProjectInfo',
          component: () => import('@/views/quality-kaifashang/acceptance/projectInfo'),
          meta: { title: '单位工程资料' }
        },
        {
          path: 'projectInfoEdit',
          name: 'QualityAcceptanceProjectInfoAdd',
          meta: { title: '新建', activeMenu: '/quality/acceptance/projectInfo' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/acceptance/projectInfo/edit')
        },
        {
          path: 'projectInfoEdit/:id',
          name: 'QualityAcceptanceProjectInfoEdit',
          meta: { title: '编辑', activeMenu: '/quality/acceptance/projectInfo' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/acceptance/projectInfo/edit')
        },
        {
          path: 'projectInfoDetail/:id',
          name: 'QualityAcceptanceProjectInfoDetail',
          meta: { title: '详情', activeMenu: '/quality/acceptance/projectInfo' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/acceptance/projectInfo/detail')
        },
        {
          path: 'checkApply',
          name: 'QualityAcceptanceCheckApply',
          component: () => import('@/views/quality-kaifashang/acceptance/apply'),
          meta: { title: '验收申请' }
        },
        {
          path: 'qualityApplyEdit',
          name: 'QualityAcceptanceCheckApplyAdd',
          meta: { title: '新建', activeMenu: '/quality/acceptance/checkApply' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/acceptance/apply/edit')
        },
        {
          path: 'qualityApplyEdit/:id',
          name: 'QualityAcceptanceCheckApplyEdit',
          meta: { title: '编辑', activeMenu: '/quality/acceptance/checkApply' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/acceptance/apply/edit')
        },
        {
          path: 'qualityApplyDetail/:id/:isCheck',
          name: 'QualityAcceptanceQualityApplyDetail',
          meta: { title: '详情', activeMenu: '/quality/acceptance/checkApply' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/acceptance/apply/detail')
        },
        {
          path: 'qualityAcceptRecordDetail:/id',
          name: 'QualityAcceptanceQualityAcceptDetail',
          meta: { title: '详情', activeMenu: '/quality/acceptance/checkApply' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/acceptance/apply/acceptDetail')
        },
        {
          path: 'finishProtect',
          name: 'QualityAcceptanceFinishProtect',
          component: () => import('@/views/quality-kaifashang/acceptance/finishProtect'),
          meta: { title: '成品保护' }
        },
        {
          path: 'finishProtectEdit',
          name: 'QualityAcceptanceFinishProtectAdd',
          meta: { title: '新建', activeMenu: '/quality/acceptance/finishProtect' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/acceptance/finishProtect/edit')
        },
        {
          path: 'finishProtect /:id',
          name: 'QualityAcceptanceFinishProtectEdit',
          meta: { title: '编辑', activeMenu: '/quality/acceptance/finishProtect' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/acceptance/finishProtect/edit')
        },
        {
          path: 'finishProtectDetail/:id',
          name: 'QualityAcceptanceFinishProtectDetail',
          meta: { title: '详情', activeMenu: '/quality/acceptance/finishProtect' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/acceptance/finishProtect/detail')
        }
      ]
    },
    {
      path: 'toggleManage',
      name: 'QualityToggle',
      component: () => import('@/views/quality-kaifashang/toggleManage'),
      meta: { title: '开停工管理' },
      children: [
        {
          path: 'start',
          name: 'QualityToggleStart',
          component: () => import('@/views/quality-kaifashang/toggleManage/start'),
          meta: { title: '开工申请' }
        },
        {
          path: 'startEdit',
          name: 'QualityToggleStartAdd',
          meta: { title: '新建', activeMenu: '/quality/toggleManage/start' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/toggleManage/start/edit')
        },
        {
          path: 'startEdit/:id',
          name: 'QualityToggleStartEdit',
          meta: { title: '编辑', activeMenu: '/quality/toggleManage/start' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/toggleManage/start/edit')
        },
        {
          path: 'startDetail/:id',
          name: 'QualityToggleStartDetail',
          meta: { title: '详情', activeMenu: '/quality/toggleManage/start' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/toggleManage/start/detail')
        },
        {
          path: 'stop',
          name: 'QualityToggleStop',
          component: () => import('@/views/quality-kaifashang/toggleManage/stop'),
          meta: { title: '停工令' }
        },
        {
          path: 'stopEdit',
          name: 'QualityToggleStopAdd',
          meta: { title: '新建', activeMenu: '/quality/toggleManage/stop' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/toggleManage/stop/edit')
        },
        {
          path: 'stopEdit/:id',
          name: 'QualityToggleStopEdit',
          meta: { title: '编辑', activeMenu: '/quality/toggleManage/stop' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/toggleManage/stop/edit')
        },
        {
          path: 'stopDetail/:id',
          name: 'QualityToggleStopDetail',
          meta: { title: '详情', activeMenu: '/quality/toggleManage/stop' },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/toggleManage/stop/detail')
        }
      ]
    },
    {
      path: 'audit',
      name: 'audit',
      hidden: true,
      component: () => import('@/views/quality-kaifashang/audit'),
      meta: { title: '审核' },
      children: [
        {
          path: 'checkRecordAudit',
          name: 'checkRecordAudit',
          hidden: true,
          component: () => import('@/views/quality-kaifashang/audit/checkRecord'),
          meta: { title: '验收记录审核', isAudit: true }
        },
        {
          path: 'checkRecordAuditDetail',
          name: 'CheckRecordAuditDetail',
          meta: { title: '审核', activeMenu: '/quality/audit/checkRecordAudit', isAudit: true },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/audit/checkRecord/detail')
        },
        {
          path: 'startApply',
          name: 'startApply',
          component: () => import('@/views/quality-kaifashang/toggleManage/start'),
          meta: { title: '开工申请审核', isAudit: true }
        },
        {
          path: 'startApplyDetail/:id',
          name: 'StartApplyDetail',
          meta: { title: '审核', activeMenu: '/quality/audit/startApply', isAudit: true },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/toggleManage/start/detail')
        },
        {
          path: 'resetApply',
          name: 'resetApply',
          component: () => import('@/views/quality-kaifashang/toggleManage/stop'),
          meta: { title: '复工申请审核', isAudit: true }
        },
        {
          path: 'resetApplyDetail/:id',
          name: 'ResetApplyDetail',
          meta: { title: '审核', activeMenu: '/quality/audit/resetApply', isAudit: true },
          hidden: true,
          component: () => import('@/views/quality-kaifashang/toggleManage/stop/detail')
        }
      ]
    }
  ]
}
