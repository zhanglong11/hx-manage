/*
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: ca8df5134063d9d19758518a0c1648f511635333
@代码提交修改日期: 2020-03-07
@任务类型: 修改代码，合同项目经费核算 基本信息新增接口对接；配置预算项目明细信息
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 9be3e5c65eebd73fa421dd7692c70588a8ed0e99
@代码提交修改日期: 2020-03-09
@任务类型: 修改代码，合同项目经费核算 对接 项目经费核算列表接口，查询核算下的项目经费明细接口，项目经费明细新增(编辑)接口，添加项目经费核算明细详情页
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: b65fe7ac4a5ae22a6bbb5b31ac646558ce4ee2b7
@代码提交修改日期: 2020-03-10
@任务类型: 修改代码，合同项目经费核算 对接 项目经费核算编辑接口，删除接口，提交审核接口
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: d45705ffa3957e93557422bc2fb6adc1cccfbc24
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，合同项目经费核算 添加根据id查询合同项目经费核算详情接口，合同项目经费核算状态回显处理
@补加代码注释日期: 2020-04-11
*/
import { construction } from '@/utils/axios'
const { post, get } = construction
const projectId = localStorage.getItem('projectId')
export default {
  //添加合同项目经费核算
  addCostExpenditureAccounting: data => {
    return post('/costExpenditureAccounting/add', data)
  },
  //修改合同项目经费核算
  editCostExpenditureAccounting: data => {
    return post('/costExpenditureAccounting/update', data)
  },
  //删除合同项目经费核算
  deleteCostExpenditureAccounting: id => {
    return get(`/costExpenditureAccounting/delete/${id}`, {})
  },
  //根据id查询合同项目经费核算
  getCostExpenditureById: id => {
    return get(`costExpenditureAccounting/get/${id}`, {})
  },
  //修改项目经费明细
  addExpenditure: data => {
    return post('/costExpenditureAccounting/addExpenditure', data)
  },
  //查询核算下的项目经费明细
  /*getExpenditureDetailByExpenditureId: expenditureId => {
    return get(`/costExpenditureAccounting/${expenditureId}/selectExpenditure`, {})
  },*/
  /* getExpenditureDetailByExpenditureId: expenditureId => {
    return get(`/costExpenditureRecord/account/${expenditureId}`, {})
  },*/
  getExpenditureDetailByExpenditureId: expenditureId => {
    return get(`/costExpenditureRecord/accounting/list/${expenditureId}`, {})
  },
  //查询核算下的项目测算数据(新建)
  getNewCostExpenditureDetailByExpenditureId: () => {
    return get(`/costExpenditureRecord/recentCalculate/${projectId}`, {})
  },
  //查询核算下的项目测算数据(修改)
  getCostExpenditureDetailByExpenditureId: expenditureId => {
    return get(`/costExpenditureRecord/calculate/${expenditureId}`, {})
  },
  //查询项目经费核算列表
  getCostExpenditureAccountingList: data => {
    return post('costExpenditureAccounting/list', data)
  },
  //提交审核
  /*submitCostExpenditureAccounting: (id, data) => {
    //return post(`costExpenditureAccounting/${id}/submit`, {})
    return post(`costExpenditureAccounting/submit/${id}`, data, {  timeout: 30000 })
  },*/
  submitCostExpenditureAccounting: (id, data) => {
    return post(`costExpenditureAccounting/submit/${id}`, data, { timeout: 30000 })
  },
  //返回列表
  cancelCostExpenditureAccounting: (id, data) => {
    //return post(`costExpenditureAccounting/${id}/submit`, {})
    return post(`costExpenditureAccounting/back/${id}`, data, { timeout: 30000 })
  },
  //保存列表
  saveCostExpenditureAccounting: data => {
    return post(`/costExpenditureRecord/saveAccountExpenditure`, data, { timeout: 30000 })
  }
}
