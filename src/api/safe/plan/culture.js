import axios from '@/utils/axios'
/*
 * @任务编号:2824 || 接口对接
 * @开发人员:张龙
 * @日期:2020-03-07
 * @任务类型: 修改代码
 */
export default {
  //列表
  list: param =>
    axios.safety.post(`/civilizationTarget/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.safety.post(`/civilizationTarget/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.safety.post(`/civilizationTarget/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.safety.get(`/civilizationTarget/delete/${id}`),

  //详情
  detail: id => axios.safety.get(`/civilizationTarget/get/${id}`),

  //提交审核
  submitAudit: id => axios.safety.get(`/civilizationTarget/toAudit/${id}`),

  //审核通过
  auditPass: id => axios.safety.get(`/civilizationTarget/pass/${id}`),

  //审核驳回
  auditReject: id => axios.safety.get(`/civilizationTarget/reject/${id}`)
}
