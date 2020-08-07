<!--
 * @Description:
 * @Version:
 * @Autor:
 * @Date: 2020-02-14 17:02:49
 * @LastEditTime: 2020-02-19 16:28:04
 -->
<template>
  <div>
    <!-- 基本信息 -->
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <Base :form="form" editName="SubContractorEnterEdit" />

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
import Base from '@/views/provider/components/enter/Details'
import api from '@/api/provider/enter.js'
export default {
  name: 'SubContractorEnterDetails',
  components: {
    Base
  },
  data() {
    return {
      form: {}
    }
  },
  mounted() {
    if (this.id) {
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
      let res = await api.getDetails(this.id)
      if (res) {
        this.form = res.data
      }
    },
    goBack() {
      this.$router.push({ name: 'SubContractorEnter' })
    },
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style lang="less" scoped></style>
