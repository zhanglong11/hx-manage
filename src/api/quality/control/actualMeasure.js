import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/quality//measured/page`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/quality/measured/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/quality/measured/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.safety.get(`/quality/measured/delete/${id}`),

  //详情
  detail: id => axios.safety.get(`/quality/measured/get/${id}`)
}
