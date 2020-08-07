/**
  任务名称：task#2854 【智慧工地2.0-前端】工作台切图及功能开发
  开发人员：耿为刚
  日期：2020-04-01
  描述：新增全局枚举
**/
import workBenchEnumeration from '@/views/work-bench/enumeration' // 工作台枚举
import processProgressEnumeration from '@/views/process-progress/enumeration' // 工序进度枚举
export default {
  ...workBenchEnumeration,
  ...processProgressEnumeration
}
