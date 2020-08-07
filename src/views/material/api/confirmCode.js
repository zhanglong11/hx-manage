import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.construction.post(`/materialSupplyConfirmBill/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.construction.post(`/materialSupplyConfirmBill/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.construction.post(`/materialSupplyConfirmBill/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  getMaterialDetail: id => axios.construction.get(`/materialSupplyPlan/get/${id}`),

  //删除
  delete: id => axios.construction.post(`/materialSupplyConfirmBill/delete/${id}`, {}),

  //撤回
  revoke: id => axios.construction.get(`/materialSupplyConfirmBill/${id}/revocation`),

  //作废
  invalid: id => axios.construction.get(`/materialSupplyConfirmBill/${id}/cancellation`),

  //详情
  detail: id => axios.construction.get(`/materialSupplyConfirmBill/get/${id}`),

  //保存并提交
  saveSubmit: param =>
    axios.construction.post(`/materialSupplyConfirmBill/saveAndsubmitAudit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //提交审核
  submitAudit: id => axios.construction.get(`/materialSupplyConfirmBill/${id}/submitAudit`)
}
