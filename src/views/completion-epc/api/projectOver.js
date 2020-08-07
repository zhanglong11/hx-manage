import { construction } from '@/utils/axios'
export default {
  //获取列表
  getList: data => {
    return construction.post(`/project/transfer/page`, {
      projectId: localStorage.getItem('projectId'),
      ...data
    })
  },
  //项目移交-修改
  getUpdate: data => {
    return construction.post(`/project/transfer/update`, {
      ...data
    })
  },
  //项目移交-详情
  getDetail: id => {
    return construction.get(`/project/transfer/view/${id}`)
  },
  //项目移交-移交状态
  getTurnOver: id => {
    return construction.get(`/project/transfer/turn/${id}`)
  }
}
