<template>
  <div class="is-Footer white">
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="保护部位" prop="protectionPlace">
          <el-input v-model="form.protectionPlace" class="inputStyle" />
        </el-form-item>
        <el-form-item label="保护时间" prop="protectionDate">
          <el-date-picker v-model="form.protectionDate" class="inputStyle" />
        </el-form-item>
        <el-form-item label="拆除时间" prop="dismantleDate">
          <el-date-picker v-model="form.dismantleDate" class="inputStyle" />
        </el-form-item>
        <el-form-item label="保护方法" prop="protectionMethod">
          <el-input v-model="form.protectionMethod" class="inputStyle" />
        </el-form-item>
        <el-form-item label="责任部门" required>
          <SelectDepart
            :id.sync="form.responsibleDepartmentId"
            :multiple="false"
            :value="
              form.responsibleDepartmentId
                ? { id: form.responsibleDepartmentId, label: form.responsibleDepartmentName }
                : null
            "
            :label.sync="form.responsibleDepartmentName"
            class="inputStyle"
          />
        </el-form-item>
        <el-form-item label="责任人" required>
          <SelectUser
            :id.sync="form.principalId"
            :value="form.principalId ? { id: form.principalId, label: form.principalName } : null"
            :name.sync="form.principalName"
            :multiple="false"
            class="inputStyle"
          />
        </el-form-item>
        <el-form-item label="附件" required>
          <FileEdit v-model="form.fileIds" class="inputStyle" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" class="inputStyle" />
        </el-form-item>
      </el-form>
    </section>
    <div class="footer-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../../api/index'
export default {
  name: 'Edit',
  data() {
    return {
      form: {},
      rules: {
        protectionPlace: [{ required: true, message: '请输入保护部位', trigger: 'blur' }],
        protectionDate: [{ required: true, message: '请选择保护时间', trigger: 'change' }],
        dismantleDate: [{ required: true, message: '请选择拆除时间', trigger: 'change' }],
        protectionMethod: [{ required: true, message: '请输入保护方法', trigger: 'blur' }]
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
      let res = await Api.finishProtect.detail(this.$route.params.id, {})
      this.form = res.data
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (!this.form.responsibleDepartmentId) {
            this.$message.error('请选择责任部门')
            return
          }
          if (!this.form.principalId) {
            this.$message.error('请选择责任人')
            return
          }
          if (!this.form.fileIds) {
            this.$message.error('请上传附件')
            return
          }
          let res = this.$route.params.id
            ? await Api.finishProtect.update({ ...this.form })
            : await Api.finishProtect.add({ ...this.form })
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
@import '../../style.less';
</style>
