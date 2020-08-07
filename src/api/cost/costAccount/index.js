import axios from '@/utils/axios'

/*
 * @任务编号:2824 || 接口文件
 * @开发人员:张龙
 * @日期:2020-03-10
 * @任务类型: 修改代码
 */

/*
 * @任务编号:2824 || 清单接口
 * @开发人员:张龙
 * @日期:2020-03-11
 * @任务类型: 修改代码
 */

export default {
  //成本合同树
  tree: param =>
    axios.construction.post(`costMeteringUnitDivision/newTree`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //列表
  list: param =>
    axios.construction.post(`costAdjustAccounts/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加下一步
  addStep: param =>
    axios.construction.post(
      `/costAdjustAccounts/add`,
      {
        projectId: localStorage.getItem('projectId'),
        ...param
      },
      { timeout: 10000 }
    ),
  //下一步
  addStepNext: param =>
    axios.construction.post(
      `/costAdjustAccounts/add/next`,
      {
        projectId: localStorage.getItem('projectId'),
        ...param
      },
      { timeout: 60000 }
    ),
  getCostId: param =>
    axios.construction.post(`/costAdjustAccounts/add/next`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //下一步详情
  stepDetail: id => axios.construction.get(`/costAdjustAccounts/get/${id}`),

  //更新下一步
  updateStep: param =>
    axios.construction.post(`/costAdjustAccounts/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  updateStepNext: param =>
    axios.construction.post(
      `/costAdjustAccounts/update/next`,
      {
        projectId: localStorage.getItem('projectId'),
        ...param
      },
      { timeout: 60000 }
    ),
  //详情
  detail: id => axios.construction.get(`/costAdjustAccounts/get/${id}`),

  //删除
  deleteStep: id => axios.construction.get(`/costAdjustAccounts/delete/${id}`),

  //清单信息
  inventoryList: param =>
    axios.construction.post(`/costMeteringUnitDivision/inventoryList`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  /*inventoryList: param =>
    axios.construction.post(`/costMeteringUnitDivision/childInventory `, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),*/
  //清单信息
  quantityList: param =>
    axios.construction.post(`/quota/account/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  updateQuantityList: param =>
    axios.construction.post(`/division/inventory/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  /*quantityList: param =>
    axios.construction.post(`/quota/childInfo`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),*/
  //人工支付明细
  personPayList: param =>
    axios.construction.post(`/quota/account/labour/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //耗材支付明细
  materialPayList: param =>
    axios.construction.post(`/quota/account/consume/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //租赁支付明细
  rentPayList: param =>
    axios.construction.post(`/quota/account/rent/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),
  //折旧支付明细
  depreciationPayList: param =>
    axios.construction.post(`/quota/account/depreciation/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  saveRow: param =>
    axios.construction.post(`/costAdjustAccounts/payRecord`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新清单列表
  saveList: param =>
    axios.construction.post(`/quota/account/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //提交审核
  submitAudit: id => axios.construction.get(`/costAdjustAccounts/${id}/submitAudit`),
  //审核
  audit: (id, status) => axios.construction.get(`/costAdjustAccounts/${id}/auditResult/${status}`)
}
