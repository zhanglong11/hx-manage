import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/civilization/check/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/civilization/check/saveDraft`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/civilization/check/updateDraft`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.construction.get(`/civilization/check/delete/${id}`),

  //详情
  detail: id => axios.construction.get(`/civilization/check/get/${id}`),

  //保存提交
  submitAudit: param =>
    axios.safety.post(`/civilization/check/save`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新提交
  updateAudit: param =>
    axios.safety.post(`/civilization/check/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //审核通过
  auditPass: id => axios.construction.get(`/civilization/check/pass/${id}`),

  //审核驳回
  auditReject: id => axios.construction.get(`/civilization/check/reject/${id}`)
}
