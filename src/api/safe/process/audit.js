import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/assess/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/assess/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/assess/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.safety.get(`/assess/delete/${id}`),

  //详情
  detail: id => axios.safety.get(`/assess/get/${id}`),

  //提交审核
  submitAudit: id => axios.safety.get(`/assess/toAudit/${id}`),

  //审核通过
  auditPass: id => axios.safety.get(`/assess/pass/${id}`),

  //审核驳回
  auditReject: id => axios.safety.get(`/assess/reject/${id}`)
}
