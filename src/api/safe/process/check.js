import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/check/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/check/save`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/check/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.safety.get(`/check/delete/${id}`),

  //详情
  detail: id => axios.safety.get(`/check/get/${id}`),

  //保存提交
  submitAudit: param =>
    axios.safety.post(`/check/saveSubmit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新提交
  updateAudit: param =>
    axios.safety.post(`/check/submit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //审核通过
  auditPass: id => axios.safety.get(`/check/pass/${id}`),

  //审核驳回
  auditReject: id => axios.safety.get(`/check/reject/${id}`)
}
