<template>
  <div class="is-Footer white">
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="奖惩" prop="type">
          <el-select v-model="form.type" class="inputStyle">
            <el-option v-for="item in rewardPunishTypeList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="奖惩名称" prop="name">
          <el-input v-model="form.name" class="inputStyle" />
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
            class="inputStyle"
          />
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentName">
          <el-input v-model="form.departmentName" disabled class="inputStyle" />
        </el-form-item>
        <el-form-item label="事由" prop="reason">
          <el-input v-model="form.reason" type="textarea" class="inputStyle" />
        </el-form-item>
        <el-form-item label="奖惩日期" prop="happenDate">
          <el-date-picker v-model="form.happenDate" value-format="yyyy-MM-dd" class="inputStyle" />
        </el-form-item>
        <el-form-item label="金额（元）" prop="money">
          <InputNumber v-model="form.money" class="inputStyle" />
        </el-form-item>
        <el-form-item label="上传" prop="fileIds">
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
import rewardPunishTypeList from '../../lib/rewardPunishTypeList'
import Api from '../../api'
export default {
  name: 'Edit',
  data() {
    return {
      rewardPunishTypeList,
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
      let res = await Api.rewardPunish.detail(this.$route.params.id, {})
      this.form = res.data
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.$route.params.id
            ? await Api.rewardPunish.update({ ...this.form })
            : await Api.rewardPunish.add({ ...this.form })
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
