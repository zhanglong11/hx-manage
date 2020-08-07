<!--
 * @Description: 分包商退场详情
 * @Version:
 * @Autor:
 * @Date: 2020-02-14 17:02:49
 * @LastEditTime: 2020-02-19 17:08:11
 -->
<template>
  <div>
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <Base :form="form" editName="SubContractorBowOutAdd" />

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
import Base from '@/views/provider/components/bowOut/Details'
import supplierState from '@/lib/supplier/supplierState'
import api from '@/api/provider/bowOut.js'
export default {
  name: 'SubContractorBowOutDetails',
  components: {
    Base
  },
  data() {
    return {
      form: {},
      operatList: [],
      fileList: [
        {
          name: '文件1',
          value: '23'
        }
      ]
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
      this.$router.push({ name: 'SubContractorBowOut' })
    },
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style lang="less" scoped></style>
