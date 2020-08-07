import { construction } from '@/utils/axios'
export default {
  // 获取列表
  getList: data => {
    return construction.post('aaa', data)
  },
  delete: id => {
    return construction.get(`/delete/${id}`)
  },
  add: data => {
    return construction.post('/add', data)
  },
  submit: data => {
    return construction.post('/submit', data)
  },
  getDetail: id => {
    return construction.get(`/detail/${id}`)
  },
  //详情页提交
  submitById: id => {
    return construction.get(`/detail/${id}`)
  },
  //详情页保存
  addById: id => {
    return construction.get(`/detail/${id}`)
  },
  //验收方提交验收
  inspect: data => {
    return construction.post('/inspect', data)
  }
}
