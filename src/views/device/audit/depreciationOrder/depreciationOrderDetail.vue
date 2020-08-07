<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 27219c8d737cc106b7914b5ea5ee60c04acc8d4e
@代码提交修改日期: 2020-03-12
@任务类型: 修改代码，物资折旧单审核 列表接口对接，审核接口对接，添加审核详情页，审核页和详情页样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="detail-a">
      <div class="detail-a-head">
        <div>审核{{ data.depreciationBillCode }}详情</div>
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
            <span>折旧物资编号</span>
            <span>{{ data.materialCode }}</span>
          </div>
          <div>
            <span>折旧物资名称</span>
            <span>{{ data.materialName }}</span>
          </div>
          <div>
            <span>规格型号</span>
            <span>{{ data.specification }}</span>
          </div>
          <div>
            <span>计量单位</span>
            <span>{{ data.calculateUnit }}</span>
          </div>
          <div>
            <span>折旧年度</span>
            <span>{{ data.depreciationYear }}</span>
          </div>
          <div>
            <span>折旧月份</span>
            <span>{{ data.depreciationMonth }}</span>
          </div>
          <div>
            <span>年折旧率</span>
            <span>{{ data.yearlyDepreciation }}</span>
          </div>
          <div>
            <span>月折旧额</span>
            <span>{{ data.monthDepreciation }}</span>
          </div>
          <div>
            <span>折旧方式</span>
            <span v-if="data.depreciationWay === 1">年限法</span>
            <span v-else-if="data.depreciationWay === 2">工作量法</span>
          </div>
          <div>
            <span>累计折旧金额(元)</span>
            <span>{{ data.depreciationAmount }}</span>
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
        <div></div>
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
import Api from '@/api/device/settleAccounts/depreciationOrder'
export default {
  name: 'AuditDepreciationOrderDetail',
  data() {
    return {
      data: {}
    }
  },
  mounted() {
    let id = this.$route.params.id ? this.$route.params.id : ''
    if (id) {
      Api.getDepreciationOrderDetailById(id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
        }
      })
    }
  },
  methods: {
    handleBack() {
      this.$router.push({ name: 'DepreciationOrderAudit' })
    }
  }
}
</script>

<style scoped lang="less"></style>
