import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/quality/stopWork/page`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/quality/stopWork/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/quality/stopWork/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.safety.get(`/quality/stopWork/delete/${id}`),

  //详情
  detail: id => axios.safety.get(`/quality/stopWork/get/${id}`),

  //停工处理
  stopHandle: param => axios.safety.post(`/quality/stopWork/stopDispose`, param),

  //复工申请
  resetApply: param => axios.safety.post(`/quality/stopWork/repriseAudit`, param),

  //提交审核
  submitAudit: id => axios.safety.get(`/quality/stopWork/issue/${id}`),

  //审核通过
  auditPass: id => axios.safety.get(`/quality/stopWork/passWork/${id}`),

  //审核驳回
  auditReject: id => axios.safety.get(`/quality/stopWork/rejectWork/${id}`)
}
