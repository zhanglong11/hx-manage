import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/quality/acceptanceApply/page`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //列表
  acceptList: param =>
    axios.safety.post(`/quality/checkSpecific/pageList`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/quality/acceptanceApply/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/quality/acceptanceApply/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.safety.get(`/quality/acceptanceApply/delete/${id}`),

  //详情
  detail: id => axios.safety.get(`/quality/acceptanceApply/get/${id}`),

  //提交审核
  submitAudit: id => axios.safety.get(`/quality/acceptanceApply/submitAudit/${id}`),

  //审核通过
  auditPass: id => axios.safety.get(`/quality/acceptanceApply/pass/${id}`),

  //审核驳回
  auditReject: id => axios.safety.get(`/quality/acceptanceApply/reject/${id}`),

  /*
   * @任务编号:2686||质量申请-验收记录部分功能开发
   * @开发人员:张龙
   * @日期:2020-03-24
   * @任务类型: 全新代码
   */

  /*
   * @任务编号:2686||质量申请-验收记录功能完善
   * @开发人员:张龙
   * @日期:2020-03-25
   * @任务类型: 修改代码
   */

  //记录保存
  logSave: param =>
    axios.safety.post(`/quality/acceptanceApply/logSave`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //记录保存
  logSubmit: id => axios.safety.get(`/quality/acceptanceApply/submitLogsAudit/${id}`),

  //审核通过
  logPass: id => axios.safety.get(`/quality/acceptanceApply/passLogs/${id}`),

  //审核驳回
  logReject: id => axios.safety.get(`/quality/acceptanceApply/rejectLogs/${id}`)
}
