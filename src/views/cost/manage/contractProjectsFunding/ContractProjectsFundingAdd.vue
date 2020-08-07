<template>
  <div>
    <BudgetTreeTable :showFilter="true" :showDetail="false"></BudgetTreeTable>
    <div class="footerButton">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleCancel">提交</el-button>
    </div>
  </div>
</template>
<script>
import BudgetTreeTable from '@/views/cost/components/BudgetTreeTable'
export default {
  name: 'ContractProjectsFundingAdd',
  components: { BudgetTreeTable },
  data() {
    return {}
  },
  created() {},
  methods: {
    handleCancel() {
      this.$router.back()
    },
    handleSubmit() {
      this.$message.success('成功')
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
