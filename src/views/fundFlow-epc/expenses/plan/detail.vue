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
                  {{ isNaN(form.totalAmount) ? '-' : Number(form.totalAmount).toFixed(2) }}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="备注">
                  {{ form.remark }}
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
            <vxe-table-column field="contractName" title="关联合同">
              <template v-slot="{ row }">
                <el-link type="primary" @click="toContractDetail(row.contractId)">{{ row.contractName }}</el-link>
              </template>
            </vxe-table-column>
            <vxe-table-column field="planTime" title="预计支出时间"></vxe-table-column>
            <vxe-table-column field="planAmount" title="预计支出金额(元)">
              <template v-slot="{ row }">
                {{ Number(row.planAmount).toFixed(2) }}
              </template>
            </vxe-table-column>
            <vxe-table-column field="planRemark" title="备注"></vxe-table-column>
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
      console.log('detail', this.form)
      this.detailList = this.form.detailListVOList || []
    },
    // 查看合同详情
    toContractDetail(id) {
      this.$router.push({ name: `ContractDetail`, params: { id: id, isCheck: false } })
    },

    countAllAmount(data) {
      let total = this.XEUtils.sum(data.map(row => row.planAmount))
      return total
    },
    footerMethod({ columns, data }) {
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
          colspan: 6
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
