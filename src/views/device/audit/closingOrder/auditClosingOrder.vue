<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 707075396d45ffaf3e980f32348af96fed37f273
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资租赁结算单 删除接口对接，审核列表接口对接，审核提交接口对接，添加审核详情页，审核页和详情页样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <!--流程图-->
    <ViewFlow :id="$route.params.id" />
    <!--流程图-->
    <div class="detail-a">
      <div class="detail-a-head">
        <div>审核{{ data.rentSettlementBillCode }}</div>
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

    <div class="audit-a">
      <!--<div class="audit-a-head">审核结果</div>
      <el-form ref="form" class="audit-a-form" :model="form" :rules="formRules" label-positon="left" label-width="96px">
        <div style="display: flex;">
          <div style="flex: 1">
            <el-form-item label="审核结果" prop="auditStatus">
              <el-radio-group v-model="form.auditStatus">
                <el-radio :label="2">已通过</el-radio>
                <el-radio :label="3">已驳回</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核意见" prop="auditOpinion">
              <el-input v-model="form.auditOpinion" type="textarea" :rows="2" placeholder="请输入审核意见"></el-input>
            </el-form-item>
          </div>
          <div style="flex: 1">
            <el-form-item label="文件上传">
              <FileUpload @input="setFileId" />
            </el-form-item>
          </div>
        </div>
      </el-form>-->
      <CheckCard :id="$route.params.id" ref="checkCard" :isAdd="isCheck" @emit="handleEmitForm"></CheckCard>
    </div>

    <div class="detail-c">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/device/settleAccounts/closingOrder'
export default {
  name: 'AuditClosingOrder',
  data() {
    return {
      data: {
        list: []
      },
      form: {
        auditStatus: '',
        auditOpinion: '',
        auditFileId: null
      },
      formRules: {
        auditStatus: [{ required: true, message: '请选择审核结果' }]
      }
    }
  },
  mounted() {
    let id = this.$route.params.id ? this.$route.params.id : ''
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
    handleCancel() {
      this.$router.push({ name: 'ClosingOrderAudit' })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.data.status = this.form.auditStatus
          this.data.auditOpinion = this.form.auditOpinion
          this.data.auditFileId = this.form.auditFileId
          Api.editClosingOrder(this.data).then(res => {
            this.$message.success('提交成功')
            this.$router.push({ name: 'ClosingOrderAudit' })
          })
        }
      })
    },
    setFileId(fileIds) {
      //console.log(fileIds)
      this.form.auditFileId = fileIds.join(',') ? fileIds.join(',') : null
    }
  }
}
</script>

<style scoped lang="less"></style>
