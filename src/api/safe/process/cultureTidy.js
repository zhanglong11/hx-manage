import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/civilization/rectification/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/civilization/rectification/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/civilization/rectification/updateDraft`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //详情
  detail: id => axios.construction.get(`/civilization/rectification/detail/${id}`),

  //提交审核
  submitAudit: param =>
    axios.safety.post(`/civilization/rectification/updateSubmit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    })
}
