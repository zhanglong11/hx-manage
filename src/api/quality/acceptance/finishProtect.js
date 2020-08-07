import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.construction.post(`/quality/productProtect/pageList`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.construction.post(`/quality/productProtect/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.construction.post(`/quality/productProtect/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.construction.get(`/quality/productProtect/delete/${id}`),

  //详情
  detail: id => axios.construction.get(`/quality/productProtect/get/${id}`)
}
