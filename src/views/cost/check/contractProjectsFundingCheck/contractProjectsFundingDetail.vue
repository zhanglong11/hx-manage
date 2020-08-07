<!--
@bug名称: 1236/界面开始加载的时候，树表格内容比较长，右侧没有滚动栏
@开发人员: 董渊海
@修改日期: 2020-03-20
@任务类型: 修改代码，树表格添加auto-resize属性，修改比例(1%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: d0418ae2f5e7ab1a5488ee930102f9d76857a2e0
@代码提交修改日期: 2020-03-10
@任务类型: 修改代码，合同项目经费核算审核 对接 审核列表页接口、新增审核页和详情页
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
    <div class="detail-a">
      <!-- 流程图 start -->
      <ViewFlow :id="id" />
      <!-- 流程图 end -->
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
        <vxe-table-column field="code" title="项目编号"></vxe-table-column>
        <vxe-table-column field="name" title="项目名称"></vxe-table-column>
        <vxe-table-column field="unit" title="单位"></vxe-table-column>
        <vxe-table-column field="money" title="测算金额(元)"></vxe-table-column>
        <vxe-table-column field="fullMoney" title="本期实际金额(元)"></vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
      </vxe-table>
    </div>

    <!--    <div class="audit-a">-->
    <!--      <div class="audit-a-head">审核结果</div>-->
    <!--      <div class="audit-a-des">-->
    <!--        <div>-->
    <!--          <div>-->
    <!--            <span>审核结果</span>-->
    <!--            <span v-if="data.status === 2">已通过</span>-->
    <!--            <span v-else-if="data.status === 3">已驳回</span>-->
    <!--          </div>-->
    <!--          <div>-->
    <!--            <span>审核意见</span>-->
    <!--            <span>{{ data.auditOpinion }}</span>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <div style="display: flex;">-->
    <!--          <div style="padding-right: 10px; color: #c1c1c1;">文件列表</div>-->
    <!--          <div style="margin-top: -6px;">-->
    <!--            <FileList :ids="data.auditFileId" />-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="detail-c">-->
    <!--      <el-button @click="handleBack">返回</el-button>-->
    <!--    </div>-->

    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="handleBack">返回</el-button>
      <template v-else>
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import Api from '@/api/cost/contractProjectsFunding'
import projectFundList from '@/lib/projectFundList'
import _ from 'lodash'
export default {
  name: 'CheckContractProjectsFundingDetail',
  data() {
    return {
      tableData: [],
      data: {},
      status: ''
    }
  },
  created() {
    let { id, isCheck, isEdit } = this.$route.params
    this.isCheck = isCheck
    this.isEdit = isEdit
    this.id = id
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
          node.fullMoney = data[i].accountingMoney
          node.remark = data[i].accountingRemark
          node.money = data[i].calculateMoney
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
      this.$router.push({ name: 'ContractProjectsFundingCheck' })
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less"></style>
