<template>
  <div class="is-footer">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.checkPlanName }}{{ orderInfo.checkPlanNumber }}</span>
        </h6>
        <ul>
          <li>
            <span class="label">检查部位</span>
            <span class="val">{{ orderInfo.point.checkPoint }}</span>
          </li>
          <li>
            <span class="label">检查项目</span>
            <span class="val">{{ orderInfo.point.checkItem }}</span>
          </li>
          <li>
            <span class="label">检查性质</span>
            <span class="val">{{ _.get(_.find(natureCheckList, { value: orderInfo.checkNature }), 'label') }}</span>
          </li>
          <li>
            <span class="label">检查方式</span>
            <span class="val">{{ orderInfo.point.checkWay }}</span>
          </li>
          <li>
            <span class="label">检查数量</span>
            <span class="val">{{ orderInfo.point.checkAmount }}</span>
          </li>
          <li>
            <span class="label">允许偏差</span>
            <span class="val">{{ orderInfo.point.allowableDeviation }}</span>
          </li>
          <li>
            <span class="label">计划时间</span>
            <span class="val">{{ orderInfo.planTime }}</span>
          </li>
          <li>
            <span class="label">验收要求</span>
            <span class="val">{{ orderInfo.acceptanceRequire }}</span>
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
          <span class="val">{{ _.get(_.find(paramList.safeCommonStatus, { value: orderInfo.status }), 'label') }}</span>
        </p>
      </div>
    </div>
    <!-- 审批组件 start -->
    <CheckCard v-if="isCheck" :id="id" ref="checkCard"></CheckCard>
    <!-- 审批组件 end -->
    <div class="footer-btn">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button v-if="isCheck" type="primary" @click="approval()">确定</el-button>
    </div>
  </div>
</template>

<script>
import paramList from '@/lib/paramList'
import api from '@/api/quality/control/checkPlan'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {
        point: {}
      },
      natureCheckList: [
        { label: '质量临检', value: 1 },
        { label: '一般检查', value: 2 },
        { label: '阶段性检查', value: 3 },
        { label: '专项检查', value: 4 }
      ],
      paramList,
      id: this.$route.params.id || '',
      isCheck: this.$route.params.isCheck
    }
  },
  computed: {
    isAudit() {
      return this.$route.meta.isAudit
    }
  },
  created() {
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

<style scoped></style>
