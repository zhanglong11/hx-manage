import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/specialOperationRecord/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/specialOperationRecord/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/specialOperationRecord/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.safety.get(`/specialOperationRecord/delete/${id}`),

  //详情
  detail: id => axios.safety.get(`/specialOperationRecord/get/${id}`),

  //提交审核
  submitAudit: id => axios.safety.get(`/specialOperationRecord/toAudit/${id}`),

  //审核通过
  auditPass: id => axios.safety.get(`/specialOperationRecord/pass/${id}`),

  //审核驳回
  auditReject: id => axios.safety.get(`/specialOperationRecord/reject/${id}`)
}
