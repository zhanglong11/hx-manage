import axios, { safety, getDownload, postDownload } from '@/utils/axios'
const { post, get } = safety
export default {
  //安全计划
  plan: {
    //列表
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
    detail: id => get(`/inspect/plan/view/${id}`, {})
  },
  //危险源
  dangerous: {
    getDangerousList: param =>
      post(`/dangerSource/list`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    deleteDangerousById: id => get(`/dangerSource/delete/${id}`, {}),
    getDangerousInfoById: id => get(`/dangerSource/get/${id}`, {}),
    //添加
    addDangerous: param =>
      post(`/dangerSource/add`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //更新
    updateDangerous: param =>
      post(`/dangerSource/update`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    dangerousSubmitAudit: id => get(`/dangerSource/toAudit/${id}`, {})
  },
  //安全目标
  safeTarget: {
    list: param =>
      post(`/target/list`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //添加
    add: param =>
      post(`/target/add`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //更新
    update: param =>
      post(`/target/update`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //删除
    delete: id => get(`/target/delete/${id}`, {}),
    //详情
    detail: id => get(`/target/get/${id}`, {}),
    //提交审核
    submitAudit: id => get(`/target/toAudit/${id}`, {}),
    //审核通过
    auditPass: id => get(`/target/pass/${id}`, {}),
    //审核驳回
    auditReject: id => get(`/target/reject/${id}`, {})
  },
  //安全文明目标
  safeCivilizationTarget: {
    //列表
    list: param =>
      axios.safety.post(`/civilizationTarget/list`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),

    //添加
    add: param =>
      axios.safety.post(`/civilizationTarget/add`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),

    //更新
    update: param =>
      axios.safety.post(`/civilizationTarget/update`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),

    //删除
    delete: id => axios.construction.get(`/civilizationTarget/delete/${id}`),

    //详情
    detail: id => axios.construction.get(`/civilizationTarget/get/${id}`),

    //提交审核
    submitAudit: id => axios.construction.get(`/civilizationTarget/toAudit/${id}`),

    //审核通过
    auditPass: id => axios.construction.get(`/civilizationTarget/pass/${id}`),

    //审核驳回
    auditReject: id => axios.construction.get(`/civilizationTarget/reject/${id}`)
  },
  //事故处理
  accidentResolve: {
    //列表
    list: param =>
      post(`/accidentHandling/list`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //添加
    add: param =>
      post(`/accidentHandling/add`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //更新
    update: param =>
      post(`/accidentHandling/update`, {
        projectId: localStorage.getItem('projectId'),
        ...param
      }),
    //删除
    delete: id => get(`/accidentHandling/delete/${id}`, {}),
    //详情
    detail: id => get(`/accidentHandling/get/${id}`, {})
  }
}
