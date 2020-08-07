/**
任务名称：施工日志接口对接
开发人员：许雷
日期：2020-06-29
任务类型：1、全新代码
**/
import { construction, getDownload } from '@/utils/axios'
const { post, get } = construction
//const baseURL = '/cs'
// const projectId = localStorage.getItem('projectId')
export default {
  //日志列表
  getLogList: data => {
    return post(`/decorate/diary/list`, data)
  },

  //日志详情
  getLogDetail: id => {
    return get(`/decorate/diary/get/${id}`)
  },
  //  日志添加
  getLogAdd: data => {
    return post(`/decorate/diary/add`, data)
  },
  //  日志添加
  getLogUpdate: data => {
    return post(`/dailydiary/update`, data)
  },
  //日志详情
  getLogDelete: id => {
    return get(`/dailydiary/delete/${id}`)
  }
}
