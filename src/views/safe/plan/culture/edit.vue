<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="150px">
        <el-form-item label="安全文明管理名称" prop="civilizationName">
          <el-input v-model="form.civilizationName" />
        </el-form-item>
        <el-form-item label="安全文明管理内容" prop="civilizationContent">
          <el-input v-model="form.civilizationContent" />
        </el-form-item>
        <el-form-item label="负责人" prop="principalName">
          <div style="display: flex;">
            <el-input v-model="form.principalName" disabled />
            <el-button type="text" @click="showPeopleDialog">选择人员</el-button>
          </div>
        </el-form-item>
        <el-form-item label="负责人联系方式" prop="principalContact">
          <el-input v-model="form.principalContact" />
        </el-form-item>
        <el-form-item label="计划开始时间" prop="planStartDate">
          <el-date-picker v-model="form.planStartDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="计划结束时间" prop="planEndDate">
          <el-date-picker v-model="form.planEndDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="安全文明管理目标" prop="civilizationTarget">
          <el-input v-model="form.civilizationTarget" type="textarea" />
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
      <el-button type="primary" @click="submit(1)">保存并提交</el-button>
    </div>
    <SelectPeopleDialog :visible.sync="peopleVisible" @choose="choose" />
  </div>
</template>

<script>
import api from '@/api/safe/plan/culture'
import publicRegular from '@/utils/regular'
export default {
  name: 'Edit',
  data() {
    return {
      peopleVisible: false,
      form: {},
      rules: {
        civilizationName: [{ required: true, message: '必填' }],
        civilizationContent: [{ required: true, message: '必填' }],
        principalName: [{ required: true, message: '必填' }],
        planStartDate: [{ required: true, message: '必填' }],
        planEndDate: [{ required: true, message: '必填' }],
        civilizationTarget: [{ required: true, message: '必填' }],
        principalContact: [
          {
            pattern: publicRegular.telephone,
            message: '格式错误',
            trigger: 'blur'
          },
          { required: true, message: '必填' }
        ]
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
      this.peopleVisible = true
    },
    choose(row) {
      this.form = {
        ...this.form,
        ...{
          principal: row.id,
          principalName: row.realName,
          principalContact: row.mobile
        }
      }
    }
  }
}
</script>

<style lang="less">
.edit-section {
  width: 400px;
}
</style>
