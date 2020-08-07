<!--
 * @Description:
 * @Version:
 * @Autor:
 * @Date: 2020-02-14 17:02:49
 * @LastEditTime: 2020-02-19 17:47:26
 -->
<template>
  <div class="margin-bottom-100">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <Base :form="form" editName="ProviderManagementCreate" />

    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="goBack">返回</el-button>
      <template v-else>
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import supplierState from '@/lib/supplier/supplierState'
import supplierType from '@/lib/supplier/supplierType'
import api from '@/api/provider/manage.js'
import Base from '@/views/provider/components/management/Details'
export default {
  name: 'ProviderManagementDetails',
  components: {
    Base
  },
  data() {
    return {
      // moneyFormat:moneyFormat,
      id: this.$route.params.id,
      form: {
        bankAccountList: [],
        contactList: []
      }
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.getDetails()
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
  },
  methods: {
    async getDetails() {
      let res = await api.getSupplierManageDetails(this.id)
      if (res) {
        this.form = res.data
      }
    },
    goBack() {
      this.$router.push({ name: 'ProviderManagementList' })
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style lang="scss" scoped></style>
