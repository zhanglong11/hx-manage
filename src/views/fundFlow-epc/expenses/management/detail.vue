<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>{{ form.planName }}</strong>
        </div>
        <div>
          <el-form label-width="150px">
            <el-row>
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
                  <!-- <b>{{ isNaN(form.totalAmount) ? '-' : form.totalAmount.toFixed(2) }}</b> -->
                  {{ isNaN(form.totalAmount) ? '-' : Number(form.totalAmount).toFixed(2) }}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="备注">
                  {{ form.remark || '无' }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="创建人">
                  {{ form.creatorName }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="创建时间">
                  {{ form.createTime }}
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
          >
            <vxe-table-column type="index" width="120" title="序号"></vxe-table-column>
            <vxe-table-column field="detailName" title="支出费用"></vxe-table-column>

            <vxe-table-column field="planAmount" title="预计支出金额(元)">
              <template v-slot="{ row }">
                {{ Number(row.planAmount).toFixed(2) }}
              </template>
            </vxe-table-column>
            <vxe-table-column field="actualAmount" title="实际支出金额(元)">
              <template v-slot="{ row }">
                {{ Number(row.actualAmount).toFixed(2) }}
              </template>
            </vxe-table-column>
            <vxe-table-column field="planRemark" title="备注">
              <template v-slot="{ row }">
                <div v-if="row.planRemark">计划备注：{{ row.planRemark }}</div>
                <div v-if="row.actualRemark">计划备注：{{ row.actualRemark }}</div>
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
      detailList: []
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
