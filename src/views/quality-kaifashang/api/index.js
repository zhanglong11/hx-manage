import axios, { safety, getDownload, postDownload } from '@/utils/axios'
import rewardPunishTypeList from '@/views/quality-kaifashang/lib/rewardPunishTypeList'
const { post, get } = safety
export default {
  //质量计划
  checkPlan: {
    list: param =>
      post(`/inspect/plan/page`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //启用
    start: id => get(`/inspect/plan/start/${id}`, {}),
    //停用
    stop: id => get(`/inspect/plan/stop/${id}`, {}),
    //添加
    add: param =>
      post(`/inspect/plan/add`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //更新
    update: param =>
      post(`/inspect/plan/edit`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //删除
    delete: id => get(`/quality/checkPlan/delete/${id}`),
    //详情
    detail: id => get(`/inspect/plan/view/${id}`, {}),
    //提交审核
    submitAudit: id => get(`/quality/checkPlan/submitAudit/${id}`),
    //审核通过
    auditPass: id => get(`/quality/checkPlan/pass/${id}`),
    //审核驳回
    auditReject: id => get(`/quality/checkPlan/reject/${id}`)
  },
  standard: {
    list: param =>
      post(`/quality/checkSpecific/pageList`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //添加
    add: param =>
      post(`/quality/checkSpecific/add`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //更新
    update: param =>
      post(`/quality/checkSpecific/update`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //删除
    delete: id => get(`/quality/checkSpecific/delete/${id}`, {}),
    //详情
    detail: id => get(`/quality/checkSpecific/get/${id}`, {})
  },
  //质量样板
  qualityModel: {
    //列表
    list: param =>
      post(`/quality/constructTemplate/pageList`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //添加
    add: param =>
      post(`/quality/constructTemplate/add`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //更新
    update: param =>
      post(`/quality/constructTemplate/update`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //删除
    delete: id => get(`/quality/constructTemplate/delete/${id}`, {}),
    //详情
    detail: id => get(`/quality/constructTemplate/get/${id}`, {})
  },
  targetResolve: {
    //列表
    tree: param =>
      post(`/quality/targetDecompose/tree`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //添加
    add: param =>
      post(`/quality/targetDecompose/add`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //更新
    update: param =>
      post(`/quality/targetDecompose/update`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //删除
    delete: id => get(`/quality/targetDecompose/delete/${id}`, {}),
    //详情
    detail: id => get(`/quality/targetDecompose/get/${id}`, {})
  },
  //质量奖惩
  rewardPunish: {
    //列表
    list: param =>
      post(`/quality/rewardPunishment/page`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //添加
    add: param =>
      post(`/quality/rewardPunishment/add`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //更新
    update: param =>
      post(`/quality/rewardPunishment/update`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //删除
    delete: id => get(`/quality/rewardPunishment/delete/${id}`, {}),
    //详情
    detail: id => get(`/quality/rewardPunishment/get/${id}`, {})
  },
  //单位工程资料
  projectInfo: {
    //列表
    list: param =>
      post(`/quality/unitProject/pageList`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //添加
    add: param =>
      post(`/quality/unitProject/add`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //更新
    update: param =>
      post(`/quality/unitProject/update`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //删除
    delete: id => get(`/quality/unitProject/delete/${id}`, {}),
    //详情
    detail: id => get(`/quality/unitProject/get/${id}`, {})
  },
  acceptanceApply: {
    //列表
    list: param =>
      post(`/quality/acceptanceApply/page`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //列表
    acceptList: param =>
      post(`/quality/checkSpecific/pageList`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //添加
    add: param =>
      post(`/quality/acceptanceApply/add`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //更新
    update: param =>
      post(`/quality/acceptanceApply/update`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //删除
    delete: id => get(`/quality/acceptanceApply/delete/${id}`, {}),
    //详情
    detail: id => get(`/quality/acceptanceApply/get/${id}`, {}),
    //提交审核
    submitAudit: id => get(`/quality/acceptanceApply/submitAudit/${id}`, {}),
    //审核通过
    auditPass: id => get(`/quality/acceptanceApply/pass/${id}`, {}),
    //审核驳回
    auditReject: id => get(`/quality/acceptanceApply/reject/${id}`, {}),
    //记录保存
    logSave: param =>
      post(`/quality/acceptanceApply/logSave`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //记录保存
    logSubmit: id => get(`/quality/acceptanceApply/submitLogsAudit/${id}`, {}),
    //审核通过
    logPass: id => get(`/quality/acceptanceApply/passLogs/${id}`, {}),
    //审核驳回
    logReject: id => get(`/quality/acceptanceApply/rejectLogs/${id}`, {})
  },
  //成品保护
  finishProtect: {
    //列表
    list: param =>
      post(`/quality/productProtect/pageList`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //添加
    add: param =>
      post(`/quality/productProtect/add`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),

    //更新
    update: param =>
      post(`/quality/productProtect/update`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),

    //删除
    delete: id => get(`/quality/productProtect/delete/${id}`, {}),

    //详情
    detail: id => get(`/quality/productProtect/get/${id}`, {})
  }
}
