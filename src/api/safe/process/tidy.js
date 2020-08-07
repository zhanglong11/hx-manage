import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/rectification/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/rectification/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //详情
  detail: id => axios.safety.get(`/rectification/get/${id}`),

  //提交审核
  submitAudit: param =>
    axios.safety.post(`/rectification/submit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    })
}
