import { construction } from '@/utils/axios'
const { post, get } = construction
//const baseURL = '/cs'
const projectId = localStorage.getItem('projectId')
export default {
  /**
   任务名称：TASK#2827 3月6号注释
   开发人员：崔洛宜
   日期：2020-03-31
   任务类型：注释(添加接口)
   **/
  //添加合同预算
  addCostBudgetForm: data => {
    return post('/costBudget/add', data)
  },
  //添加合同预算下一步
  addCostBudgetFormNext: data => {
    return post('/costBudget/add/next', data, { timeout: 60000 })
  },
  /**
   任务名称：TASK#2831 3月11号注释
   开发人员：崔洛宜
   日期：2020-03-11
   任务类型：注释(添加更新和更新下一步接口)(8)
   **/
  //更新合同预算
  updateCostBudgetForm: data => {
    return post('/costBudget/update', data)
  },
  //更新合同预算下一步
  updateCostBudgetFormNext: data => {
    return post('/costBudget/update/next', data, { timeout: 60000 })
  },
  //获取合同预算列表
  getContractBudgetList: data => {
    return post('/costBudget/list', data)
  },
  //合同清单计量分解树结构
  /*getTreeData: data => {
    return get(`/costBudget/meteringUnitDivision/${data}/tree`, {})
  },*/
  //合同清单计量分解树结构
  getTreeData: data => {
    return post(`/costMeteringUnitDivision/newTree`, { ...data, projectId })
  },

  /**
   任务名称：TASK#2828 3月7号注释
   开发人员：崔洛宜
   日期：2020-03-31
   任务类型：注释(添加接口)
   **/
  //合同成本新建计量划分树
  getAddTreeData: data => {
    return post('/costMeteringUnitDivision/newTree', { ...data, projectId })
  },
  /**
   任务名称：TASK#2829 3月9日注释
   开发人员：崔洛宜
   日期：2020-04-03
   任务类型：注释(添加api接口)
   **/
  /**
   任务名称：TASK#2830 3月10日注释
   开发人员：崔洛宜
   日期：2020-03-10
   任务类型：注释(修改api接口)(2)
   **/
  getListData: data => {
    return post('/costMeteringUnitDivision/inventoryList', { ...data, projectId })
  },
  /*getListData: data => {
    return post('/costMeteringUnitDivision/childInventory', { ...data, projectId })
  },*/
  /**
   任务名称：TASK#2831 3月11号注释
   开发人员：崔洛宜
   日期：2020-03-11
   任务类型：注释(添加获取tab列表接口,和更删改查接口)(12)
   **/
  getTabList: data => {
    return post('/quota/budget/list', data)
  },
  /* getTabList: data => {
    return post('/quota/childInfo', { ...data, module: 'budget' })
  },*/
  addGlj: data => {
    return post('/quota/budget/add', data)
  },
  deleteGLJById: data => {
    return get(`/quota/budget/delete/${data}`, '')
  },
  updateGlj: data => {
    return post('/quota/budget/update', data)
  },
  //添加合同预算
  addCostBudget: data => {
    return get(`/costBudget/${data}/submitAudit`, '')
  },
  //获取预算详情
  getCostBudgetDetail: data => {
    return get(`/costBudget/get/${data}`, '')
  },
  deleteCostBudgetById: data => {
    return get(`/costBudget/delete/${data}`, '')
  },
  //审核
  handleCheck: data => {
    return get(`/costBudget/delete/${data}`, '')
  }
}
