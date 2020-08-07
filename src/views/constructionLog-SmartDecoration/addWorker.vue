<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        新建施工日志(施工员版)
      </div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="200px" class="form-con">
        <el-row :gutter="20" type="flex">
          <el-col :md="12">
            <el-form-item label="今日天气">
              <el-input v-model="formData.todayWeather" class="form-input" type="text" disabled />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <!--            <el-form-item label="上午温度℃">-->
            <!--              <el-input v-model="formData.morningWeather" class="form-input" type="text" disabled />-->
            <!--            </el-form-item>-->
            <el-form-item label="温度℃">
              <el-input v-model="formData.weather" class="form-input" type="text" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <!--        <el-row :gutter="20" type="flex">-->
        <!--          <el-col :md="12">-->
        <!--            <el-form-item label="午间温度℃">-->
        <!--              <el-input v-model="formData.noonWeather" class="form-input" type="text" disabled />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--          <el-col :md="12">-->
        <!--            <el-form-item label="下午温度℃">-->
        <!--              <el-input v-model="formData.afternoonWeather" class="form-input" type="text" disabled />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-row :gutter="20">
          <el-col :md="24">
            <div class="task-list">
              <div style="margin: 15px 0;">
                <el-button type="primary" @click="seletedWorkerVisible = true">选择工种</el-button>
              </div>
              <div>
                <vxe-table
                  ref="xTree"
                  border
                  resizable
                  show-overflow
                  :data="tableData"
                  :span-method="rowspanMethod"
                  :edit-rules="validRules"
                  :edit-config="{ trigger: 'click', mode: 'cell' }"
                >
                  <!--                  <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>-->
                  <vxe-table-column field="workTypeName" title="施工工种"> </vxe-table-column>
                  <vxe-table-column field="workTypeName" title="施工人数">
                    <template v-slot="{ row }">{{ getConstructerNumber(row) }}</template>
                  </vxe-table-column>
                  <vxe-table-column field="constructionPersonName" title="施工人员">
                    <template v-slot="{ row }"
                      >{{ row.constructionPersonName }}
                      <i class="el-icon-remove" style="color: #f56c6c; cursor: pointer;" @click="removeUser(row)"></i
                    ></template>
                  </vxe-table-column>
                  <vxe-table-column
                    field="areaResponsible"
                    title="负责区域"
                    :edit-render="{ name: '$input' }"
                  ></vxe-table-column>
                  <!--                  <vxe-table-column field="set" title="操作">-->
                  <!--                    <template v-slot="{ row }">-->
                  <!--                      <span style="margin: 0 3px"><a @click="remove(row)">删除</a></span>-->
                  <!--                    </template>-->
                  <!--                  </vxe-table-column>-->
                </vxe-table>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :md="12">
            <el-form-item label="今日施工完成工作面" prop="floorScheduleNames">
              <!--              <el-input :value="formData.floorScheduleNames" disabled>-->
              <!--                <el-button slot="append" icon="el-icon-plus" @click="showTargetDialog">选择</el-button>-->
              <!--              </el-input>-->
              <el-input v-model="formData.floorScheduleNames" class="form-input" type="input" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="发现问题">
              <el-input
                v-model="formData.findProblem"
                class="form-input"
                type="textarea"
                :rows="4"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="解决方案">
              <el-input v-model="formData.solution" class="form-input" type="textarea" :rows="4" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="解决时间">
              <el-date-picker
                v-model="formData.solveTime"
                style="width: 100%;"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择处理时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="发送到人" prop="copyToPersonIds">
              <SelectUser
                :id.sync="formData.copyToPersonIds"
                :value="
                  formData.copyToPersonIds ? { id: formData.copyToPersonIds, label: formData.copyToPersonNames } : null
                "
                :name.sync="formData.copyToPersonNames"
                @input="changeUserVal"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="附件" prop="fileId">
              <el-input v-model="formData.fileIds" style="display: none;"></el-input>
              <US :ids="formData.fileIds" :multiple="true" @input="fileChange" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="备注">
              <el-input
                v-model="formData.remark"
                class="form-input"
                type="textarea"
                :rows="4"
                maxlength="200"
                show-word-limit
                placeholder="请输入备注信息"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button type="primary" :loading="isLoading" size="lg" @click="save()">保存</el-button>
    </div>
    <!--选择工序-->
    <SelectProcess :visible.sync="targetVisible" @getTarget="getTarget" />
    <!--选择工种-->
    <SelectWorkerDialog
      v-if="seletedWorkerVisible"
      :visible.sync="seletedWorkerVisible"
      @close="seletedWorkerVisible = false"
      @getTarget="getWorkTypeList"
    ></SelectWorkerDialog>
  </div>
</template>

<script>
/*
 * 新建施工日志
 */
