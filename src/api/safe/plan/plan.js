import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/plan/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/plan/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/plan/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.safety.get(`/plan/delete/${id}`),

  //详情
  detail: id => axios.safety.get(`/plan/get/${id}`),

  //提交审核
  submitAudit: id => axios.safety.get(`/plan/toAudit/${id}`),

  //审核通过
  auditPass: id => axios.safety.get(`/plan/pass/${id}`),

  //审核驳回
  auditReject: id => axios.safety.get(`/plan/reject/${id}`)
}
