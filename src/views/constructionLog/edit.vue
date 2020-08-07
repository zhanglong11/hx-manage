<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 10">
          <el-form ref="form" :model="form" :rules="rules" label-width="160px" class="form-con">
            <el-form-item label="编制日期" prop="diaryDate">
              <el-date-picker
                v-model="form.diaryDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item label="工程名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="项目负责人" prop="chargePersonId">
              <SelectUser
                :id.sync="form.chargePersonId"
                :value="form.chargePersonId ? { id: form.chargePersonId, label: form.chargePersonName } : null"
                :name.sync="form.chargePersonName"
                :multiple="false"
              />
            </el-form-item>
            <el-form-item label="施工人员" prop="constructionPersonIds">
              <SelectUser
                :id.sync="form.constructionPersonIds"
                :value="
                  form.constructionPersonIds
                    ? { id: form.constructionPersonIds, label: form.constructionPersonNames }
                    : null
                "
                :name.sync="form.constructionPersonNames"
                :multiple="true"
              />
            </el-form-item>
            <el-form-item label="施工人数">
              <InputNumberCommon
                :value="form.constructionPersonIds ? form.constructionPersonIds.split(',').length : 0"
                disabled
              />
            </el-form-item>
            <el-form-item label="上午温度℃" prop="morningWeather">
              <el-input v-model="form.morningWeather" disabled />
            </el-form-item>
            <el-form-item label="午间温度℃" prop="noonWeather">
              <el-input v-model="form.noonWeather" disabled />
            </el-form-item>
            <el-form-item label="下午温度℃" prop="afternoonWeather">
              <el-input v-model="form.afternoonWeather" disabled />
            </el-form-item>
            <el-form-item label="施工工程及内容" prop="costructionContent">
              <el-input v-model="form.costructionContent" class="form-input" type="textarea" />
            </el-form-item>
            <el-form-item label="质量情况" prop="qualityProblem">
              <el-input v-model="form.qualityProblem" type="textarea" />
            </el-form-item>
            <el-form-item label="安全情况" prop="safetyProblem">
              <el-input v-model="form.safetyProblem" type="textarea" />
            </el-form-item>
            <el-form-item label="进度情况" prop="constructionProgress">
              <el-input v-model="form.constructionProgress" type="textarea" />
            </el-form-item>
            <el-form-item label="物资设备进退场情况" prop="equipmentEnterExit">
              <el-input v-model="form.equipmentEnterExit" type="textarea" />
            </el-form-item>
            <el-form-item label="抄送人" prop="copyToPersonId">
              <SelectUser
                :id.sync="form.copyToPersonId"
                :value="form.copyToPersonId ? { id: form.copyToPersonId, label: form.copyToPersonName } : null"
                :name.sync="form.copyToPersonName"
                :multiple="false"
              />
            </el-form-item>
            <el-form-item label="附件" prop="fileIds">
              <FileEdit v-model="form.fileIds" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </component>
    <div v-if="!inDialog" class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button size="lg" type="primary" @click="submit(null)">保存</el-button>
    </div>
  </div>
</template>

<script>
import Api from './api/constructionLog'
export default {
  name: 'Edit',
  data() {
    return {
      id: null,
      form: {},
      inDialog: false,
      weatherInfo: {},
      rules: {
        diaryDate: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }],
        chargePersonId: [{ required: true, message: '必填' }],
        constructionPersonIds: [{ required: true, message: '必填' }],
        costructionContent: [{ required: true, message: '必填' }],
        qualityProblem: [{ required: true, message: '必填' }],
        safetyProblem: [{ required: true, message: '必填' }],
        constructionProgress: [{ required: true, message: '必填' }],
        equipmentEnterExit: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    },
    latitude() {
      return this.$store.state.project.latitude
    },
    longitude() {
      return this.$store.state.project.longitude
    }
  },
  created() {
    this.queryWeatherInfo()
  },
  methods: {
    async submit() {
      await this.$refs.form.validate()
      const form = _.cloneDeep(this.form)
      form.constructionPersonCount = form.constructionPersonIds.split(',').length
      await Api.add(form)
      this.$message.success('操作成功')
      this.goBack()
    },
    async queryWeatherInfo() {
      let params = {
        lat: this.latitude,
        lng: this.longitude
      }
      let result = await this.axios.post(`/weather/info`, params)
      this.form = {
        ...this.form,
        morningWeather: result.data.temperature,
        noonWeather: result.data.temperature,
        afternoonWeather: result.data.temperature
      }
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.inDialog {
  max-height: calc(100vh - 230px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
