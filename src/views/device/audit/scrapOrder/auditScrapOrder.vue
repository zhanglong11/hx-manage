<!--
@任务名称: 2623/物资报废处理单遗留问题
@开发人员: 董渊海
@创建日期: 2020-03-16
@任务类型: 复制修改代码，添加物资报废处理单审核页和审核接口对接，审核页样式调整，修改比例(20%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: dd2327e494abad7b8fd77c09155d4cfb85dcc14b
@代码提交修改日期: 2020-03-16
@任务类型: 修改代码，物资报废处理单审核 添加审核列表页、审核页、详情页，对接审核列表接口、审核接口、详情接口，审核页和详情页样式调整，发起人查看页添加审核结果模块
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <ViewFlow :id="$route.params.id" />
    <div class="detail-a">
      <div class="detail-a-head">
        <div>审核{{ data.scrapBillCode }}</div>
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
            <span>报废处理日期</span>
            <span>{{ data.scrapTime }}</span>
          </div>
          <div>
            <span>报废处理金额(元)</span>
            <span>{{ data.scrapAmount }}</span>
          </div>
          <div>
            <span>报废原因</span>
            <span>{{ data.scrapReason }}</span>
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
      <div class="detail-b-head">报废物资明细</div>
      <div class="detail-b-table">
        <vxe-table border resizable show-overflow :data="data.list" show-footer :footer-method="footerMethod">
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
          <vxe-table-column field="materialName" title="名称"></vxe-table-column>
          <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="contractAmount" title="合同数量"></vxe-table-column>
          <vxe-table-column field="contractUnitPrice" title="合同单价(元)"></vxe-table-column>
          <vxe-table-column field="contractTotalPrice" title="合价"></vxe-table-column>
          <vxe-table-column field="materialType" title="类别">
            <template v-slot="{ row }">
              <span v-if="row.materialType === 1">材料</span>
              <span v-else-if="row.materialType === 2">机械</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="materialSource" title="物资来源">
            <template v-slot="{ row }">
              <span v-if="row.materialSource === 1">自购</span>
              <span v-else-if="row.materialSource === 2">租赁</span>
              <span v-else-if="row.materialSource === 3">自购+租赁</span>
              <span v-else-if="row.materialSource === 4">甲供</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="materialKind" title="物资种类">
            <template v-slot="{ row }">
              <span v-if="row.materialKind === 1">耗材</span>
              <span v-else-if="row.materialKind === 2">周材</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="currentScrapNum" title="报废处理数量"></vxe-table-column>
          <vxe-table-column field="scrapUnitPrice" title="报废处理单价"></vxe-table-column>
          <vxe-table-column field="currentTotalScrapAmount" title="报废处理合价"></vxe-table-column>
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
import Api from '@/api/device/settleAccounts/scrapOrder'
export default {
  name: 'AuditScrapOrder',
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
      Api.getScrapOrderDetail(id).then(res => {
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
          if (['contractTotalPrice', 'currentTotalScrapAmount'].includes(column.property)) {
            return this.XEUtils.sum(data, column.property)
          }
          return null
        })
      ]
      return result
    },
    handleCancel() {
      this.$router.push({ name: 'ScrapOrderAudit' })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.data.status = this.form.auditStatus
          this.data.auditOpinion = this.form.auditOpinion
          this.data.auditFileId = this.form.auditFileId
          Api.editScrapOrder(this.data).then(res => {
            this.$message.success('提交成功')
            this.$router.push({ name: 'ScrapOrderAudit' })
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
