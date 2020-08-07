import { construction } from '@/utils/axios'
const { post, get } = construction
const projectId = localStorage.getItem('projectId')
export default {
  /**
   任务名称：TASK#2827 3月6号注释
   开发人员：崔洛宜
   日期：2020-03-31
   任务类型：注释(添加接口)
   **/
  /**
   任务名称：TASK#2830 3月10日注释
   开发人员：崔洛宜
   日期：2020-03-10
   任务类型：注释(修改api接口)(6)
   **/
  //添加合同目标成本测算
  addContractTargetCostBudgetForm: data => {
    return post('/costMeasureCalculate/add', data)
  },
  /**
   任务名称：TASK#2831 3月11号注释
   开发人员：崔洛宜
   日期：2020-03-11
   任务类型：注释(修改添加下一步接口)(1)
   **/
  addContractTargetCostBudgetFormNext: data => {
    return post('costMeasureCalculate/add/next', data, { timeout: 60000 })
  },
  //更新合同测算
  updateContractTargetCostBudgetForm: data => {
    return post('/costMeasureCalculate/update', data)
  },
  //更新合同测算下一步
  updateContractTargetCostBudgetFormNext: data => {
    return post('/costMeasureCalculate/update/next', data, { timeout: 60000 })
  },
  //获取合同目标成本测算列表
  getContractTargetCostBudgetList: data => {
    return post('/costMeasureCalculate/list', data)
  },
  /**
   任务名称：TASK#2829 3月9日注释
   开发人员：崔洛宜
   日期：2020-04-03
   任务类型：添加api接口
   **/
  //合同清单计量分解树结构
  /*getTreeData: data => {
    return get(`/costMeasureCalculate/meteringUnitDivision/${data}/tree`, {})
  },*/
  getTreeData: data => {
    return post(`/costMeteringUnitDivision/newTree`, { ...data, projectId })
  },
  //合同成本新建计量划分树
  /*getAddTreeData: data => {
    return post('/costMeteringUnitDivision/tree', data)
  },*/
  getAddTreeData: data => {
    return post('/costMeteringUnitDivision/newTree', { ...data, projectId })
  },
  /**
   任务名称：TASK#2831 3月11号注释
   开发人员：崔洛宜
   日期：2020-03-11
   任务类型：注释(修改根据树id获取右侧列表接口)(1)
   **/
  getListData: data => {
    return post('/costMeteringUnitDivision/inventoryList', { ...data, projectId })
  },
  /* getListData: data => {
    return post('/costMeteringUnitDivision/childInventory', { ...data, projectId })
  },*/
  /*getTabList: data => {
    return post('/quota/childInfo', { ...data, module: 'measure_calculate' })
  },*/
  getTabList: data => {
    return post('/quota/calculate/list', data)
  },
  addGlj: data => {
    return post('/quota/calculate/add', data)
  },
  deleteGLJById: data => {
    return get(`/quota/calculate/delete/${data}`, '')
  },
  updateGlj: data => {
    return post('/quota/calculate/update', data)
  },
  //添加测算(审核)
  addContractTargetCostBudget: data => {
    return get(`/costMeasureCalculate/${data}/submitAudit`, '')
  },
  //获取测算
  getContractTargetCostBudgetDetail: data => {
    return get(`/costMeasureCalculate/get/${data}`, '')
  },
  deleteContractTargetCostBudgetById: data => {
    return get(`/costMeasureCalculate/delete/${data}`, '')
  },
  //审核
  handleCheck: data => {
    return get(`/costMeasureCalculate/delete/${data}`, '')
  },
  //查询测算下的项目经费明细(无costID)
  getNewCostExpenditureDetailByCalculateId: () => {
    return get(`/costExpenditureRecord/recentCalculate/${projectId}`, {})
  },
  //编辑是查询测算下的项目经费明细(有costID)
  getCostExpenditureDetailByCalculateId: calculateId => {
    return get(`/costExpenditureRecord/calculate/list/${calculateId}`, {})
  },
  //保存
  saveCostExpenditureCalculate: data => {
    return post(`/costExpenditureRecord/saveCalculateExpenditure`, data, { timeout: 30000 })
  },
  //审核
  submitCostExpenditureCalculate: data => {
    return post(`/costMeasureCalculate/{id}/submitAudit`, { ...data, projectId }, { timeout: 30000 })
  }
}
