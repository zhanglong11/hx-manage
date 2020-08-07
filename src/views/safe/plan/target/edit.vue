<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="160px">
        <el-form-item label="年度" prop="year">
          <el-date-picker
            v-model="form.year"
            type="year"
            placeholder="选择年"
            value-format="yyyy"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="项目安全指标名称" prop="safetyIndicatorName">
          <el-input v-model="form.safetyIndicatorName" />
        </el-form-item>
        <el-form-item label="危险发生率（%）" prop="riskIncidence">
          <InputNumber v-model="form.riskIncidence" />
        </el-form-item>
        <el-form-item label="指标完成情况" prop="ndicatorAchievingStatus">
          <SelectList v-model="form.ndicatorAchievingStatus" :hasAllOption="false" type="isFinishedList" />
        </el-form-item>
        <el-form-item label="是否达标" prop="isReachStandard">
          <SelectList v-model="form.isReachStandard" :hasAllOption="false" type="isStandardList" />
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
import api from '@/api/safe/plan/target'
export default {
  name: 'Edit',
  data() {
    return {
      form: {
        year: moment(new Date()).format('YYYY')
      },
      rules: {
        year: [{ required: true, message: '必填' }],
        safetyIndicatorName: [{ required: true, message: '必填' }],
        riskIncidence: [{ required: true, message: '必填' }],
        ndicatorAchievingStatus: [{ required: true, message: '必填' }],
        isReachStandard: [{ required: true, message: '必填' }]
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
      this.form.year = res.data.year + ''
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
