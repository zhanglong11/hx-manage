<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: fef55799e90dea322262ec2021f2b092e737ad25
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，完成 采购单 审核列表接口对接，审核和详情接口对接，审核和详情页样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="detail-a">
      <div class="detail-a-head">
        <div>审核{{ data.dispatchCode }}详情</div>
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
            <span>需用计划</span>
            <span>{{ data.planCode }}</span>
          </div>
          <div>
            <span>供应商名称</span>
            <span>{{ data.supplierName }}</span>
          </div>
          <div>
            <span>合同编号</span>
            <span>{{ data.contractCode }}</span>
          </div>
          <div>
            <span>采购单金额(元)</span>
            <span>{{ data.purchaseAmount }}</span>
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
      <div class="detail-b-head">采购明细</div>
      <div class="detail-b-table">
        <vxe-table
          ref="xTable"
          border
          resizable
          show-overflow
          keep-source
          :data="data.list"
          show-footer
          :footer-method="footerMethod"
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
          <vxe-table-column field="materialName" title="名称"></vxe-table-column>
          <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="dispatchAmount" title="采购数量"></vxe-table-column>
          <vxe-table-column field="unitPrice" title="合同单价(元)"></vxe-table-column>
          <vxe-table-column field="totalPrice" title="合价"></vxe-table-column>
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
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
        </vxe-table>
      </div>
    </div>

    <div class="audit-a">
      <div class="audit-a-head">审核结果</div>
      <div class="audit-a-des">
        <div>
          <div>
            <span>审核结果</span>
            <span v-if="data.status === 2">已通过</span>
            <span v-else-if="data.status === 3">已驳回</span>
          </div>
          <div>
            <span>审核意见</span>
            <span>{{ data.auditOpinion }}</span>
          </div>
        </div>
        <div style="display: flex;">
          <div style="padding-right: 10px; color: #c1c1c1;">文件列表</div>
          <div style="margin-top: -6px;">
            <FileList :ids="data.auditFileId" />
          </div>
        </div>
      </div>
    </div>

    <div class="detail-c">
      <el-button @click="handleBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/device/goodsPlan/purchaseOrder'
export default {
  name: 'AuditPurchaseOrderDetail',
  data() {
    return {
      data: {
        list: []
      }
    }
  },
  mounted() {
    let id = this.$route.params.id ? this.$route.params.id : ''
    if (id) {
      Api.getPurchaseOrderDetail(id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
        }
      })
    }
  },
  methods: {
    footerMethod({ columns, data }) {
      let result = [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['totalPrice'].includes(column.property)) {
            return this.XEUtils.sum(data, column.property)
          }
          return null
        })
      ]
      return result
    },
    handleBack() {
      this.$router.push({ name: 'PurchaseOrderAudit' })
    }
  }
}
</script>

<style scoped lang="less"></style>
