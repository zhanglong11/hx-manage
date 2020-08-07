import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.construction.post(`/quality/qualityCheck/page`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新-有问题
  updateHave: param =>
    axios.construction.post(`/quality/qualityCheck/updateHave`, {
      ...param
    }),

  //更新-没问题
  updateNo: param =>
    axios.construction.post(`/quality/qualityCheck/updateNo`, {
      ...param
    }),

  //问题整改
  tidy: param =>
    axios.construction.post(`/quality/problem/rectification`, {
      ...param
    }),

  //整改复查
  reset: param =>
    axios.construction.post(`/quality/problem/review`, {
      ...param
    }),

  //删除
  delete: id => axios.construction.get(`/quality/qualityCheck/delete/${id}`),

  //详情
  detail: id => axios.construction.get(`/quality/qualityCheck/get/${id}`)
}
