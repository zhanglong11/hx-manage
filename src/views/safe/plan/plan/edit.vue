<!--
* @任务编号:原型修改，完善页面功能
* @开发人员:张龙
* @日期:2020-03-18
* @任务类型: 修改代码
-->
<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="140px">
        <el-form-item label="安全计划名称" prop="planName">
          <el-input v-model="form.planName" />
        </el-form-item>
        <el-form-item label="检查性质" prop="checkNature">
          <SelectList v-model="form.checkNature" :hasAllOption="false" type="checkNatureList" />
        </el-form-item>
        <el-form-item label="检查人" prop="checkPersonName">
          <div style="display: flex;">
            <el-input v-model="form.checkPersonName" disabled />
            <el-button type="text" @click="showPeopleDialog">选择人员</el-button>
          </div>
        </el-form-item>
        <el-form-item label="检查人联系方式" prop="checkPersonContact">
          <el-input v-model="form.checkPersonContact" />
        </el-form-item>
        <el-form-item label="检查部门" prop="checkDepartmentId">
          <SelectDepart
            :id.sync="form.checkDepartmentId"
            :multiple="false"
            :value="form.checkDepartmentId ? { id: form.checkDepartmentId, label: form.checkDepartmentName } : null"
            :label.sync="form.checkDepartmentName"
          />
        </el-form-item>
        <el-form-item label="通知人" prop="notificationPersonNames">
          <div style="display: flex;">
            <el-input v-model="form.notificationPersonNames" disabled />
            <el-button type="text" @click="showNoticeDialog">选择人员</el-button>
          </div>
        </el-form-item>
        <el-form-item label="通知人联系方式" prop="notificationPersonPhones">
          <el-input v-model="form.notificationPersonPhones" />
        </el-form-item>
        <el-form-item label="计划开始时间" prop="planStartDate">
          <el-date-picker v-model="form.planStartDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="计划结束时间" prop="planEndDate">
          <el-date-picker v-model="form.planEndDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="检查（天）">
          <InputNumber :value="moment(form.planEndDate).diff(moment(form.planStartDate), 'days')" disabled />
        </el-form-item>
        <el-form-item label="危险源" prop="dangerSourceNames">
          <div style="display: flex;">
            <el-input v-model="form.dangerSourceNames" disabled />
            <el-button type="text" @click="showDangerDialog">选择危险源</el-button>
          </div>
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
    <SelectPeopleDialog :visible.sync="noticeVisible" @choose="chooseNotice" />
    <SelectDangerousDialog :visible.sync="dangerVisible" @getDanger="getDanger" />
  </div>
</template>

<script>
import api from '@/api/safe/plan/plan'
import SelectDangerousDialog from './components/SelectDangerousDialog'
export default {
  name: 'Edit',
  components: { SelectDangerousDialog },
  data() {
    return {
      peopleVisible: false,
      noticeVisible: false,
      dangerVisible: false,
      form: {},
      rules: {
        planName: { required: true, message: '必填' },
        checkNature: { required: true, message: '必填' },
        checkPersonName: { required: true, message: '必填' },
        checkDepartmentId: { required: true, message: '必填' },
        notificationPersonNames: { required: true, message: '必填' },
        planStartDate: { required: true, message: '必填' },
        dangerSourceNames: { required: true, message: '必填' },
        planEndDate: { required: true, message: '必填' }
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
    showNoticeDialog() {
      this.noticeVisible = true
    },
    showDangerDialog() {
      this.dangerVisible = true
    },
    choose(row) {
      // 根据人员选择确认手机号 张龙 3-30
      this.form = {
        ...this.form,
        ...{
          checkPersonId: row.id,
          checkPersonName: row.realName,
          checkPersonContact: row.mobile
        }
      }
    },
    chooseNotice(row) {
      this.form = {
        ...this.form,
        ...{
          notificationPersonIds: row.id,
          notificationPersonNames: row.realName,
          notificationPersonPhones: row.mobile
        }
      }
    },
    getDanger(row) {
      this.form = {
        ...this.form,
        ...{
          dangerSourceNames: row.map(r => r.dangerSource).join(','),
          dangerSourceIds: row.map(r => r.id).join(',')
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
