import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/train/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/train/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/train/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.safety.get(`/train/delete/${id}`),

  //详情
  detail: id => axios.safety.get(`/train/get/${id}`)
}
