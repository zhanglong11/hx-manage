<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.name }}</span>
        </h6>
        <ul>
          <li>
            <span class="label">奖惩人员</span>
            <span class="val">{{ orderInfo.personnelName }}</span>
          </li>
          <li>
            <span class="label">所属部门</span>
            <span class="val">{{ orderInfo.departmentName }}</span>
          </li>
          <li>
            <span class="label">奖惩日期</span>
            <span class="val">{{ orderInfo.happenDate }}</span>
          </li>
          <li>
            <span class="label">金额（元）</span>
            <span class="val">{{ orderInfo.money }}</span>
          </li>
          <li>
            <span class="label">事由</span>
            <span class="val">{{ orderInfo.reason }}</span>
          </li>
          <li>
            <span class="label">奖惩</span>
            <span class="val">{{ _.get(_.find(paramList.rewardPunishType, { value: orderInfo.type }), 'label') }}</span>
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
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/quality/control/rewardPunishment'
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
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.query.id)
      this.orderInfo = res.data
    },
    toEdit(id) {
      this.$router.push({ path: 'rewardPunishmentEdit', query: { id } })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
