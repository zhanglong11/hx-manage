<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.regimeName }} ({{ orderInfo.regimeNumber }})</span>
        </h6>
        <ul>
          <li>
            <span class="label">制度内容</span>
            <span class="val">
              {{ orderInfo.regimeContent }}
            </span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.files" />
            </span>
          </li>
          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.creator }}</span>
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
      <el-button v-if="orderInfo.status === 1" type="primary" @click="submit">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/safe/organization/system'
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
