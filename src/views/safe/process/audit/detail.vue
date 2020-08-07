<template>
  <div>
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>安全考核</span>
        </h6>
        <ul>
          <li>
            <span class="label">被考核单位</span>
            <span class="val">{{ orderInfo.assessCompanyName }}</span>
          </li>
          <li>
            <span class="label">考核时间</span>
            <span class="val">{{ orderInfo.assessDate }}</span>
          </li>
          <li>
            <span class="label">考核评价</span>
            <span class="val">{{
              _.get(_.find(paramList.auditEvaluate, { value: orderInfo.assessEvaluate }), 'label')
            }}</span>
          </li>
          <li>
            <span class="label">整改期限</span>
            <span class="val">{{ orderInfo.rectificationDate }}</span>
          </li>
          <li>
            <span class="label">考核内容概括</span>
            <span class="val">{{ orderInfo.assessContent }}</span>
          </li>
          <li>
            <span class="label">整改措施</span>
            <span class="val">{{ orderInfo.rectificationMeasures }}</span>
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
import api from '@/api/safe/process/audit'
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
