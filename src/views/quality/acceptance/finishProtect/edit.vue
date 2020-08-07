<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="保护部位" prop="protectionPlace">
          <el-input v-model="form.protectionPlace" />
        </el-form-item>
        <el-form-item label="保护时间E" prop="protectionDate">
          <el-date-picker v-model="form.protectionDate" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="拆除时间" prop="dismantleDate">
          <el-date-picker v-model="form.dismantleDate" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="保护方法" prop="protectionMethod">
          <el-input v-model="form.protectionMethod" />
        </el-form-item>
        <el-form-item label="责任部门" prop="responsibleDepartmentId">
          <SelectDepart
            :id.sync="form.responsibleDepartmentId"
            :multiple="false"
            :value="
              form.responsibleDepartmentId
                ? { id: form.responsibleDepartmentId, label: form.responsibleDepartmentName }
                : null
            "
            :label.sync="form.responsibleDepartmentName"
          />
        </el-form-item>
        <el-form-item label="责任人" prop="principalId">
          <SelectUser
            :id.sync="form.principalId"
            :value="form.principalId ? { id: form.principalId, label: form.principalName } : null"
            :name.sync="form.principalName"
            :multiple="false"
          />
        </el-form-item>
        <el-form-item label="附件" prop="fileIds">
          <FileEdit v-model="form.fileIds" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/quality/acceptance/finishProtect'
export default {
  name: 'Edit',
  data() {
    return {
      form: {},
      rules: {
        protectionPlace: [{ required: true, message: '必填' }],
        protectionDate: [{ required: true, message: '必填' }]
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
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.$route.params.id ? await api.update({ ...this.form }) : await api.add({ ...this.form })
          this.$message.success('保存成功')
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

<style lang="less">
.edit-section {
  width: 400px;
}

.btn-box {
  margin-top: 10px;
  text-align: left;
}
</style>
