<template>
  <div>
    <section style="width: 600px;">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="240px">
        <el-form-item label="事故类型" prop="accidentType">
          <SelectList v-model="form.accidentType" :hasAllOption="false" type="accidentType" />
        </el-form-item>
        <el-form-item label="事故等级" prop="accidentLevel">
          <SelectList v-model="form.accidentLevel" :hasAllOption="false" type="accidentLevel" />
        </el-form-item>
        <el-form-item label="事故性质" prop="accidentNature">
          <SelectList v-model="form.accidentNature" :hasAllOption="false" type="accidentNature" />
        </el-form-item>
        <el-form-item label="事故日期" prop="accidentDate">
          <el-date-picker v-model="form.accidentDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="事故地点" prop="accidentPosition">
          <el-input v-model="form.accidentPosition" />
        </el-form-item>
        <el-form-item label="死亡人数" prop="deathNumber">
          <InputNumber v-model="form.deathNumber" />
        </el-form-item>
        <el-form-item label="重伤人数" prop="seriousInjuryNumber">
          <InputNumber v-model="form.seriousInjuryNumber" />
        </el-form-item>
        <el-form-item label="轻伤人数" prop="minorWoundNumber">
          <InputNumber v-model="form.minorWoundNumber" />
        </el-form-item>
        <el-form-item label="事故描述" prop="accidentDescription">
          <el-input v-model="form.accidentDescription" type="textarea" />
        </el-form-item>
        <el-form-item label="直接经济损失（万元）" prop="directEconomicLoss">
          <InputNumber v-model="form.directEconomicLoss" />
        </el-form-item>
        <el-form-item label="事故主要原因" prop="accidentReason">
          <el-input v-model="form.accidentReason" type="textarea" />
        </el-form-item>
        <el-form-item label="对项目处罚的政府监管部门" prop="governmentSuperviseDepartment">
          <el-input v-model="form.governmentSuperviseDepartment" />
          <!--          <SelectDepart-->
          <!--            :id.sync="form.governmentSuperviseDepartment"-->
          <!--            :multiple="false"-->
          <!--            :value="-->
          <!--              form.governmentSuperviseDepartment-->
          <!--                ? { id: form.governmentSuperviseDepartment, label: form.governmentSuperviseDepartmentName }-->
          <!--                : null-->
          <!--            "-->
          <!--            :label.sync="form.governmentSuperviseDepartmentName"-->
          <!--          />-->
        </el-form-item>
        <el-form-item label="处罚决定下达日期" prop="punishmentDate">
          <el-date-picker v-model="form.punishmentDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="处罚条款" prop="punishmentClause">
          <el-input v-model="form.punishmentClause" type="textarea" />
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
      <el-button type="primary" @click="submit">保存并提交</el-button>
    </div>
    <SelectSafeCheckDialog :visible.sync="planVisible" />
  </div>
</template>

<script>
import SelectSafeCheckDialog from './components/SelectSafeCheckDialog'
import api from '@/api/safe/process/accident'
export default {
  name: 'Edit',
  components: { SelectSafeCheckDialog },
  data() {
    return {
      planVisible: false,
      form: {},
      rules: {
        accidentType: { required: true, message: '必填' },
        accidentLevel: { required: true, message: '必填' },
        accidentNature: { required: true, message: '必填' },
        accidentDate: { required: true, message: '必填' },
        accidentPosition: { required: true, message: '必填' },
        directEconomicLoss: { required: true, message: '必填' },
        accidentReason: { required: true, message: '必填' },
        punishmentDate: { required: true, message: '必填' },
        governmentSuperviseDepartment: { required: true, message: '必填' }
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
