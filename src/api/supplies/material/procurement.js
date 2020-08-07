import axios from '@/utils/axios'

export default {
  //采购单列表
  getPurchaseOrderList: param =>
    axios.material.post(`/materialPurchase/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //采购单添加
  getPurchaseOrderAdd: param =>
    axios.material.post(`materialPurchase/save`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //采购单添加并提交
  getPurchaseOrderSubmit: param =>
    axios.material.post(`materialPurchase/saveAndSubmit`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //添加选择列表数据
  getMaterialList: param =>
    axios.material.post(`material/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //更新
  update: param =>
    axios.material.post(`/equipment/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //采购单删除
  getPurchaseOrderDelete: id => axios.material.post(`/materialPurchase/delete/${id}`),

  // 采购单详情
  getPurchaseOrderDetail: id => axios.material.get(`/materialPurchase/get/${id}`)
}
