<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>成品保护编号{{ orderInfo.protectionNumber }}</span>
        </h6>
        <ul>
          <li>
            <span class="label">保护部位</span>
            <span class="val">{{ orderInfo.protectionPlace }}</span>
          </li>
          <li>
            <span class="label">保护时间</span>
            <span class="val">{{ orderInfo.protectionDate }}</span>
          </li>
          <li>
            <span class="label">拆除时间</span>
            <span class="val">{{ orderInfo.dismantleDate }}</span>
          </li>
          <li>
            <span class="label">保护办法</span>
            <span class="val">{{ orderInfo.protectionMethod }}</span>
          </li>
          <li>
            <span class="label">责任部门</span>
            <span class="val">{{ orderInfo.responsibleDepartmentName }}</span>
          </li>
          <li>
            <span class="label">责任人</span>
            <span class="val">{{ orderInfo.principalName }}</span>
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
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/quality/acceptance/finishProtect'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {
        protectionNumber: '',
        protectionPlace: '',
        protectionDate: '',
        dismantleDate: '',
        protectionMethod: '',
        responsibleDepartmentName: '',
        principalName: '',
        creatorName: '',
        createTime: '',
        fileIds: '',
        remark: ''
      }
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
      this.$router.push({ path: 'finishProtectEdit', query: { id } })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
