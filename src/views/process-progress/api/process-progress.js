/**
  任务名称：task#2867 【智慧工地2.0-前端】工序进度模块功能开发
  开发人员：耿为刚
  日期：2020-04-02
  任务类型：全新代码
**/

import http from '@/utils/axios'
export const processProgressApi = {
  // 工序模板查询
  queryTemplateListWorking: data => {
    return http.working({
      url: 'working/procedure/template/list',
      method: 'post',
      data
    })
  },
  // 添加工序模板
  addTemplateWorking: data => {
    return http.working({
      url: 'working/procedure/template/add',
      method: 'post',
      data
    })
  },
  // 工序工序模板
  updateTemplateWorking: data => {
    return http.working({
      url: 'working/procedure/template/update',
      method: 'post',
      data
    })
  },
  // 删除工序模板
  deleteTemplateWorking: id => {
    return http.working({
      url: `working/procedure/template/delete/${id}`,
      method: 'get'
    })
  },
  // 工序模板详情
  getDetailsTemplateWorking: id => {
    return http.working({
      url: `working/procedure/template/get/${id}`,
      method: 'get'
    })
  },
  // 工序模板-交换顺序（将当前记录与目标记录交换顺序）
  swapTemplateWorking: (sourceId, targetId) => {
    return http.working({
      url: `working/procedure/template/swap/${sourceId}/${targetId}`,
      method: 'get'
    })
  },
  // 工序列表
  queryListWorking: data => {
    return http.working({
      url: 'working/procedure/list',
      method: 'post',
      data
    })
  },
  // 添加工序
  addWorking: data => {
    return http.working({
      url: 'working/procedure/add',
      method: 'post',
      data
    })
  },
  // 更新工序
  updateWorking: data => {
    return http.working({
      url: 'working/procedure/update',
      method: 'post',
      data
    })
  },
  // 工序详情
  getDetailsWorking: id => {
    return http.working({
      url: `working/procedure/get/${id}`,
      method: 'get'
    })
  },
  // 工序-交换顺序（将当前记录与目标记录交换顺序）
  swapWorking: (sourceId, targetId) => {
    return http.working({
      url: `working/procedure/swap/${sourceId}/${targetId}`,
      method: 'get'
    })
  },
  // 删除工序
  deleteWorking: id => {
    return http.working({
      url: `working/procedure/delete/${id}`,
      method: 'get'
    })
  },
  // 获取工序配置列表
  queryConfigListWorking: data => {
    return http.working({
      url: 'working/procedure/config/list',
      method: 'post',
      data
    })
  },
  // 添加工序配置
  addConfigWorking: data => {
    return http.working({
      url: 'working/procedure/config/add',
      method: 'post',
      data
    })
  },
  // 更新工序配置
  updateConfigWorking: data => {
    return http.working({
      url: 'working/procedure/config/update',
      method: 'post',
      data
    })
  },
  // 获取工序配置详情
  getDetailsConfigWorking: id => {
    return http.working({
      url: `working/procedure/config/get/${id}`,
      method: 'get'
    })
  },
  // 保存工序配置下所有工序明细
  saveDetailConfigWorking: (configId, data) => {
    return http.working({
      url: `working/procedure/config/detail/save/${configId}`,
      method: 'post',
      data
    })
  },
  // 查看工序配置下所有工序明细
  getDetailsConfigListWorking: id => {
    return http.working({
      url: `working/procedure/config/detail/list/${id}`,
      method: 'get'
    })
  },
  // 删除工序配置
  deleteConfigWorking: id => {
    return http.working({
      url: `working/procedure/config/delete/${id}`,
      method: 'get'
    })
  },
  // 关联楼层
  bindFloor: data => {
    return http.working({
      url: '/working/procedure/config/floor/bind',
      method: 'post',
      data
    })
  },
  // 获取bim数据
  queryBimTree: projectId => {
    return http({
      url: `/project/bim/tree/active/${projectId}`,
      method: 'post'
    })
  },
  // 获取bim楼层数据
  getBimResource: bimResourceId => {
    return http.gis({
      url: `/noToken/old/basic/commonFile/get/fdht/bim_${bimResourceId}/space.json`,
      method: 'get'
    })
  },
  // 工序配置下楼层绑定关系
  queryFloorBindList: configId => {
    return http.working({
      url: `/working/procedure/config/floor/bind/list/${configId}`,
      method: 'get'
    })
  }
}
