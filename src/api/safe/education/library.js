import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.safety.post(`/knowledgeLibrary/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/knowledgeLibrary/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/knowledgeLibrary/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.safety.get(`/knowledgeLibrary/delete/${id}`),

  //详情
  detail: id => axios.safety.get(`/knowledgeLibrary/get/${id}`)
}
