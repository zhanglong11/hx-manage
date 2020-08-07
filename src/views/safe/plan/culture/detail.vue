<template>
  <div>
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.civilizationName }}</span>
        </h6>
        <ul>
          <li>
            <span class="label">安全文明计划编号</span>
            <span class="val">{{ orderInfo.civilizationNumber }}</span>
          </li>
          <li>
            <span class="label">安全文明管理内容</span>
            <span class="val">{{ orderInfo.civilizationContent }}</span>
          </li>
          <li>
            <span class="label">负责人</span>
            <span class="val">{{ orderInfo.principalName }}</span>
          </li>
          <li>
            <span class="label">负责人联系方式</span>
            <span class="val">{{ orderInfo.principalContact }}</span>
          </li>
          <li>
            <span class="label">计划开始时间</span>
            <span class="val">{{ moment(orderInfo.planStartDate).format('YYYY-MM-DD') }}</span>
          </li>
          <li>
            <span class="label">计划结束时间</span>
            <span class="val">{{ moment(orderInfo.planEndDate).format('YYYY-MM-DD') }}</span>
          </li>
          <li>
            <span class="label">安全文明管理目标</span>
            <span class="val">{{ orderInfo.civilizationTarget }}</span>
          </li>
          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.creatorName }}</span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.createTime }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.files" />
            </span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
      <div class="status-box">
        <p class="status">状态</p>
        <p class="status-info">
          <span class="val">{{ _.get(_.find(paramList.safeCommonStatus, { value: orderInfo.status }), 'label') }}</span>
        </p>
      </div>
    </div>
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
import api from '@/api/safe/plan/culture'
import paramList from '@/lib/paramList'
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
      let res = await api.detail(this.$route.params.id)
      this.orderInfo = res.data
    },
    cancel() {
      this.$router.go(-1)
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped></style>
