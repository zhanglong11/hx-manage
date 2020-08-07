<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
        <el-form-item label="被考核单位" prop="assessCompany">
          <!--          字段替换 张龙 3-30-->
          <SelectDepart
            :id.sync="form.assessCompany"
            :multiple="false"
            :value="form.assessCompany ? { id: form.assessCompany, label: form.assessCompanyName } : null"
            :label.sync="form.assessCompanyName"
          />
        </el-form-item>
        <el-form-item label="考核日期" prop="assessDate">
          <el-date-picker v-model="form.assessDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="考核内容概括" prop="assessContent">
          <el-input v-model="form.assessContent" type="textarea" />
        </el-form-item>
        <el-form-item label="考核评价" prop="assessEvaluate">
          <SelectList v-model="form.assessEvaluate" :hasAllOption="false" type="auditEvaluate" />
        </el-form-item>
        <el-form-item label="整改措施" prop="rectificationMeasures">
          <el-input v-model="form.rectificationMeasures" type="textarea" />
        </el-form-item>
        <el-form-item label="整改期限" prop="rectificationDate">
          <el-date-picker v-model="form.rectificationDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
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
import api from '@/api/safe/process/audit'
export default {
  name: 'Edit',
  data() {
    return {
      form: {},
      rules: {
        assessCompanyId: { required: true, message: '必填' },
        assessDate: { required: true, message: '必填' },
        assessContent: { required: true, message: '必填' },
        assessEvaluate: { required: true, message: '必填' },
        rectificationMeasures: { required: true, message: '必填' },
        rectificationDate: { required: true, message: '必填' }
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
          this.$message.success('操作成功')
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
