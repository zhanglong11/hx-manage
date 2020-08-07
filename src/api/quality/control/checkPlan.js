import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.construction.post(`/quality/checkPlan/page`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.construction.post(`/quality/checkPlan/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.construction.post(`/quality/checkPlan/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.construction.get(`/quality/checkPlan/delete/${id}`),

  //详情
  detail: id => axios.construction.get(`/quality/checkPlan/get/${id}`),

  //提交审核
  submitAudit: id => axios.construction.get(`/quality/checkPlan/submitAudit/${id}`),

  //审核通过
  auditPass: id => axios.construction.get(`/quality/checkPlan/pass/${id}`),

  //审核驳回
  auditReject: id => axios.construction.get(`/quality/checkPlan/reject/${id}`)
}
