<template>
  <div class="container no-padding">
    <el-card>
      <el-row :gutter="15">
        <el-col :span="10">
          <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="form-con">
            <el-form-item label="申报文件名称" prop="name">
              <el-input v-model="form.name" class="form-input" />
            </el-form-item>

            <el-form-item label="报审单位" prop="reportingUnit">
              <el-input v-model="form.reportingUnit" class="form-input" />
            </el-form-item>

            <el-form-item label="执行人" prop="executorId">
              <SelectUser
                :id.sync="form.executorId"
                :appendToBody="true"
                :value="form.executorId ? { id: form.executorId, label: form.executorName } : null"
                :name.sync="form.executorName"
                :multiple="false"
              />
            </el-form-item>

            <el-form-item label="负责人" prop="principalId">
              <SelectUser
                :id.sync="form.principalId"
                :appendToBody="true"
                :value="form.principalId ? { id: form.principalId, label: form.principalName } : null"
                :name.sync="form.principalName"
                :multiple="false"
              />
            </el-form-item>

            <el-form-item label="注意事项" prop="precautions">
              <el-input v-model="form.precautions" type="textarea" />
            </el-form-item>

            <el-form-item label="是否归档" prop="archiveFlag">
              <el-radio-group v-model="form.archiveFlag">
                <el-radio v-for="item in toggleArchive" :key="item.value" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
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
      form: {
        archiveFlag: 1,
        type: 2
      },
      toggleArchive,
      rules: {
        name: [{ required: true, message: '必填' }],
        reportingUnit: [{ required: true, message: '必填' }],
        executorId: [{ required: true, message: '必填' }],
        principalId: [{ required: true, message: '必填' }],
        archiveFlag: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    let { id } = this.$route.params
    this.id = id
    this.refresh()
  },
  methods: {
    async refresh() {
      if (!this.id) return
      const res = await Api.detailFile(this.id)
      this.form = res.data
    },
    async submit() {
      await this.$refs.form.validate()
      let form = _.cloneDeep(this.form)
      this.id ? await Api.updateFile(form) : await Api.addFile(form)
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
