<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 447710e0305f6dd30666fa9c22b8341444c664a4
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，完成 租赁计划 审核列表接口对接，审核和详情接口对接，审核和详情页样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: dc31821aaea172ad4d3f0b9ce3764ac7212999d5
@代码提交修改日期: 2020-03-07
@任务类型: 修改代码，租赁计划需求变动 去掉开始时间组件、结束时间组件
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="detail-a">
      <div class="detail-a-head">
        <div>审核{{ data.name }}详情</div>
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
          <!--<div>
            <span>开始时间</span>
            <span>{{ data.startTime }}</span>
          </div>
          <div>
            <span>结束时间</span>
            <span>{{ data.endTime }}</span>
          </div>-->
          <div>
            <span>创建人</span>
            <span>{{ data.creatorName }}</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{ data.createTime }}</span>
          </div>
        </div>
        <div>
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
      <div class="detail-b-head">租赁明细</div>
      <div class="detail-b-table">
        <vxe-table ref="xTable" border resizable show-overflow :data="data.list">
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
          <vxe-table-column field="materialName" title="名称"></vxe-table-column>
          <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="materialAmount" title="租赁数量"></vxe-table-column>
          <vxe-table-column field="enterTime" title="计划进场时间"></vxe-table-column>
          <vxe-table-column field="exitTime" title="计划退场时间"></vxe-table-column>
          <vxe-table-column field="leaseDay" title="租赁天数"></vxe-table-column>
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
import Api from '@/api/device/goodsPlan/leasePlan'
export default {
  name: 'AuditLeasePlanDetail',
  data() {
    return {
      data: {}
    }
  },
  mounted() {
    let id = this.$route.params.id ? this.$route.params.id : ''
    if (id) {
      Api.getLeasePlanDetail(id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
          for (let i = 0; i < this.data.list.length; i++) {
            this.data.list[i].leaseDay = this.getLeaseDay(this.data.list[i].enterTime, this.data.list[i].exitTime)
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
    handleBack() {
      this.$router.push({ name: 'LeasePlanAudit' })
    }
  }
}
</script>

<style scoped lang="less"></style>
