<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>停工令</span>
        </h6>
        <ul>
          <li>
            <span class="label">工程名称</span>
            <span class="val">{{ orderInfo.engineeringName }}</span>
          </li>
          <li>
            <span class="label">停工部位</span>
            <span class="val">{{ orderInfo.stopWorkPlace }}</span>
          </li>
          <li>
            <span class="label">停工时间</span>
            <span class="val">{{ orderInfo.stopWorkDate }}</span>
          </li>
          <li>
            <span class="label">停工原因</span>
            <span class="val">{{ orderInfo.stopWorkReason }}</span>
          </li>
          <li>
            <span class="label">整改要求</span>
            <span class="val">{{ orderInfo.rectificationRequire }}</span>
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
        <el-button v-if="orderInfo.status === 0" type="primary" @click="toEdit($route.query.id)">编辑</el-button>
        <p class="status">状态</p>
        <p class="status-info">
          <span class="val">{{ _.get(_.find(paramList.stopCheckStatus, { value: orderInfo.status }), 'label') }}</span>
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
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/quality/toggleManage/stop'
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
