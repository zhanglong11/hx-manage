<template>
  <div>
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="info">
      <div class="content">
        <ul>
          <li>
            <span class="label">单位名称</span>
            <span class="val">{{ orderInfo.organizationName }}</span>
          </li>
          <li>
            <span class="label">奖惩日期</span>
            <span class="val">{{ orderInfo.rewardsPunishmentsDate }}</span>
          </li>
          <li>
            <span class="label">奖惩状态</span>
            <span class="val">{{ _.get(_.find(paramList.safeToggle, { value: orderInfo.type }), 'label') }}</span>
          </li>
          <li>
            <span class="label">奖惩金额（万元）</span>
            <span class="val">{{ orderInfo.money }}</span>
          </li>
          <li>
            <span class="label">奖惩事由</span>
            <span class="val">{{ orderInfo.reason }}</span>
          </li>
          <li>
            <span class="label">主要记事</span>
            <span class="val">{{ orderInfo.mainEvent }}</span>
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
import api from '@/api/safe/process/toggle'
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
