<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>{{ id ? '编辑' : '新建' }}收入计划</strong>
          <el-button style="float: right; padding: 3px 0;" type="text" />
        </div>
        <div>
          <el-form ref="form" :model="form" :rules="rules" class="form" label-width="150px">
            <el-row>
              <el-col :span="10">
                <el-form-item label="收入计划名称" prop="planName">
                  <el-input v-model="form.planName" placeholder="请输入收入计划名称" />
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

                <el-form-item label="预计收入金额(元)">
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
          <strong>收入计划明细</strong>
          <el-button style="float: right;" type="primary" size="small" @click="handleAddDetailItem">新增</el-button>
        </div>
        <div>
          <vxe-table
            ref="xTable"
            resizable
            :edit-rules="validRules"
            :edit-config="{ trigger: 'manual', mode: 'row', showStatus: true, autoClear: false }"
            :data="detailList"
            show-footer
            keep-source
            :footer-method="footerMethod"
            :footer-span-method="footerColspanMethod"
          >
            <vxe-table-column type="index" width="120" title="序号"></vxe-table-column>
            <vxe-table-column field="detailName" title="收入费用" :edit-render="{ name: 'input' }"></vxe-table-column>
            <vxe-table-column field="contractName" title="关联合同" :edit-render="{}">
              <template v-slot:edit="{ row }">
                <el-link :type="row.contractName ? 'primary' : 'info'" @click="handleShowContractDialog(row)">{{
                  row.contractName || '请选择关联合同'
                }}</el-link>
              </template>
              <template v-slot="{ row }">
                <el-link type="primary" @click="handleShowContractDialog(row)">{{ row.contractName }}</el-link>
              </template>
            </vxe-table-column>
            <vxe-table-column field="planTime" title="预计收入时间" width="200" :edit-render="{}">
              <template v-slot:edit="{ row }">
                <el-date-picker
                  v-model="row.planTime"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                ></el-date-picker>
              </template>
              <template v-slot="{ row }">{{ row.planTime | formatData }}</template>
            </vxe-table-column>
            <vxe-table-column
              field="planAmount"
              title="预计收入金额(元)"
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
    <!-- 选择合同 -->
    <ContractDialog
      v-if="contractVisible"
      :visible="contractVisible"
      role="secondPartyId"
      :status="5"
      :contractID="activeContractID"
      @close="contractVisible = false"
      @submit="getContract"
    />
  </div>
</template>

<script>
import MonthList from '../../lib/month'
import ContractDialog from '../../components/ContractDialog'
export default {
  components: { ContractDialog },
  data() {
    return {
      MonthList,
      projectId: localStorage.getItem('projectId'),
      id: this.$route.query.id || '',
      total: null,
      form: {},
      rules: {
        planName: [{ required: true, message: '请输入收入计划名称', trigger: 'blur' }],
        month: [{ required: true, message: '请选择月份', trigger: 'change' }],
        year: [{ required: true, message: '请选择年份', trigger: 'change' }]
      },
      detailList: [],
      validRules: {
        detailName: [{ required: true, message: '请选择收入费用' }],
        planAmount: [{ required: true, message: '请输入预计收入金额' }],
        planTime: [{ required: true, message: '请输入预计收入时间' }],
        contractName: [{ required: true, message: '请选择关联合同' }]
      },
      monthLoading: true,
      // 选择合同相关
      contractVisible: false,
      activeContractID: '', //当前编辑项的合同ID
      activeRowID: '' //用来选择合同后找回当前编辑项
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
      let { month, planName, remark, year } = result.data || {}
      this.form = { month, planName, remark, year }
      this.handleYearChange()
      this.detailList = result.data.detailListVOList || []
    },
    // 选择年时设置禁用已有计划项的月份
    async handleYearChange() {
      let params = {
        year: this.form.year,
        projectId: localStorage.getItem('projectId'),
        planType: 1
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
    // 新增收入计划明细项
    async handleAddDetailItem() {
      let record = {
        contractId: '',
        contractName: '',
        detailName: '',
        planAmount: null,
        planRemark: '',
        planTime: '',
        guid: new Date().getTime() //唯一标识符
      }
      this.detailList.push(record)
      this.activeRowID = record.guid
      let { row: newRow } = await this.$refs.xTable.insertAt(record, -1)
      await this.$refs.xTable.setActiveRow(record)
    },
    //选择关联合同
    handleShowContractDialog(row) {
      this.activeContractID = row.contractId
      this.contractVisible = true
    },
    // 选择合同完成
    getContract(row) {
      // 获取当前编辑的item
      let record = _.find(this.detailList, { guid: this.activeRowID })
      record.contractName = row.name
      record.contractId = row.id
      this.contractVisible = false
      this.$refs.xTable.setActiveRow(record)
    },
    // 取消修改
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    // 保存修改
    async saveRowEvent(row) {
      const errMap = await this.$refs.xTable.validate(row).catch(errMap => errMap)
      if (errMap) return
      this.$refs.xTable.clearActived()
    },
    // 编辑
    editRowEvent(row) {
      this.activeRowID = row.guid
      this.$refs.xTable.setActiveRow(row)
    },
    // 删除明细
    removeRowEvent(row) {
      let index = _.findIndex(this.detailList, { guid: row.guid })
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
          colspan: 7
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
      const params = { ...this.form, detailAddDTOList: this.detailList, projectId: localStorage.getItem('projectId') }
      let url = this.id ? `/fund/plan/update` : `/fund/plan/income/add`
      params.id = this.id

      let result = await this.axios.construction.post(url, params)
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
