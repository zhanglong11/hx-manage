<template>
  <div>
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
            <span class="val">{{ orderInfo.endDate }}</span>
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
    <AuditForm ref="audit" />
    <div class="btn-box">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button type="primary" @click="() => $refs.audit.submit()">确定</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/quality/control/checkPlan'
import paramList from '@/lib/paramList'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {
        point: {}
      },
      paramList,
      form: {},
      rules: {
        auditStatus: [{ required: true, message: '请选择审核结果' }]
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
    submit() {
      console.log()
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
