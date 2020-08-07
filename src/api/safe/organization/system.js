import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/manageRegime/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/manageRegime/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/manageRegime/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.safety.get(`/manageRegime/delete/${id}`),

  //详情
  detail: id => axios.safety.get(`/manageRegime/get/${id}`),

  //提交审核
  submitAudit: id => axios.safety.get(`/manageRegime/toAudit/${id}`),

  //审核通过
  auditPass: id => axios.safety.get(`/manageRegime/pass/${id}`),

  //审核驳回
  auditReject: id => axios.safety.get(`/manageRegime/reject/${id}`)
}
