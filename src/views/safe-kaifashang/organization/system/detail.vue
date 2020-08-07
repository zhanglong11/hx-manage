<template>
  <div class="container no-padding is-footer">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <el-card class="box-card">
      <div slot="header" class="details-header">
        <span class="details-title">{{ orderInfo.regimeName }} ({{ orderInfo.regimeNumber }})</span>
      </div>
      <div class="details">
        <div class="left">
          <div>
            <span class="label">制度内容</span>
            <span> {{ orderInfo.regimeContent }}</span>
          </div>
          <div>
            <span class="label">附件</span>
            <span><FileList :ids="orderInfo.files" /></span>
          </div>
        </div>
        <div class="right">
          <div>
            <span class="label">创建人</span>
            <span>{{ orderInfo.creatorName }}</span>
          </div>
          <div>
            <span class="label">创建时间</span>
            <span>{{ orderInfo.createTime }}</span>
          </div>
        </div>
        <div class="row">
          <div>
            <span class="label">备注</span>
            <span>{{ orderInfo.remark }}</span>
          </div>
        </div>
      </div>
    </el-card>
    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="$router.go(-1)">返回</el-button>
      <template v-else>
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import paramList from '@/lib/paramList'
import api from '@/api/safe/organization/system'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      paramList
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.id)
      this.orderInfo = res.data
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/detail';
</style>
