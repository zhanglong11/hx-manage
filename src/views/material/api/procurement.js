import axios from '@/utils/axios'

export default {
  //列表
  getPartyList: param =>
    axios.construction.post(`materialSupplyPlan/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //详情
  getPartyDetail: id => axios.construction.get(`/materialSupplyPlan/get/${id}`),
  //通知供应商
  getNotifySupply: id => axios.construction.get(`/materialSupplyPlan/${id}/notifySupply`)
}
