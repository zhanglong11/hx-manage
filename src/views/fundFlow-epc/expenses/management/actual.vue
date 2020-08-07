<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>管理费用支出填报</strong>
        </div>
        <div>
          <el-form label-width="180px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="管理费用支出计划名称">
                  {{ form.planName }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年份">
                  {{ form.year }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="月份">
                  {{ $getLabel(MonthList, form.month) }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="预计支出金额(元)">
                  {{ isNaN(form.totalAmount) ? '-' : form.totalAmount.toFixed(2) }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="备注">
                  {{ form.remark || '无' }}
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
        </div>
        <div>
          <vxe-table
            ref="xTable"
            resizable
            show-footer
            :data="detailList"
            :footer-method="footerMethod"
            :footer-span-method="footerColspanMethod"
            keep-source
            :edit-rules="validRules"
            :edit-config="{ trigger: 'manual', mode: 'row', showStatus: true, autoClear: false }"
          >
            <vxe-table-column type="index" width="120" title="序号"></vxe-table-column>
            <vxe-table-column field="detailName" title="支出费用"></vxe-table-column>
            <vxe-table-column field="planAmount" title="预计支出金额(元)">
              <template v-slot="{ row }">
                {{ Number(row.planAmount).toFixed(2) }}
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="actualAmount"
              title="实际支出金额(元)"
              :edit-render="{ name: '$input', props: { type: 'number' } }"
            >
            </vxe-table-column>
            <vxe-table-column
              field="actualRemark"
              title="备注"
              :edit-render="{ name: 'input', immediate: true, attrs: { type: 'text' } }"
            >
            </vxe-table-column>
            <vxe-table-column title="操作">
              <template v-slot="{ row }">
                <template v-if="$refs.xTable.isActiveByRow(row)">
                  <vxe-button type="text" @click="saveRowEvent(row)">保存</vxe-button>
                  <vxe-button type="text" @click="cancelRowEvent(row)">取消</vxe-button>
                </template>
                <template v-else>
                  <vxe-button type="text" @click="editRowEvent(row)">编辑</vxe-button>
                </template>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
      </el-card>
    </div>
    <div class="footer-btn">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import MonthList from '../../lib/month'
export default {
  data() {
    return {
      MonthList,
      id: this.$route.query.id || '',
      form: {},
      detailList: [],
      validRules: {
        actualAmount: [{ required: true, message: '请输入实际支出金额' }]
      }
    }
  },

  created() {
    this.init()
  },
  methods: {
    async init() {
      if (!this.id) return
      let result = await this.axios.construction.get(`/fund/plan/get/${this.id}`)
      this.form = result.data || {}
      this.detailList = this.form.detailListVOList || []
      this.$refs.xTable.loadData(this.detailList)
    },

    countAllAmount(data, key = 'planAmount') {
      let total = this.XEUtils.sum(data.map(row => row[key]))
      return Number(total).toFixed(2)
    },
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return `总计:预计支出共${this.countAllAmount(data, 'planAmount')} 元，实际支出共${this.countAllAmount(
              data,
              'actualAmount'
            )}元`
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
    cancel() {
      this.$router.back()
    },
    // 取消修改
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        xTable.revertData(row)
      })
    },
    // 保存修改,确认行数据已改变
    async saveRowEvent(row) {
      console.log('row', row, row.actualRemark)
      const errMap = await this.$refs.xTable.validate(row).catch(errMap => errMap)
      if (errMap) return
      let params = [
        {
          id: row.id,
          actualAmount: row.actualAmount,
          actualRemark: row.actualRemark
        }
      ]
      let result = await this.axios.construction.post(
        `/fund/plan/management/detail/actualAmount/save/${this.id}`,
        params
      )
      if (result.code === 200) {
        this.$message.success('操作成功')
        this.$refs.xTable.clearActived()
        this.init()
      } else {
        this.cancelRowEvent(row)
      }
    },
    // 编辑
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    }
  }
}
</script>

<style lang="less" scoped>
.el-form-item {
  margin-bottom: 5px;
}

.vxe-table {
  /deep/ .vxe-footer--column {
    text-align: left !important;
    color: #333;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
