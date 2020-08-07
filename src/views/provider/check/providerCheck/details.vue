<!--
 * @Description: 供应商审核详情
 * @Version:
 * @Autor:
 * @Date: 2020-02-14 17:02:49
 * @LastEditTime: 2020-02-19 17:58:00
 -->
<template>
  <div>
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <!--    <Title title="供应商审核详情" />-->
    <Base :form="form" />
    <!-- 审核 -->
    <!--    <CheckForm ref="checkForm" :type="type" :checkForm="form" />-->
    <!-- 审核组件 start -->
    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard" @emit="handleEmitForm"></CheckCard>
    </template>
    <!-- 审核组件 end -->
    <!-- 保存等操作按钮 -->
    <div class="btn-box-footer">
      <el-button :class="type === 'check' ? '' : 'btn-box-footer-button'" @click="cancel">取消</el-button>
      <el-button v-if="type === 'check'" type="primary" class="btn-box-footer-button" @click="check">审核</el-button>
    </div>
  </div>
</template>

<script>
import Base from '@/views/provider/components/management/Details'
import api from '@/api/provider/manage.js'
import Api from '@/api/contract/contractManage'
export default {
  name: 'ProviderAuditDetails',
  components: {
    Base
    // CheckForm
  },
  data() {
    return {
      id: this.$route.query.id,
      type: this.$route.query.type,
      form: {
        bankAccountList: [],
        contactList: []
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getDetails()
    }
  },
  created() {
    let isCheck = this.$route.params
    this.isCheck = isCheck
  },
  methods: {
    async getDetails() {
      let res = await api.supplierManageAuditDetails(this.id)
      if (res) {
        this.form = res.data
      }
    },
    handleEmitForm(data) {
      console.log(data)
      Api.handleCheck(data).then(res => {
        if (res.code === 200) {
          this.$message.success('审核成功')
          this.$router.back()
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    cancel() {
      this.$router.push({ name: 'ProviderAudit' })
    },
    check() {
      let data = this.$refs.checkForm.judge()
      if (data) {
        this.save(data)
      }
    },
    async save(data) {
      let res = await api.supplierManageAudit(data)
      this.$message.success('审核成功')
      this.cancel()
    }
  }
}
</script>

<style lang="scss" scoped></style>
