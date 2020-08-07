<template>
  <div class="is-Footer white">
    <ViewFlow :id="$route.params.id" />
    <el-card class="box-card">
      <div slot="header" class="details-header">
        <span class="details-title">{{ orderInfo.safetyIndicatorName }}</span>
      </div>
      <div class="details">
        <div class="left">
          <div>
            <span class="label">时间范围</span>
            <span>{{ orderInfo.timeRangeBegin | ymd }}~{{ orderInfo.timeRangeEnd | ymd }}</span>
          </div>
          <div>
            <span class="label">一般事故数量</span>
            <span>{{ orderInfo.generalAccidentNum }}</span>
          </div>
          <div>
            <span class="label">较大事故数量</span>
            <span>{{ orderInfo.largerAccidentNum }}</span>
          </div>
          <div>
            <span class="label">重大事故数量</span>
            <span>{{ orderInfo.greatAccidentNum }}</span>
          </div>
        </div>
        <div class="right">
          <div>
            <span class="label">特别重大事故数量</span>
            <span>{{ orderInfo.veryGreatAccidentNum }}</span>
          </div>
          <div>
            <span class="label">指标完成情况</span>
            <span> {{ $getLabel(safeTargetList, orderInfo.ndicatorAchievingStatus) }}</span>
          </div>
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
    <div class="footer-btn">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import safeTargetList from '../../lib/safeTargetList'
import Api from '../../api/index'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      safeTargetList
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await Api.safeTarget.detail(this.$route.params.id)
      this.orderInfo = res.data
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/detail';
</style>
