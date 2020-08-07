<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="150px">
        <el-form-item label="培训主题" prop="trainTopic">
          <SelectList v-model="form.trainTopic" :hasAllOption="false" type="trainThemeType" />
        </el-form-item>
        <el-form-item label="培训类型" prop="trainType">
          <SelectList v-model="form.trainType" :hasAllOption="false" type="trainType" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="form.startTime" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="form.endTime" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="培训地点" prop="trainAddress">
          <el-input v-model="form.trainAddress" />
        </el-form-item>
        <el-form-item label="培训组织单位" prop="trainCompany">
          <el-input v-model="form.trainCompany" />
        </el-form-item>
        <el-form-item label="授课人" prop="lecturer">
          <el-input v-model="form.lecturer" />
        </el-form-item>
        <el-form-item label="接受培训单位" prop="recieveTrainCompany">
          <el-input v-model="form.recieveTrainCompany" />
        </el-form-item>
        <el-form-item label="接受培训人数" prop="recieveTrainNumber">
          <InputNumber v-model="form.recieveTrainNumber" />
        </el-form-item>
        <el-form-item label="考核合格人数" prop="passExaminationNumber">
          <InputNumber v-model="form.passExaminationNumber" />
        </el-form-item>
        <el-form-item label="培训内容（概括）" prop="trainContent">
          <el-input v-model="form.trainContent" type="textarea" />
        </el-form-item>
        <el-form-item label="上传" prop="files">
          <!--          bug 1416 张龙 3-31-->
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
import api from '@/api/safe/education/train'
export default {
  name: 'Edit',
  data() {
    return {
      planVisible: false,
      form: {},
      rules: {
        trainTopic: [{ required: true, message: '必填' }],
        trainType: [{ required: true, message: '必填' }],
        startTime: [{ required: true, message: '必填' }],
        endTime: [{ required: true, message: '必填' }],
        trainAddress: [{ required: true, message: '必填' }],
        trainCompany: [{ required: true, message: '必填' }],
        recieveTrainCompany: [{ required: true, message: '必填' }]
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
