import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/contingencyPlan/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/contingencyPlan/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/contingencyPlan/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.safety.get(`/contingencyPlan/delete/${id}`),

  //详情
  detail: id => axios.safety.get(`/contingencyPlan/get/${id}`)
}
