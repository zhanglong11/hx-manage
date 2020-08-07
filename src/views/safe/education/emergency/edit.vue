<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="160px">
        <el-form-item label="预案名称" prop="planName">
          <el-input v-model="form.planName" />
        </el-form-item>
        <el-form-item label="预案类别" prop="planCategory">
          <SelectList v-model="form.planCategory" :hasAllOption="false" type="emergencyType" />
        </el-form-item>
        <el-form-item label="批准日期" prop="approveDate">
          <el-date-picker v-model="form.approveDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="批准人" prop="approverName">
          <el-input v-model="form.approverName" />
        </el-form-item>
        <el-form-item label="最后一次演练日期" prop="lastManoeuvreDate">
          <el-date-picker v-model="form.lastManoeuvreDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
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
import api from '@/api/safe/education/emergency'
export default {
  name: 'Edit',
  data() {
    return {
      planVisible: false,
      form: {},
      rules: {
        planName: [{ required: true, message: '必填' }],
        planCategory: [{ required: true, message: '必填' }],
        approveDate: [{ required: true, message: '必填' }]
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
