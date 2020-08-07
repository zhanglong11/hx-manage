<!--
@bug名称: 1236/界面开始加载的时候，树表格内容比较长，右侧没有滚动栏
@开发人员: 董渊海
@修改日期: 2020-03-20
@任务类型: 修改代码，树表格添加auto-resize属性，修改比例(1%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 9be3e5c65eebd73fa421dd7692c70588a8ed0e99
@代码提交修改日期: 2020-03-09
@任务类型: 修改代码，合同项目经费核算 对接 项目经费核算列表接口，查询核算下的项目经费明细接口，项目经费明细新增(编辑)接口，添加项目经费核算明细详情页
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: b65fe7ac4a5ae22a6bbb5b31ac646558ce4ee2b7
@代码提交修改日期: 2020-03-10
@任务类型: 修改代码，合同项目经费核算 对接 项目经费核算编辑接口，删除接口，提交审核接口
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: d45705ffa3957e93557422bc2fb6adc1cccfbc24
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，合同项目经费核算 添加根据id查询合同项目经费核算详情接口，合同项目经费核算状态回显处理
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <!-- 流程图 start -->
    <ViewFlow :id="$route.params.id" />
    <!-- 流程图 end -->
    <div class="detail-a">
      <div style="text-align: right; padding-bottom: 16px;">
        <span style="color: #999999;">项目经费核算状态：</span>
        <span style="color: #333333;">
          <span v-if="status === 0">草稿</span>
          <span v-else-if="status === 1">待审核</span>
          <span v-else-if="status === 2">已通过</span>
          <span v-else-if="status === 3">已驳回</span>
        </span>
      </div>
      <vxe-table
        ref="xTable"
        border
        resizable
        show-overflow
        :data="tableData"
        :tree-config="{ children: 'children', expandAll: true }"
        auto-resize
      >
        <vxe-table-column type="seq" tree-node title="序号"></vxe-table-column>
        <!--<vxe-table-column field="code" title="项目编号"></vxe-table-column>-->
        <vxe-table-column field="name" title="项目名称"></vxe-table-column>
        <vxe-table-column field="unit" title="单位"></vxe-table-column>
        <vxe-table-column field="money" title="测算金额(元)"></vxe-table-column>
        <vxe-table-column field="fullMoney" title="本期实际金额(元)"></vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
      </vxe-table>
    </div>

    <!--<div>审核结果</div>-->

    <div class="detail-c">
      <el-button @click="handleBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/cost/contractProjectsFunding'
import projectFundList from '@/lib/projectFundList'
import _ from 'lodash'
export default {
  name: 'FundListDetail',
  data() {
    return {
      tableData: [],
      status: ''
    }
  },
  mounted() {
    let id = this.$route.params.id
    //根据核算记录id查询核算记录详情，并获取状态值
    Api.getCostExpenditureById(id).then(res => {
      this.status = res.data.status
    })

    this.tableData = _.cloneDeep(projectFundList)

    //预算项目明细信息回显
    Api.getExpenditureDetailByExpenditureId(id).then(res => {
      //console.log(res)
      let data = res.data
      if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
          let node = this.getNodeInfo(data[i].itemCode, this.tableData)
          node.fullMoney = data[i].currentMoney
          node.remark = data[i].currentRemark
          node.money = data[i].lastMoney
        }
      }
    })
  },
  methods: {
    getNodeInfo(code, data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].code === code) {
          return data[i]
        }
        if (data[i].children && data[i].children.length) {
          let result = this.getNodeInfo(code, data[i].children)
          if (result) {
            return result
          }
        }
      }
    },
    handleBack() {
      this.$router.push({ name: 'ContractProjectsFunding' })
    }
  }
}
</script>

<style scoped lang="less"></style>
