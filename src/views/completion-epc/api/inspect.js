import { construction } from '@/utils/axios'
export default {
  // 获取列表
  getList: data => {
    return construction.post('/project/acceptance/page', data)
  },
  delete: id => {
    return construction.get(`/project/acceptance/delete/${id}`)
  },
  add: data => {
    return construction.post('/project/acceptance/add', data)
  },
  update: data => {
    return construction.post('/project/acceptance/update', data)
  },
  getDetail: id => {
    return construction.get(`project/acceptance/view/${id}`)
  },
  //验收方提交验收
  inspect: data => {
    return construction.post('/project/acceptance/fill', data)
  },
  //填写验收结果
  rectify: data => {
    return construction.post('/project/acceptance/review', data)
  }
}
