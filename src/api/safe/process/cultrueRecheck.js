import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/civilization/recheck/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/civilization/recheck/updateDraft`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //详情
  detail: id => axios.construction.get(`/civilization/recheck/detail/${id}`),

  //提交审核
  submitAudit: param =>
    axios.safety.post(`/civilization/recheck/updateSubmit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    })
}
