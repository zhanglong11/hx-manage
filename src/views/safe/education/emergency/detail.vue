<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.planName }}</span>
        </h6>
        <ul>
          <li>
            <span class="label">预案名称</span>
            <span class="val">{{ orderInfo.planName }}</span>
          </li>
          <li>
            <span class="label">预案类别</span>
            <span class="val">{{
              _.get(_.find(paramList.emergencyType, { value: orderInfo.planCategory }), 'label')
            }}</span>
          </li>
          <li>
            <span class="label">批准日期</span>
            <span class="val">{{ orderInfo.approveDate }}</span>
          </li>
          <li>
            <span class="label">批准人</span>
            <span class="val">{{ orderInfo.approverName }}</span>
          </li>
          <li>
            <span class="label">最后一次演练日期</span>
            <span class="val">{{ orderInfo.lastManoeuvreDate }}</span>
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
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/safe/education/emergency'
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
      this.$router.push({ path: 'emergencyEdit', query: { id } })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
