/**
 任务名称：2868/修改bug
 开发人员：李建敏
 日期：2020-3月-7日
 任务类型：1.全新代码
 **/
const options = [
  {
    label: '草稿',
    value: 0
  },
  {
    label: '待审核',
    value: 1
  },
  {
    label: '已通过',
    value: 2
  },

  /**
bug名称：bug#1209,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220
开发人员：李建敏
日期：2020-3月-23日
任务类型：2、修改代码（1行）
**/

  {
    label: '已驳回',
    value: 3
  }
]
options.getLabel = function (val) {
  return _.get(_.find(options, { value: val }), 'label', '未知')
}
export default options
