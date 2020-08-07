<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        新建施工日志
      </div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="200px" class="form-con">
        <el-row :gutter="20" type="flex">
          <el-col :md="12">
            <el-row>
              <el-col :md="24">
                <el-form-item label="编制日期" prop="diaryDate">
                  <el-date-picker
                    v-model="formData.diaryDate"
                    style="width: 100%;"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择编制日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="项目负责人" prop="chargePersonId">
                  <SelectUser
                    :id.sync="formData.chargePersonId"
                    :multiple="false"
                    :value="
                      formData.chargePersonId ? { id: formData.chargePersonId, label: formData.chargePersonName } : null
                    "
                    :name.sync="formData.chargePersonName"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="施工人员" prop="constructionPersonIds">
                  <SelectUser
                    :id.sync="formData.constructionPersonIds"
                    :value="
                      formData.constructionPersonIds
                        ? { id: formData.constructionPersonIds, label: formData.constructionPersonNames }
                        : null
                    "
                    :name.sync="formData.constructionPersonNames"
                    @input="handleUserSelected"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="施工人数" prop="constructionPersonCount">
                  <el-input v-model="formData.constructionPersonCount" class="form-input" type="text" disabled />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="施工过程" prop="constructionProcess">
                  <el-input
                    v-model="formData.constructionProcess"
                    class="form-input"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="验收记录" prop="acceptanceRecord">
                  <el-input
                    v-model="formData.acceptanceRecord"
                    class="form-input"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="签收记录" prop="visaRecord">
                  <el-input
                    v-model="formData.visaRecord"
                    class="form-input"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="安全问题" prop="safetyProblem">
                  <el-input
                    v-model="formData.safetyProblem"
                    class="form-input"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="处理时间" prop="safetyHandleDate">
                  <el-date-picker
                    v-model="formData.safetyHandleDate"
                    style="width: 100%;"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择处理时间"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="处理意见" prop="safetyHandleOption">
                  <el-input
                    v-model="formData.safetyHandleOption"
                    class="form-input"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="处理过程" prop="safetyHandleProcess">
                  <el-input
                    v-model="formData.safetyHandleProcess"
                    class="form-input"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="处理人" prop="safetyHandlePersonId">
                  <SelectUser
                    :id.sync="formData.safetyHandlePersonId"
                    :multiple="false"
                    :value="
                      formData.safetyHandlePersonId
                        ? { id: formData.safetyHandlePersonId, label: formData.safetyHandlePersonName }
                        : null
                    "
                    :name.sync="formData.safetyHandlePersonName"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="处理结果" prop="safetyHandleResult">
                  <el-select v-model="formData.safetyHandleResult" placeholder="请选择活动区域" style="width: 100%;">
                    <el-option label="合格" value="1"></el-option>
                    <el-option label="不合格" value="2"></el-option>
                    <el-option label="未处理" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="抄送人">
                  <SelectUser
                    :id.sync="formData.copyToPersonId"
                    :multiple="false"
                    :value="
                      formData.copyToPersonId ? { id: formData.copyToPersonId, label: formData.copyToPersonName } : null
                    "
                    :name.sync="formData.copyToPersonName"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="附件" prop="fileId">
                  <el-input v-model="formData.fileIds" style="display: none;"></el-input>
                  <US :ids="formData.fileIds" :multiple="true" @input="fileChange" />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="备注">
                  <el-input
                    v-model="formData.remark"
                    class="form-input"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入备注信息"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :md="12">
            <el-row>
              <el-col :md="24">
                <el-form-item label="今日天气：上午温度℃">
                  <el-input v-model="formData.morningWeather" class="form-input" type="text" disabled />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="午间温度℃">
                  <el-input v-model="formData.noonWeather" class="form-input" type="text" disabled />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="午间温度℃">
                  <el-input v-model="formData.afternoonWeather" class="form-input" type="text" disabled />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="记录人员" prop="recordUserId">
                  <SelectUser
                    :id.sync="formData.recordUserId"
                    :multiple="false"
                    :value="
                      formData.recordUserId ? { id: formData.recordUserId, label: formData.recordUserName } : null
                    "
                    :name.sync="formData.recordUserName"
                  />
                  <!--                  <el-input-->
                  <!--                    v-model="formData.recordUserName"-->
                  <!--                    class="form-input"-->
                  <!--                    type="text"-->
                  <!--                    placeholder="请输入"-->
                  <!--                  />-->
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="施工进度" prop="constructionProgress">
                  <el-input
                    v-model="formData.constructionProgress"
                    class="form-input"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="变更记录" prop="changeRecord">
                  <el-input
                    v-model="formData.changeRecord"
                    class="form-input"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="待办事宜" prop="waitThing">
                  <el-input
                    v-model="formData.waitThing"
                    class="form-input"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="质量问题" prop="qualityProblem">
                  <el-input
                    v-model="formData.qualityProblem"
                    class="form-input"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="处理时间" prop="qualityHandleDate">
                  <el-date-picker
                    v-model="formData.qualityHandleDate"
                    style="width: 100%;"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择处理时间"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="处理意见" prop="qualityHandleOption">
                  <el-input
                    v-model="formData.qualityHandleOption"
                    class="form-input"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="处理过程" prop="qualityHandleProcess">
                  <el-input
                    v-model="formData.qualityHandleProcess"
                    class="form-input"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="处理人" prop="qualityHandlePersonId">
                  <SelectUser
                    :id.sync="formData.qualityHandlePersonId"
                    :multiple="false"
                    :value="
                      formData.qualityHandlePersonId
                        ? { id: formData.qualityHandlePersonId, label: formData.qualityHandlePersonName }
                        : null
                    "
                    :name.sync="formData.qualityHandlePersonName"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item label="处理结果" prop="qualityHandleResult">
                  <el-select v-model="formData.qualityHandleResult" placeholder="请选择活动区域" style="width: 100%;">
                    <el-option label="合格" value="1"></el-option>
                    <el-option label="不合格" value="2"></el-option>
                    <el-option label="未处理" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button type="primary" :loading="isLoading" size="lg" @click="save()">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
