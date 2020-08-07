<template>
  <div>
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>停工令</span>
        </h6>
        <ul>
          <li>
            <span class="label">工程名称</span>
            <span class="val">{{ orderInfo.engineeringName }}</span>
          </li>
          <li>
            <span class="label">停工部位</span>
            <span class="val">{{ orderInfo.stopWorkPlace }}</span>
          </li>
          <li>
            <span class="label">停工时间</span>
            <span class="val">{{ orderInfo.stopWorkDate }}</span>
          </li>
          <li>
            <span class="label">停工原因</span>
            <span class="val">{{ orderInfo.stopWorkReason }}</span>
          </li>
          <li>
            <span class="label">整改要求</span>
            <span class="val">{{ orderInfo.rectificationRequire }}</span>
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
              <FileList :ids="orderInfo.fileIds" />
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
          <span class="val">{{ _.get(_.find(paramList.stopCheckStatus, { value: orderInfo.status }), 'label') }}</span>
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
import api from '@/api/quality/toggleManage/stop'
import paramList from '@/lib/paramList'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      paramList
    }
  },
  computed: {
    isAudit() {
      return this.$route.meta.isAudit
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
