/**
 任务名称：TASK#2848 【智慧工地2.0-前端】资料管理》项目资料》列表、新增、编辑、详情切图及功能开发
 开发人员：崔洛宜
 日期：2020-04-01
 任务类型：接口文件
 **/
import axios from '@/utils/axios'
const projectId = localStorage.getItem('projectId')
//const baseURL = '/cs'
export default {
  // 获取集团资料列表
  getTableList: data => {
    return axios.construction.post(`/buildInfo/queryList`, data)
  },
  //添加集团资料
  addData: data => {
    return axios.construction.post(`/buildInfo/save`, { ...data, projectId })
  },
  //更新集团资料
  updateData: data => {
    return axios.construction.post(`/buildInfo/update`, data)
  },
  //获取集团资料详情
  getDataDetail: id => {
    return axios.construction.get(`/buildInfo/detail/${id}`, {})
  },
  deleteData: id => {
    return axios.construction.get(`/buildInfo/delete/${id}`, {})
  },
  getProjectList: data => {
    return axios.post(`/cim6d/system/project/list`, data)
  }
}