/*
 * 新建施工日志
 */
import Api from './api/constructionLog'
export default {
  name: 'NewConstructionLogSmartDecoration',
  components: {},
  data() {
    return {
      weatherInfo: {},
      id: this.$route.query.id,
      formData: {
        morningWeather: '',
        noonWeather: '',
        afternoonWeather: '',
        recordUserName: '',
        recordUserId: '',
        projectId: this.$store.state.project.projectId
      },
      isLoading: false,
      formRules: {
        diaryDate: [
          {
            required: true,
            message: '请选择编制日期',
            trigger: 'blur'
          }
        ],
        chargePersonId: [
          {
            required: true,
            message: '请选择项目负责人',
            trigger: 'blur'
          }
        ],
        constructionPersonIds: [
          {
            required: true,
            message: '请选择施工人员',
            trigger: 'blur'
          }
        ],
        // constructionPersonCount: [
        //   {
        //     required: true,
        //     message: '请输入',
        //     trigger: 'blur'
        //   }
        // ],
        constructionProcess: [
          {
            required: true,
            message: '请填写施工过程',
            trigger: 'blur'
          }
        ],
        acceptanceRecord: [
          {
            required: true,
            message: '请填写验收记录',
            trigger: 'blur'
          }
        ],
        visaRecord: [
          {
            required: true,
            message: '请填写签收记录',
            trigger: 'blur'
          }
        ],
        safetyProblem: [
          {
            required: true,
            message: '请填写安全问题',
            trigger: 'blur'
          }
        ],
        safetyHandleDate: [
          {
            required: true,
            message: '请选择处理时间',
            trigger: 'blur'
          }
        ],
        safetyHandleOption: [
          {
            required: true,
            message: '请填写处理意见',
            trigger: 'blur'
          }
        ],
        safetyHandleProcess: [
          {
            required: true,
            message: '请填写处理过程',
            trigger: 'blur'
          }
        ],
        safetyHandlePersonId: [
          {
            required: true,
            message: '请选择处理人',
            trigger: 'blur'
          }
        ],
        safetyHandleResult: [
          {
            required: true,
            message: '请选择处理结果',
            trigger: 'blur'
          }
        ],
        recordUserId: [
          {
            required: true,
            message: '请选择记录人员',
            trigger: 'blur'
          }
        ],
        constructionProgress: [
          {
            required: true,
            message: '请填写施工进度',
            trigger: 'blur'
          }
        ],
        changeRecord: [
          {
            required: true,
            message: '请填写变更记录',
            trigger: 'blur'
          }
        ],
        waitThing: [
          {
            required: true,
            message: '请填写待办事宜',
            trigger: 'blur'
          }
        ],
        qualityProblem: [
          {
            required: true,
            message: '请填写质量问题',
            trigger: 'blur'
          }
        ],
        qualityHandleDate: [
          {
            required: true,
            message: '请选择处理时间',
            trigger: 'blur'
          }
        ],
        qualityHandleOption: [
          {
            required: true,
            message: '请填写处理意见',
            trigger: 'blur'
          }
        ],
        qualityHandleProcess: [
          {
            required: true,
            message: '请填写处理过程',
            trigger: 'blur'
          }
        ],
        qualityHandlePersonId: [
          {
            required: true,
            message: '请选择处理人',
            trigger: 'blur'
          }
        ],
        qualityHandleResult: [
          {
            required: true,
            message: '请选择处理结果',
            trigger: 'blur'
          }
        ]
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
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    this.init()
    if (this.id) {
      this.getDetails()
    }
  },
  mounted() {},
  // 方法集合
  methods: {
    init() {
      this.queryConstructionPersonList()
      this.queryWeatherInfo()
    },
    getDetails() {
      Api.getLogDetail(this.id).then(res => {
        this.formData = res.data || {}
      })
    },
    // 获取工人信息
    async queryConstructionPersonList() {
      let params = {
        page: 1,
        row: 9999,
        projectId: this.projectId
      }
      let result = await this.axios.construction.post(`/labour/employee/list`, params)
      let list = result.data.records || []
      if (list.length === 0) {
        this.$message.warning('暂无施工人员信息')
      }
    },
    //选中施工人员，计算施工人数
    handleUserSelected(ids) {
      console.log(ids.length)
      this.formData.constructionPersonCount = ids ? ids.length : null
      // this.formData.constructionPersonCount = ids ? ids.split(',').length : null
    },
    // 获取天气信息
    async queryWeatherInfo() {
      let params = {
        lat: this.latitude,
        lng: this.longitude
      }
      let result = await this.axios.post(`/weather/info`, params)
      this.weatherInfo = result.data
      Object.assign(this.formData, {
        // recordUserName: this.$store.state.user.userName,
        // recordUserId: this.$store.state.user.userId,
        // todayWeather: this.weatherInfo.weather,
        morningWeather: this.weatherInfo.temperature,
        noonWeather: this.weatherInfo.temperature,
        afternoonWeather: this.weatherInfo.temperature
      })
      console.log(this.formData)
    },
    goBack() {
      this.$router.go(-1)
    },
    async save() {
      await this.$refs.formRef.validate()
      let res = this.id ? await Api.getLogUpdate(this.formData) : await Api.getLogAdd(this.formData)
      if (res.code === 200) {
        this.goBack()
      }
    },
    //上传附件
    fileChange(e, f) {
      if (e.length === 0) return (this.form.formData = '')
      this.formData.fileIds = e.map(item => item.id).join(',')
    }
  }
}
</script>

<style lang="less" scoped></style>
