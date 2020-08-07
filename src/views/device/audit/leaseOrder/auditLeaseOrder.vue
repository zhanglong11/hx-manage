<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 4b6e0a7a78e648002728a2bb72f5dbaadb06f6d8
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，完成 租赁单 审核列表接口对接，审核和详情接口对接，审核和详情页样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 901c4352adfa5e8f697bbdb5d6ba5894fe4838eb
@代码提交修改日期: 2020-03-07
@任务类型: 修改代码，租赁单需求变动 去掉租赁单金额、合价、合计，添加实际开始时间和实际结束时间(接口未对接)
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: edaef18d4be0b375e110fd81486e140300f62f44
@代码提交修改日期: 2020-03-09
@任务类型: 修改代码，租赁单和租赁单审核模块，对接实际开始时间字段和实际结束时间字段
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <ViewFlow :id="$route.params.id" />
    <div class="detail-a">
      <div class="detail-a-head">
        <div>审核{{ data.dispatchCode }}</div>
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
            <span>租赁计划</span>
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
      <div class="detail-b-head">租赁明细</div>
      <div class="detail-b-table">
        <vxe-table ref="xTable" border resizable show-overflow keep-source :data="data.list">
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
          <vxe-table-column field="materialName" title="名称"></vxe-table-column>
          <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="dispatchAmount" title="租赁数量"></vxe-table-column>
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
          <vxe-table-column field="startTime" title="实际开始时间"></vxe-table-column>
          <vxe-table-column field="endTime" title="实际结束时间"></vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
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
import Api from '@/api/device/goodsPlan/leaseOrder'
export default {
  name: 'AuditLeaseOrder',
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
      Api.getLeaseOrderDetail(id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
        }
      })
    }
  },
  methods: {
    handleCancel() {
      this.$router.push({ name: 'LeaseOrderAudit' })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.data.status = this.form.auditStatus
          this.data.auditOpinion = this.form.auditOpinion
          this.data.auditFileId = this.form.auditFileId
          Api.editLeaseOrder(this.data).then(res => {
            this.$message.success('提交成功')
            this.$router.push({ name: 'LeaseOrderAudit' })
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
