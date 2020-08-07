<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.code }}</span>
        </h6>
        <ul>
          <li>
            <span class="label">颁布部门</span>
            <span class="val">{{ orderInfo.issueDepartmentName }}</span>
          </li>
          <li>
            <span class="label">制（修）订日期</span>
            <span class="val">{{ orderInfo.evolveDate }}</span>
          </li>
          <li>
            <span class="label">生效日期</span>
            <span class="val">{{ orderInfo.takeEffectDate }}</span>
          </li>
          <li>
            <span class="label">使用部门</span>
            <span class="val">{{ orderInfo.useDepartment }}</span>
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
import api from '@/api/safe/education/library'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {}
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
      this.$router.push({ path: 'libraryEdit', params: { id } })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
