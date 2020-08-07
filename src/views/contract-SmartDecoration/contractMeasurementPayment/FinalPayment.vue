<template>
  <div class="outerContainer indexWrapper">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>合同计量与支付基本信息</span>
      </div>
      <div>
        <BaseForm
          ref="baseForm"
          :formData="formData"
          @submitSuccess="handleSubmitSuccess"
          @submitError="handleSubmitError"
        ></BaseForm>
      </div>
    </el-card>
    <div class="footerButton">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button type="primary" @click="handleSubmit">保存并提交</el-button>
    </div>
  </div>
</template>
<script>
import BaseForm from './componnets/BaseForm'
import Api from '@/api/contract/contractMeasurementPayment'
export default {
  name: 'FinalPayment',
  components: { BaseForm },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      isSave: true,
      formData: { paymentStage: 3 }
    }
  },
  created() {
    let { id, isEdit } = this.$route.params
    this.isEdit = isEdit
    this.paymentId = id
    if (isEdit) {
      Api.getContractMeasurementPaymentById(id).then(res => {
        if (res.code === 200) {
          this.formData = res.data
          console.log(res.data)
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    }
  },
  methods: {
    handleCancel() {
      this.$router.back()
    },
    handleSave() {
      this.isSave = true
      this.$refs.baseForm.submitForm()
      //await this.handleSubmitSuccess
    },
    handleSubmit() {
      this.isSave = false
      this.$refs.baseForm.submitForm()
    },
    handleSubmitSuccess(data) {
      if (this.isEdit) {
        Api.updateContractMeasurementPaymentById({
          ...data,
          /**
           任务名称：BUG#1417 新建预付款类型的合同付款单，新建完成后，进入编辑页面，只是修改信息后点击“保存”按钮，自动提交，与保存并提交按钮功能一致，请确认
           开发人员：崔洛宜
           日期：2020-03-30
           BUG类型：测试人员发现的研发自测未通过引起的BUG
           **/
          status: this.isSave ? 0 : 1,
          projectId: this.projectId,
          id: this.paymentId
        }).then(res => {
          if (res.code === 200) {
            /**
             任务名称：BUG#1383 合同管理-合同计量与支付-新建预付款-保存-保存成功，没有自动跳转列表页，导致可以重复保存
             开发人员：崔洛宜
             日期：2020-03-30
             BUG类型：测试人员发现的研发自测未通过引起的BUG
             **/
            this.$message.success('保存成功')
            this.$router.back()
            /*if (!this.isSave) {
              this.$router.back()
            }*/
          } else {
            this.$message.error('保存失败')
          }
        })
      } else {
        /**
         任务名称：BUG#1417 新建预付款类型的合同付款单，新建完成后，进入编辑页面，只是修改信息后点击“保存”按钮，自动提交，与保存并提交按钮功能一致，请确认
         开发人员：崔洛宜
         日期：2020-03-30
         BUG类型：测试人员发现的研发自测未通过引起的BUG
         **/
        Api.addPrepayment({ ...data, projectId: this.projectId, status: this.isSave ? 0 : 1 }).then(res => {
          if (res.code === 200) {
            /**
             任务名称：BUG#1383 合同管理-合同计量与支付-新建预付款-保存-保存成功，没有自动跳转列表页，导致可以重复保存
             开发人员：崔洛宜
             日期：2020-03-30
             BUG类型：测试人员发现的研发自测未通过引起的BUG
             **/
            this.$message.success('保存成功')
            this.$router.back()
            /*if (!this.isSave) {
              this.$router.back()
            }*/
          } else {
            this.$message.error('保存失败')
          }
        })
      }
    },
    handleSubmitError() {
      this.$message.error('保存失败')
    }
  }
}
</script>
<style lang="less" scoped>
.outerContainer {
  padding: 20px;
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
</style>
