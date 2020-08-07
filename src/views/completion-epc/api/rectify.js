import { construction } from '@/utils/axios'
export default {
  // 获取列表
  getList: data => {
    return construction.post('/project/acceptance/rectifyPage', data)
  },
  //通知整改
  noticeRectify: data => {
    return construction.post('/project/acceptance/orderRectify', data)
  },
  //填写整改结果
  writeResult: data => {
    return construction.post('/project/acceptance/rectify', data)
  },
  getDetail: id => {
    return construction.get(`/project/acceptance/view/${id}`)
  },
  //获取timeLineId详情
  getTimeLineItemDetail: id => {
    return construction.get(`project/rectifyReview/detail/${id}`)
  }
}