import Api from './api/constructionLog'
import XEUtils from 'xe-utils'
import SelectProcess from './components/SelectProcess'
import SelectWorkerDialog from './components/SelectWorkerDialog'
export default {
  name: 'NewConstructionLogSmartDecoration',
  components: { SelectProcess, SelectWorkerDialog },
  data() {
    return {
      weatherInfo: {},
      id: this.$route.query.id,
      //选择工序
      targetVisible: false,
      //选择工种弹窗
      seletedWorkerVisible: false,
      workTypeName: '',
      formData: {
        // morningWeather: '',
        // noonWeather: '',
        // afternoonWeather: '',
        highTemperature: '',
        lowTemperature: ' ',
        weather: ' ',
        floorScheduleIds: '',
        floorScheduleNames: '',
        projectId: this.$store.state.project.projectId,
        type: 1,
        findProblem: '',
        solution: ''
      },
      //表格验证
      validRules: {
        workTypeName: [{ required: true, message: '请选择施工工种' }],
        constructionPersonName: [{ required: true, message: '请选择施工人员' }],
        areaResponsible: [{ required: true, message: '请填写负责区域' }]
      },
      tableData: [],
      isLoading: false,
      formRules: {
        copyToPersonIds: [
          {
            required: true,
            message: '请选择发送人',
            trigger: 'change'
          }
        ]

        // floorScheduleNames: [
        //   {
        //     required: true,
        //     message: '请选择施工完成工序',
        //     trigger: 'change'
        //   }
        // ]
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
  },
  mounted() {},
  // 方法集合
  methods: {
    init() {
      this.queryConstructionPersonList()
      this.queryWeatherInfo()
    },
    //选择工序弹窗
    showTargetDialog() {
      this.targetVisible = true
    },
    //选择发送人之后清空提示语
    changeUserVal(val) {
      if (this.formData.copyToPersonIds) {
        this.$refs.formRef.clearValidate('copyToPersonIds')
      }
    },
    //获取选择工序值
    getTarget(e) {
      // console.log(e)
      this.formData.floorScheduleIds = e.id
      this.formData.floorScheduleNames = e.label
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
    /*获取工种*/
    getWorkTypeList(e) {
      // console.log('获取工种信息', e)
      let checkedVal = e.checked
      let names = checkedVal.constructionPersonNames.split(',')
      let values = checkedVal.constructionPersonIds.split(',')
      let rows = names.map((item, index) => {
        return {
          workTypeName: checkedVal.workTypeName,
          workTypeId: checkedVal.workTypeId,
          constructerNumber: names.length,
          areaResponsible: '',
          constructionPersonName: item,
          constructionPersonId: values[index]
        }
      })
      let checkedData = [...this.tableData, ...rows]
      let checkedSortByData = _.orderBy(checkedData, ['workTypeName'], ['asc'])
      this.tableData = _.unionBy(
        _.filter(checkedSortByData, item => item.constructionPersonName),
        'constructionPersonName'
      )
      // console.log('tableData', this.tableData)
    },
    //选中施工人员，计算施工人数
    getConstructerNumber(row) {
      let val = _.filter(this.tableData, item => item.workTypeName === row.workTypeName)
      return val.length
    },
    // 通用行合并函数（将相同多列数据合并为一行）
    rowspanMethod({ row, $rowIndex, column, data }) {
      let fields = ['workTypeName']
      let cellValue = row[column.property]
      if (cellValue && fields.includes(column.property)) {
        let prevRow = data[$rowIndex - 1]
        let nextRow = data[$rowIndex + 1]
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = data[++countRowspan + $rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
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
        todayWeather: this.weatherInfo.weather,
        // morningWeather: this.weatherInfo.temperature,
        // noonWeather: this.weatherInfo.temperature,
        // afternoonWeather: this.weatherInfo.temperature
        highTemperature: this.weatherInfo.highTemperature,
        lowTemperature: this.weatherInfo.lowTemperature,
        weather: this.weatherInfo.lowTemperature + ' ~ ' + this.weatherInfo.highTemperature
      })
      console.log(this.formData)
    },
    goBack() {
      this.$router.go(-1)
    },
    async save() {
      try {
        if (!this.formData.findProblem) {
          this.formData.findProblem = '无'
        }
        if (!this.formData.solution) {
          this.formData.solution = '无'
        }
        let obj = { ...this.formData, ...{ personAddList: this.tableData } }
        if (!obj.personAddList.length) {
          this.$message.info('请选择工种')
          return
        }
        await this.$refs.formRef.validate()
        await this.$refs.xTree.validate()
        this.isLoading = true
        let res = await Api.getLogAdd(obj)
        if (res.code === 200) {
          this.goBack()
          this.isLoading = false
        }
      } catch (e) {
        this.isLoading = false
      }
    },
    //上传附件
    fileChange(e, f) {
      if (e.length === 0) return (this.formData.fileIds = '')
      this.formData.fileIds = e.map(item => item.id).join(',')
    },
    remove(row) {
      console.log(row)
      this.$refs.xTree.remove(row)
    },

    //删除人员
    removeUser(row) {
      this.$confirm('是否删除此项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$refs.xTree.remove(row)
          this.tableData = _.filter(this.tableData, item => item._XID !== row._XID)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped></style>
