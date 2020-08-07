<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="details-header">
        <span class="details-title">{{ orderInfo.planName }}{{ orderInfo.planNum }}</span>
      </div>
      <div class="details">
        <div class="left">
          <div>
            <span class="label">安全计划类型</span>
            <span> {{ $getLabel(planTypeList, orderInfo.planType) }}</span>
          </div>
          <div>
            <span class="label">检查性质</span>
            <span> {{ $getLabel(checkNatureList, orderInfo.planNature) }}</span>
          </div>
          <div>
            <span class="label">检查内容</span>
            <span> {{ orderInfo.inspectContent }}</span>
          </div>
          <div>
            <span class="label">检查要求</span>
            <span> {{ orderInfo.inspectRequirements }}</span>
          </div>
          <div>
            <span class="label">检查部门</span>
            <span> {{ orderInfo.inspectDeptName }}</span>
          </div>
          <div>
            <span class="label">检查负责人</span>
            <span> {{ orderInfo.inspectPrincipalName }}</span>
          </div>
          <div>
            <span class="label">检查执行人</span>
            <span>{{ orderInfo.inspectExecutorName }}</span>
          </div>
        </div>
        <div class="right">
          <div>
            <span class="label">{{ $store.state.project.projectType === 'decoration' ? '受检班组' : '受检部门' }}</span>
            <span>{{ orderInfo.beInspectedDeptName }}</span>
          </div>
          <div>
            <span class="label">受检负责人</span>
            <span>{{ orderInfo.beInspectedPrincipalName }}</span>
          </div>
          <div>
            <span class="label">计划开始日期</span>
            <span>{{ orderInfo.planStartTime | ymd }}</span>
          </div>
          <div>
            <span class="label">计划结束日期</span>
            <span>{{ orderInfo.planEndTime | ymd }}</span>
          </div>
          <div>
            <span class="label">检查周期</span>
            <span>{{ orderInfo.inspectDuration }}</span>
          </div>
          <div>
            <span class="label">检查频率</span>
            <span>{{ orderInfo.inspectFrequency }}</span>
          </div>
          <div>
            <span class="label">附件</span>
            <span><FileList :ids="orderInfo.fileId" /></span>
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
    <!-- 批注组件 start -->
    <template v-if="$hasPower('SafetyPlanCommentPCDetail')">
      <AddComments :id="id" type="SafetyInspectRecord" :canAdd="$hasPower('SafetyPlanCommentPCAdd')" />
    </template>
    <div class="footerButton">
      <el-button @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>

<script>
import checkNatureList from '../../lib/checkNatureList'
import statusList from '../../lib/statusList'
import planTypeList from '../../lib/planTypeList'
import Api from '../../api/index'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {
        point: {}
      },
      checkNatureList,
      statusList,
      planTypeList,
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
      let res = await Api.plan.detail(this.id)
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
