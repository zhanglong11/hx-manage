<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="奖惩" prop="type">
          <SelectList v-model="form.type" :hasAllOption="false" type="rewardPunishType" />
        </el-form-item>
        <el-form-item label="奖惩名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="奖惩人员" prop="personnelId">
          <!--          人员选择功能修改-->
          <SelectUser
            :id.sync="form.personnelId"
            :value="
              form.personnelId
                ? {
                    id: form.personnelId,
                    label: form.personnelName,
                    departId: form.departmentId,
                    departName: form.departmentName
                  }
                : null
            "
            :name.sync="form.personnelName"
            :departId.sync="form.departmentId"
            :departName.sync="form.departmentName"
            :multiple="false"
          />
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentName">
          <el-input v-model="form.departmentName" disabled />
        </el-form-item>
        <el-form-item label="事由" prop="reason">
          <el-input v-model="form.reason" type="textarea" />
        </el-form-item>
        <el-form-item label="奖惩日期" prop="happenDate">
          <el-date-picker v-model="form.happenDate" value-format="yyyy-MM-dd" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="金额（元）" prop="money">
          <InputNumber v-model="form.money" />
        </el-form-item>
        <el-form-item label="上传" prop="fileIds">
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
import api from '@/api/quality/control/rewardPunishment'
export default {
  name: 'Edit',
  data() {
    return {
      form: {},
      rules: {
        name: [{ required: true, message: '必填' }],
        personnelId: [{ required: true, message: '必填' }],
        reason: [{ required: true, message: '必填' }],
        happenDate: [{ required: true, message: '必填' }],
        money: [{ required: true, message: '必填' }],
        type: [{ required: true, message: '必填' }]
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
