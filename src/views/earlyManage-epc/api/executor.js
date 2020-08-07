import { construction, file } from '@/utils/axios'
export default {
  //列表
  list: (param = {}) =>
    construction.post(`/pre/task/parent/list`, {
      projectId: localStorage.getItem('projectId'),
      type: 1,
      ...param
    }),

  //添加
  addFile: param =>
    construction.post(`/pre/task/parent/add`, {
      projectId: localStorage.getItem('projectId'),
      type: 1,
      ...param
    }),

  //更新
  updateFile: param =>
    construction.post(`/pre/task/parent/update`, {
      projectId: localStorage.getItem('projectId'),
      type: 1,
      ...param
    }),

  //提交
  submitFile: param =>
    construction.post(`/pre/task/parent/submit`, {
      projectId: localStorage.getItem('projectId'),
      type: 1,
      ...param
    }),

  //删除
  delFile: id => construction.get(`/pre/task/delete/${id}`),

  //下载
  downloadFile: param => file.post(`/file/commonFile/tarDownload`, param, { responseType: 'blob' }),

  //详情
  detailFile: id => construction.get(`/pre/task/parent/get/${id}`),

  //列表
  taskList: (id, param = {}) => construction.post(`/pre/task/child/list/${id}`, param),

  //添加
  addTask: param =>
    construction.post(`/pre/task/child/add`, {
      projectId: localStorage.getItem('projectId'),
      type: 1,
      ...param
    }),

  //开始
  startTask: id => construction.get(`/pre/task/start/${id}`),

  //更新
  updateTask: param =>
    construction.post(`/pre/task/child/update`, {
      projectId: localStorage.getItem('projectId'),
      type: 1,
      ...param
    }),

  //详情
  detailTask: id => construction.get(`/pre/task/child/get/${id}`),

  //填报进度
  saveDetailTask: param =>
    construction.post(`/pre/task/fill/save`, {
      projectId: localStorage.getItem('projectId'),
      type: 1,
      ...param
    }),

  //提交进度
  submitDetailTask: param =>
    construction.post(`/pre/task/fill/submit`, {
      projectId: localStorage.getItem('projectId'),
      type: 1,
      ...param
    }),

  //审核通过
  auditPass: param =>
    construction.post(`/pre/task/auditPass`, {
      projectId: localStorage.getItem('projectId'),
      type: 1,
      ...param
    }),

  //审核驳回
  auditReject: param =>
    construction.post(`/pre/task/auditReject`, {
      projectId: localStorage.getItem('projectId'),
      type: 1,
      ...param
    })
}
