<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: ae534b410c148fda9e347871bf82ada349aaf3ea
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资租赁结算单 编辑接口对接，结算单列表接口对接，详情接口对接，并重新调整租赁结算单详情页样式
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 707075396d45ffaf3e980f32348af96fed37f273
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资租赁结算单 删除接口对接，审核列表接口对接，审核提交接口对接，添加审核详情页，审核页和详情页样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: aa271a58ba0d70ae4dd055a7770cd976e170e3e4
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资租赁结算单 编辑时，结算明细id处理为租赁明细id；发起人查看详情页时，添加审核结果模块
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="detail-a">
      <div class="detail-a-head">
        <div>{{ data.rentSettlementBillCode }}详情</div>
      </div>
      <div class="detail-a-status">
        <span>状态</span><br />
        <span v-if="data.status === 0">草稿</span>
        <span v-if="data.status === 1">待审核</span>
        <span v-if="data.status === 2">已通过</span>
        <span v-if="data.status === 3">已驳回</span>
      </div>
      <div class="detail-a-des">
        <div>
          <div>
            <span>租赁单编号</span>
            <span>{{ data.rentBillCode }}</span>
          </div>
          <div>
            <span>合同编号</span>
            <span>{{ data.contractCode }}</span>
          </div>
          <div>
            <span>结算金额(元)</span>
            <span>{{ data.settlementAmount }}</span>
          </div>
        </div>
        <div>
          <div>
            <span>创建人</span>
            <span>{{ data.creatorName }}</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{ data.createTime }}</span>
          </div>
          <div class="accessory">
            <div>附件</div>
            <div>
              <FileList :ids="data.fileId" />
            </div>
          </div>
          <div class="remark">
            <span>备注</span>
            <span>{{ data.remark }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-b">
      <div class="detail-b-head">结算明细</div>
      <div class="detail-b-table">
        <vxe-table
          ref="xTable"
          border
          resizable
          show-overflow
          :data="data.list"
          show-footer
          :footer-method="footerMethod"
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
          <vxe-table-column field="materialName" title="名称"></vxe-table-column>
          <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="rentAmount" title="数量"></vxe-table-column>
          <vxe-table-column field="startTime" title="结算开始时间" width="204"></vxe-table-column>
          <vxe-table-column field="endTime" title="结算结束时间" width="204"></vxe-table-column>
          <vxe-table-column field="days" title="结算天数"></vxe-table-column>
          <vxe-table-column field="unitPrice" title="合同单价(元)"></vxe-table-column>
          <vxe-table-column field="materialType" title="类别">
            <template v-slot="{ row }">
              <span v-if="row.materialType === 1">材料</span>
              <span v-else-if="row.materialType === 2">机械</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="materialKind" title="物资种类">
            <template v-slot="{ row }">
              <span v-if="row.materialKind === 1">耗材</span>
              <span v-else-if="row.materialKind === 2">周材</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="currentSettledAmount" title="结算金额(元)" width="80"></vxe-table-column>
        </vxe-table>
      </div>
    </div>

    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="$router.go(-1)">返回</el-button>
      <template v-else>
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import Api from '@/api/device/settleAccounts/closingOrder'
export default {
  name: 'ClosingOrderDetail',
  data() {
    return {
      data: {
        list: []
      }
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
    if (id) {
      Api.getClosingOrderDetailById(id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
          for (let i = 0; i < this.data.list.length; i++) {
            this.data.list[i].days = this.getLeaseDay(this.data.list[i].startTime, this.data.list[i].endTime)
          }
        }
      })
    }
  },
  methods: {
    getLeaseDay(s, e) {
      let st = new Date(s).getTime()
      let et = new Date(e).getTime()

      let val = Math.abs(st - et)
      let days = Math.floor(val / (24 * 3600 * 1000))
      return days
    },
    footerMethod({ columns, data }) {
      let result = [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['currentSettledAmount'].includes(column.property)) {
            return this.XEUtils.sum(data, column.property)
          }
          return null
        })
      ]
      return result
    },
    handleEdit() {
      this.$router.push({ name: 'ClosingOrderEdit', params: { id: this.data.id } })
    },
    handleBack() {
      this.$router.push({ name: 'ClosingOrder' })
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less"></style>
