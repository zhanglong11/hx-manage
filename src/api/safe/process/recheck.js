import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/recheck/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/recheck/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //详情
  detail: id => axios.safety.get(`/recheck/get/${id}`),

  //提交审核
  submitAudit: param =>
    axios.safety.post(`/recheck/submit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    })
}
