import { construction } from '@/utils/axios'
export default {
  // 招标管理
  getTenderList: data => {
    return construction.post('/epc/invitation/bid/list', data)
  },
  deleteTender: id => {
    return construction.get(`/epc/invitation/bid/delete/${id}`)
  },
  addTender: data => {
    return construction.post('/epc/invitation/bid/save', data)
  },
  submitTender: data => {
    return construction.post('/epc/invitation/bid/submit', data)
  },
  getTenderDetail: id => {
    return construction.get(`/epc/invitation/bid/get/${id}`)
  },
  publish: id => {
    return construction.get(`/epc/invitation/bid/publish/${id}`)
  },
  withdraw: id => {
    return construction.get(`/epc/invitation/bid/withdraw/${id}`)
  },
  audit: id => {
    return construction.get(`/epc/invitation/bid/auditPass/${id}`)
  },
  // 中标
  getWinningList: data => {
    return construction.post('/epc/tender/list', data)
  },
  //添加中标时获取尚可选择的招标公告
  getAvailableTenderList: () => {
    return construction.get(`/epc/tender/available/invitation/${localStorage.getItem('projectId')}`)
  },
  addWinning: data => {
    return construction.post('/epc/tender/save', data)
  },
  deleteWinning: id => {
    return construction.get(`/epc/tender/delete/${id}`)
  },
  submitWinning: data => {
    return construction.post('/epc/tender/submit', data)
  },
  getWinningDetail: id => {
    return construction.get(`/epc/tender/get/${id}`)
  }
}
