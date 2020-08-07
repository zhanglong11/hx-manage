import axios from '@/utils/axios'

export default {
  //列表
  tree: param =>
    axios.construction.post(`/quality/targetDecompose/tree`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.construction.post(`/quality/targetDecompose/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.construction.post(`/quality/targetDecompose/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.construction.get(`/quality/targetDecompose/delete/${id}`),

  //详情
  detail: id => axios.construction.get(`/quality/targetDecompose/get/${id}`)
}
