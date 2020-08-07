<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>{{ id ? '编辑' : '新建' }}管理费用支出计划</strong>
        </div>
        <div>
          <el-form ref="form" :model="form" :rules="rules" class="form" label-width="180px">
            <el-row>
              <el-col :span="10">
                <el-form-item label="管理费用支出计划名称" prop="planName">
                  <el-input v-model="form.planName" placeholder="请输入计划名称" />
                </el-form-item>
                <el-form-item label="月份" prop="month">
                  <el-select
                    v-model="form.month"
                    style="width: 100%;"
                    placeholder="选择月"
                    :loading="monthLoading"
                    :loading-text="form.year ? '' : '请选择年份'"
                  >
                    <el-option
                      v-for="item of MonthList"
                      :key="item.value"
                      :disabled="item.disabled"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="年份" prop="year">
                  <el-date-picker
                    v-model="form.year"
                    value-format="yyyy"
                    type="year"
                    placeholder="选择年"
                    style="width: 100%;"
                    @change="handleYearChange"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="预计支出金额(元)">
                  <el-input v-model="total" placeholder="自动计算" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <!-- 收入计划明细start -->

      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>支出计划明细</strong>
          <el-button style="float: right;" type="primary" size="small" @click="handleAddDetailItem">新增</el-button>
        </div>
        <div>
          <vxe-table
            ref="xTable"
            resizable
            keep-source
            :edit-rules="validRules"
            :edit-config="{ trigger: 'manual', mode: 'row', showStatus: true, autoClear: false }"
            :data="detailList"
            show-footer
            :footer-method="footerMethod"
            :footer-span-method="footerColspanMethod"
          >
            <vxe-table-column type="index" width="120" title="序号"></vxe-table-column>
            <vxe-table-column field="detailName" title="支出费用" :edit-render="{ name: 'input' }"></vxe-table-column>
            <vxe-table-column
              field="planAmount"
              title="预计支出金额(元)"
              :edit-render="{ name: '$input', props: { type: 'number' } }"
            ></vxe-table-column>
            <vxe-table-column field="planRemark" title="备注" :edit-render="{ name: 'input' }"></vxe-table-column>
            <vxe-table-column title="操作">
              <template v-slot="{ row }">
                <template v-if="$refs.xTable.isActiveByRow(row)">
                  <vxe-button type="text" @click="saveRowEvent(row)">保存</vxe-button>
                  <vxe-button type="text" @click="cancelRowEvent(row)">取消</vxe-button>
                </template>
                <template v-else>
                  <vxe-button type="text" @click="editRowEvent(row)">编辑</vxe-button>
                  <vxe-button type="text" @click="removeRowEvent(row)">删除</vxe-button>
                </template>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
      </el-card>
    </div>
    <div class="footer-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import MonthList from '../../lib/month'
import compareTaskList from '@/utils/compareTaskList'
export default {
  data() {
    return {
      MonthList,
      projectId: localStorage.getItem('projectId'),
      total: null,
      id: this.$route.query.id || null,
      form: {},
      detailList: [],
      originDetailList: [],
      rules: {
        planName: [{ required: true, message: '请输入计划名称' }],
        month: [{ required: true, message: '请选择月份' }],
        year: [{ required: true, message: '请选择年份' }]
      },
      monthLoading: true,

      validRules: {
        detailName: [{ required: true, message: '请选择支出费用' }],
        planAmount: [{ required: true, message: '请输入预计支出金额' }]
      }
    }
  },

  created() {
    if (this.id) {
      this.init()
    }
  },
  methods: {
    async init() {
      if (!this.id) return
      let result = await this.axios.construction.get(`/fund/plan/get/${this.id}`)
      let { month, planName, remark, year, detailListVOList } = result.data || {}
      this.form = { month, planName, remark, year }
      this.detailList = detailListVOList || []
      this.originDetailList = _.cloneDeep(this.detailList)
      this.handleYearChange()
    },
    // 选择年时设置禁用已有计划项的月份
    async handleYearChange() {
      let params = {
        year: this.form.year,
        projectId: localStorage.getItem('projectId'),
        planType: 3
      }
      this.monthLoading = true
      let result = await this.axios.construction.post(`/fund/plan/availableMonth/get`, params)
      let disableList = result.data || []
      this.MonthList.forEach(item => {
        this.$set(item, 'disabled', disableList.includes(item.value))
        if (this.form.month && item.value === this.form.month) {
          // 编辑时设置当前月可用，避免修改月信息后无法还原
          this.$set(item, 'disabled', false)
        }
      })
      this.monthLoading = false
    },
    // 新增计划明细项
    async handleAddDetailItem() {
      let record = {
        contractId: '',
        contractName: '',
        detailName: '',
        planAmount: null,
        planRemark: '',
        id: new Date().getTime() //唯一标识符
      }
      this.detailList.push(record)
      let { row: newRow } = await this.$refs.xTable.insertAt(record, -1)
      await this.$refs.xTable.setActiveRow(record)
    },

    // 取消修改
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    // 保存修改,确认行数据已改变
    async saveRowEvent(row) {
      const errMap = await this.$refs.xTable.validate(row).catch(errMap => errMap)
      if (errMap) return
      this.$refs.xTable.clearActived()
    },
    // 编辑
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    // 删除明细
    removeRowEvent(row) {
      let index = _.findIndex(this.detailList, { id: row.id })
      this.detailList.splice(index, 1)
      this.$refs.xTable.remove(row)
    },
    countAllAmount(data) {
      this.total = this.XEUtils.sum(data.map(row => row.planAmount))
      return this.total
    },
    footerMethod({ columns, data }) {
      if (this.detailList.length === 0) return []
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return `总计:共 ${this.countAllAmount(data)} 元`
          }
        })
      ]
    },
    footerColspanMethod({ columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: 1,
          colspan: 5
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    async submit() {
      await this.$refs.form.validate()
      if (this.detailList && this.detailList.length === 0) {
        this.$message.warning('请设置计划明细')
        return
      }
      const errMap = await this.$refs.xTable.fullValidate().catch(errMap => errMap)
      if (errMap) return
      if (this.id) {
        //编辑操作
        this.saveEditInfo()
      } else {
        //添加操作
        this.saveAddInfo()
      }
    },
    async saveAddInfo() {
      const params = { ...this.form, detailAddDTOList: this.detailList, projectId: localStorage.getItem('projectId') }
      let result = await this.axios.construction.post(`/fund/plan/management/add`, params)
      if (result.code === 200) {
        this.$message.success('保存成功')
        this.$router.back()
      } else {
        this.handleYearChange()
      }
    },
    async saveEditInfo() {
      const params = {
        ...this.form,
        projectId: localStorage.getItem('projectId'),
        id: this.id
      }
      let { addTaskList, deleteIds, updateTaskList } = compareTaskList(this.detailList, this.originDetailList)
      params.deleteIds = deleteIds
      params.detailAddDTOList = addTaskList
      params.detailUpdateDTOList = updateTaskList
      let result = await this.axios.construction.post(`/fund/plan/management/update`, params)
      if (result.code === 200) {
        this.$message.success('保存成功')
        this.$router.back()
      } else {
        this.handleYearChange()
      }
    },
    cancel() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.vxe-table {
  /deep/ .vxe-footer--column {
    text-align: left !important;
    color: #333;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
