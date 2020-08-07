<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
        <el-form-item label="作业部门" prop="operationDepartment">
          <el-input v-model="form.operationDepartment" />
          <!--          <SelectDepart-->
          <!--            :id.sync="form.operationDepartmentId"-->
          <!--            :multiple="false"-->
          <!--            :value="-->
          <!--              form.operationDepartmentId ? { id: form.operationDepartmentId, label: form.operationDepartment } : null-->
          <!--            "-->
          <!--            :label.sync="form.operationDepartment"-->
          <!--          />-->
        </el-form-item>
        <el-form-item label="作业地点" prop="operationAddress">
          <el-input v-model="form.operationAddress" />
        </el-form-item>
        <el-form-item label="作业类别" prop="operationCategory">
          <SelectList v-model="form.operationCategory" :hasAllOption="false" type="operationType" />
        </el-form-item>
        <el-form-item label="计划开始时间" prop="planStartDate">
          <el-date-picker v-model="form.planStartDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="计划结束时间" prop="planEndDate">
          <el-date-picker v-model="form.planEndDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="作业内容" prop="operationContent">
          <el-input v-model="form.operationContent" type="textarea" />
        </el-form-item>
        <el-form-item label="作业安全标准" prop="operationSafetyStandard">
          <el-input v-model="form.operationSafetyStandard" type="textarea" />
        </el-form-item>
        <!--功能修改 张龙 3-30-->
        <el-form-item label="现场指挥人" prop="fieldManger">
          <el-input v-model="form.fieldManger" />
          <!--          <SelectUser-->
          <!--            :id.sync="form.fieldMangerId"-->
          <!--            :value="form.fieldMangerId ? { id: form.fieldMangerId, label: form.fieldManger } : null"-->
          <!--            :name.sync="form.fieldManger"-->
          <!--            :multiple="false"-->
          <!--          />-->
        </el-form-item>
        <el-form-item label="现场监护人" prop="onsiteGuardian">
          <el-input v-model="form.onsiteGuardian" />
          <!--          <SelectUser-->
          <!--            :id.sync="form.onsiteGuardianId"-->
          <!--            :value="form.onsiteGuardianId ? { id: form.onsiteGuardianId, label: form.onsiteGuardian } : null"-->
          <!--            :name.sync="form.onsiteGuardian"-->
          <!--            :multiple="false"-->
          <!--          />-->
        </el-form-item>
        <el-form-item label="实际开始日期" prop="actualStartDate">
          <el-date-picker v-model="form.actualStartDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="实际结束日期" prop="actualEndDate">
          <el-date-picker v-model="form.actualEndDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="附件" prop="files">
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
      <!--      <el-button type="primary" @click="submit(1)">保存并提交</el-button>-->
    </div>
  </div>
</template>

<script>
import api from '@/api/safe/process/special'
export default {
  name: 'Edit',
  data() {
    return {
      form: {},
      rules: {
        operationDepartment: { required: true, message: '必填' },
        operationAddress: { required: true, message: '必填' },
        operationCategory: { required: true, message: '必填' },
        planStartDate: { required: true, message: '必填' },
        planEndDate: { required: true, message: '必填' },
        operationContent: { required: true, message: '必填' },
        actualStartDate: { required: true, message: '必填' },
        actualEndDate: { required: true, message: '必填' }
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
    }
  }
}
</script>

<style lang="less">
.edit-section {
  width: 400px;
}
</style>
