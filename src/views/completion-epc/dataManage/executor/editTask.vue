<template>
  <div class="container no-padding">
    <el-card>
      <el-row :gutter="15">
        <el-col :span="10">
          <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="form-con">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="form.name" class="form-input" />
            </el-form-item>

            <el-form-item label="操作人" prop="executorId">
              <SelectUser
                :id.sync="form.executorId"
                :value="form.executorId ? { id: form.executorId, label: form.executorName } : null"
                :name.sync="form.executorName"
                :multiple="false"
              />
            </el-form-item>

            <el-form-item label="计划开始时间" prop="planStartTime">
              <el-date-picker
                v-model="form.planStartTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                style="width: 100%;"
              />
            </el-form-item>

            <el-form-item label="计划结束时间" prop="planEndTime">
              <el-date-picker
                v-model="form.planEndTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                style="width: 100%;"
              />
            </el-form-item>

            <el-form-item label="工期" prop="duration">
              <InputNumberCommon :value="moment(form.planEndTime).diff(moment(form.planStartTime), 'days')" disabled />
            </el-form-item>
            <el-form-item label="文件是否归档" prop="archiveFlag">
              <el-radio-group v-model="form.archiveFlag">
                <el-radio v-for="item in toggleArchive" :key="item.value" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注说明" prop="remark">
              <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button size="lg" type="primary" @click="submit(null)">保存</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../../api/executor'
import toggleArchive from './lib/toggleArchive'
export default {
  name: 'Edit',
  data() {
    return {
      id: null,
      pid: null,
      form: {},
      toggleArchive,
      rules: {
        name: [{ required: true, message: '必填' }],
        models: [{ required: true, message: '必填' }],
        unit: [{ required: true, message: '必填' }],
        type: [{ required: true, message: '必填' }],
        source: [{ required: true, message: '必填' }],
        location: [{ required: true, message: '必填' }],
        supplier: [{ required: true, message: '必填' }],
        manufacturer: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    let { id, pid } = this.$route.params
    this.id = id
    this.pid = pid
    console.log(id, pid)
    this.refresh()
  },
  methods: {
    async refresh() {
      if (!this.id) return
      const res = await Api.detailFile(this.id)
      console.log(res.data)
      this.form = res.data
    },
    async submit() {
      await this.$refs.form.validate()
      let form = _.cloneDeep(this.form)
      form.duration = moment(form.planEndTime).diff(form.planStartTime, 'days')
      this.id ? await Api.updateTask({ ...form, pid: this.pid }) : await Api.addTask({ ...form, pid: this.pid })
      this.$message.success('操作成功')
      this.$router.go(-1)
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped></style>
