import http from '@/utils/axios'
export default {
  //质量问题
  getQualityChartNew: () => http.safety.get(`/synergy/quality/acceptance/count/${localStorage.getItem('projectId')}`),
  //安全问题
  checkCount: data =>
    http.safety.post(`/synergy/inspect/task/checkCount`, {
      projectId: localStorage.getItem('projectId'),
      ...data
    }),
  //质量验收
  count: () => http.safety.get(`/synergy/quality/acceptance/count/${localStorage.getItem('projectId')}`)
}
