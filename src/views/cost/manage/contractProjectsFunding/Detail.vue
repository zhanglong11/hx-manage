<template>
  <div>
    <BudgetTreeTable :showFilter="true" :showDetail="true" :isEdit="isEdit"></BudgetTreeTable>
    <OperateList> </OperateList>
    <CheckCard ref="checkCard" @emit="handleEmitForm"></CheckCard>
    <div class="footerButton">
      <el-button v-if="!isEdit" @click="handleCancel">返回</el-button>
      <el-button v-if="isEdit" type="primary" @click="handleSave">保存</el-button>
      <el-button v-if="isCheck" type="primary" @click="handleSubmit">保存并提交</el-button>
    </div>
  </div>
</template>
<script>
import BudgetTreeTable from '@/views/cost/components/BudgetTreeTable'
import OperateList from '@/views/cost/components/OperateList'
export default {
  name: 'Detail',
  components: { BudgetTreeTable, OperateList },
  data() {
    return {
      isEdit: true
    }
  },
  created() {
    let { id, isCheck, isEdit } = this.$route.params
    this.id = id
    this.isCheck = isCheck
    this.isEdit = isEdit
  },
  methods: {
    handleCancel() {
      this.$router.back()
    },
    handleSave() {
      this.$message.success('保存成功')
      this.$router.back()
    },
    handleSubmit() {
      this.$refs.checkCard.audit()
    },
    handleEmitForm(data) {
      console.log(data)
      this.$message.success('审核成功')
      //this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
</style>
