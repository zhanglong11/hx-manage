<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.planName }}({{ orderInfo.planNumber }})</span>
        </h6>
        <ul>
          <li>
            <span class="label">检查性质</span>
            <span class="val">{{
              _.get(_.find(paramList.checkNatureList, { value: orderInfo.checkNature }), 'label')
            }}</span>
          </li>
          <li>
            <span class="label">检查人</span>
            <span class="val">{{ orderInfo.checkPersonName }}</span>
          </li>
          <li>
            <span class="label">检查人联系方式</span>
            <span class="val">{{ orderInfo.checkPersonContact }}</span>
          </li>
          <li>
            <span class="label">检查部门</span>
            <span class="val">{{ orderInfo.checkDepartmentName }}</span>
          </li>
          <li>
            <span class="label">通知人</span>
            <span class="val">{{ orderInfo.notificationPersonNames }}</span>
          </li>
          <li>
            <span class="label">通知人联系方式</span>
            <span class="val">{{ orderInfo.notificationPersonPhones }}</span>
          </li>
          <li>
            <span class="label">计划开始时间</span>
            <span class="val">{{ moment(orderInfo.planStartDate).format('YYYY-MM-DD') }}</span>
          </li>
          <li>
            <span class="label">计划结束时间</span>
            <span class="val">{{ moment(orderInfo.planEndDate).format('YYYY-MM-DD') }}</span>
          </li>
          <li>
            <span class="label">工期（天）</span>
            <span class="val">{{ moment(orderInfo.planEndDate).diff(moment(orderInfo.planStartDate), 'days') }}</span>
          </li>
          <li>
            <span class="label">危险源名称</span>
            <span class="val">{{ orderInfo.dangerSourceNames }}</span>
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
      <div class="status-box">
        <p class="status">状态</p>
        <p class="status-info">
          <span class="val">{{ _.get(_.find(paramList.safeCommonStatus, { value: orderInfo.status }), 'label') }}</span>
        </p>
      </div>
    </div>
    <section style="margin-top: 10px;">
      <el-card>
        <div slot="header" class="card-header">
          <span>审核</span>
        </div>
        <el-form
          ref="form"
          :model="form"
          :disabled="orderInfo.status !== 1"
          :rules="rules"
          class="form"
          label-width="110px"
        >
          <el-form-item label="审核结果" prop="auditStatus" style="width: 50%;">
            <el-radio-group v-model="form.auditStatus">
              <el-radio :label="0">同意</el-radio>
              <el-radio :label="1">不同意</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="remark " style="width: 50%;">
            <el-input v-model="form.remark" type="textarea" />
          </el-form-item>
          <el-form-item label="附件" prop="file" style="width: 50%;">
            <FileUpload v-model="form.file" />
          </el-form-item>
        </el-form>
      </el-card>
    </section>
    <div class="btn-box">
      <el-button type="primary" @click="submit">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/safe/plan/plan'
import paramList from '@/lib/paramList'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
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
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.form.auditStatus
            ? await api.auditReject(this.$route.query.id)
            : await api.auditPass(this.$route.query.id)
          this.$message.success('操作成功')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
