<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.specificationName }}</span>
        </h6>
        <ul>
          <li>
            <span class="label">类别</span>
            <span class="val">{{
              _.get(_.find(paramList.standardTypeList, { value: orderInfo.category }), 'label')
            }}</span>
          </li>
          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.creatorName }}</span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
          <li>
            <span class="label">内容</span>
            <span class="val">
              <FileList :ids="orderInfo.contentFileIds" />
            </span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.createTime }}</span>
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
import paramList from '@/lib/paramList'
import api from '@/api/quality/plan/checkStandard'
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
      this.$router.push({ path: 'checkStandardEdit', query: { id } })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
