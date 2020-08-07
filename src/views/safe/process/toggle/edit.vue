<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="150px">
        <el-form-item label="单位名称" prop="organizationId">
          <SelectDepart
            :id.sync="form.organizationId"
            :multiple="false"
            :value="form.organizationId ? { id: form.organizationId, label: form.organizationName } : null"
            :label.sync="form.organizationName"
          />
        </el-form-item>
        <el-form-item label="奖惩日期" prop="rewardsPunishmentsDate">
          <el-date-picker
            v-model="form.rewardsPunishmentsDate"
            value-format="yyyy-MM-dd HH:MM:SS"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="奖惩状态" prop="type">
          <SelectList v-model="form.type" :hasAllOption="false" type="safeToggle" />
        </el-form-item>
        <el-form-item label="奖惩事由" prop="reason">
          <el-input v-model="form.reason" type="textarea" />
        </el-form-item>
        <el-form-item label="奖惩金额（万元）" prop="money">
          <InputNumber v-model="form.money" />
        </el-form-item>
        <el-form-item label="主要记事" prop="mainEvent">
          <el-input v-model="form.mainEvent" type="textarea" />
        </el-form-item>
        <el-form-item label="上传" prop="files">
          <FileEdit v-model="form.files" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(null)">保存</el-button>
      <el-button type="primary" @click="submit(1)">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/safe/process/toggle'
export default {
  name: 'Edit',
  data() {
    return {
      form: {},
      rules: {
        organizationId: { required: true, message: '必填' },
        rewardsPunishmentsDate: { required: true, message: '必填' },
        type: { required: true, message: '必填' },
        reason: { required: true, message: '必填' },
        money: { required: true, message: '必填' }
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.params.id, {})
      this.form = res.data
    },
    async submit(isAudit) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.$route.params.id ? await api.update({ ...this.form }) : await api.add({ ...this.form })
          if (isAudit) {
            let audit = this.$route.params.id
              ? await api.submitAudit(this.$route.params.id)
              : await api.submitAudit(res.data)
          }
          this.$message.success('保存成功')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    showPeopleDialog() {
      this.planVisible = true
    }
  }
}
</script>

<style lang="less">
.edit-section {
  width: 400px;
}
</style>
