<template>
  <div>
    <section class="edit-section" style="width: 500px;">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="200px">
        <el-form-item label="标准编号" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="法律法规及其他要求" prop="lawsRegulations">
          <el-input v-model="form.lawsRegulations" />
        </el-form-item>
        <el-form-item label="颁布部门" prop="issueDepartmentName">
          <el-input v-model="form.issueDepartmentName" />
        </el-form-item>
        <el-form-item label="制（修）订日期" prop="evolveDate">
          <el-date-picker v-model="form.evolveDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="生效日期" prop="takeEffectDate">
          <el-date-picker v-model="form.takeEffectDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="使用部门" prop="useDepartment">
          <SelectDepart
            :id.sync="form.useDepartment"
            :multiple="false"
            :value="form.useDepartment ? { id: form.useDepartment, label: form.useDepartmentName } : null"
            :label.sync="form.useDepartmentName"
          />
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
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/safe/education/library'
export default {
  name: 'Edit',
  data() {
    return {
      planVisible: false,
      form: {},
      rules: {
        code: [{ required: true, message: '必填' }],
        lawsRegulations: [{ required: true, message: '必填' }],
        issueDepartment: [{ required: true, message: '必填' }]
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
