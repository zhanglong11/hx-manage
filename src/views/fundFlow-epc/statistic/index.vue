<template>
  <div class="outContainer">
    <div class="tooltips">
      <el-form ref="filterForm" :model="filterForm" inline>
        <el-form-item label="类型">
          <el-checkbox-group v-model="filterForm.planTypeList" @change="handlePlanTypeChange">
            <el-checkbox-button v-for="item in planTypeList" :key="item.label" :label="item.value">{{
              item.label
            }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="time"
            type="monthrange"
            placeholder="选择月"
            format="yyyy-MM"
            value-format="yyyy-MM"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="handleCreateTimeChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-top: 10px;">
      <vxe-table ref="table" :data="list" show-footer :footer-method="footerMethod">
        <vxe-table-column type="index" title="序号" width="80" />
        <vxe-table-column field="year" title="年份" width="100" />
        <vxe-table-column field="month" title="月份" width="100">
          <template v-slot="{ row }">
            <span>{{ $getLabel(MonthList, row.month) }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="planIncomeMoney" title="预计收入金额(元)" min-width="200">
          <template v-slot="{ row }">
            <span>{{
              _.isNull(row.planIncomeMoney) || isNaN(row.planIncomeMoney) ? '-' : Number(row.planIncomeMoney).toFixed(2)
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="actualIncomeMoney" title="实际收入金额" min-width="200">
          <template v-slot="{ row }">
            <span>{{
              _.isNull(row.actualIncomeMoney) || isNaN(row.actualIncomeMoney)
                ? '-'
                : Number(row.actualIncomeMoney).toFixed(2)
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="planExpenditureMoney" title="预计支出金额(元)" min-width="200">
          <template v-slot="{ row }">
            <span>{{
              _.isNull(row.planExpenditureMoney) || isNaN(row.planExpenditureMoney)
                ? '-'
                : Number(row.planExpenditureMoney).toFixed(2)
            }}</span>
          </template>
        </vxe-table-column>

        <vxe-table-column field="actualExpenditureMoney" title="实际支出金额(元)" min-width="200">
          <template v-slot="{ row }">
            <span>{{
              _.isNull(row.actualExpenditureMoney) || isNaN(row.actualExpenditureMoney)
                ? '-'
                : Number(row.actualExpenditureMoney).toFixed(2)
            }}</span>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
    <!-- 图表区域 -->
    <div id="charts"></div>
  </div>
</template>

<script>
import MonthList from '@/views/fundFlow-epc/lib/month'
import planTypeList from '@/views/fundFlow-epc/lib/planType'
import moment from 'moment'
import echarts from 'echarts'
export default {
  data() {
    return {
      MonthList,
      planTypeList,
      time: [],
      filterFormBack: {},
      filterForm: {
        planTypeList: [],
        projectId: this.$store.state.project.projectId
      },
      list: [],
      // charts 参数
      incomeLegend: ['planIncomeMoney', 'actualIncomeMoney'],
      expensesLegend: ['planExpenditureMoney', 'actualExpenditureMoney'],
      legend: [],
      xAxis: [],
      series: {
        planIncomeMoney: [],
        actualIncomeMoney: [],
        planExpenditureMoney: [],
        actualExpenditureMoney: []
      },
      options: [
        {
          label: '预计收入',
          value: 'planIncomeMoney'
        },
        {
          label: '实际收入',
          value: 'actualIncomeMoney'
        },
        {
          label: '预计支出',
          value: 'planExpenditureMoney'
        },
        {
          label: '实际支出',
          value: 'actualExpenditureMoney'
        }
      ],
      chart: null //charts 实例
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  created() {
    Object.assign(this.filterFormBack, this.filterForm)
    this.init()
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    // 初始化图表
    initCharts() {
      this.chart = echarts.init(document.getElementById('charts'))
      let option = {
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            let template = `${params[0].name}<br>`
            for (const item of params) {
              template += `${item.seriesName}:${item.data > 1 ? item.data + '万' : item.data * 10000}<br>`
            }
            return template
          }
        },
        color: ['#3398DB', '#4fcb74', '#fbd438', '#ffa9ff'],
        legend: {
          bottom: 10,
          data: this.legend
        },
        toolbox: {
          show: true
        },
        calculable: true,
        xAxis: {
          type: 'category',
          data: this.xAxis,
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          lineStyle: {
            type: 'dashed'
          },
          axisLabel: {
            formatter: '{value} 万'
          }
        },
        series: []
      }
      this.chart.setOption(option)
    },
    // 数据请求完成后更新图表数据
    updateChartsInfo() {
      this.list.forEach(item => {
        this.xAxis.push(`${item.year}-${item.month}`)
        _.forEach(this.series, (val, key) => {
          //以万为单位
          val.push((item[key] && item[key] / 10000) || 0)
        })
      })
      let options = this.chart.getOption()
      let newOptions = {
        legend: {
          data: this.legend.map(item => {
            return this.$getLabel(this.options, item)
          })
        },
        xAxis: {
          data: this.xAxis
        },
        series: this.legend.map(item => {
          return {
            name: this.$getLabel(this.options, item),
            type: 'bar',

            data: this.series[item]
          }
        })
      }
      this.chart.setOption(Object.assign(options, newOptions), true)
    },
    // 数据请求时清空图表相关数据，以push新数据
    clearChartData() {
      this.xAxis = []
      this.series = {
        planIncomeMoney: [],
        actualIncomeMoney: [],
        planExpenditureMoney: [],
        actualExpenditureMoney: []
      }
    },
    // 初始化页面数据
    init() {
      this.filterForm.planTypeList = _.map(this.planTypeList, 'value')
      let year = moment().format('YYYY')
      let month = moment().format('MM')
      this.time = [`${year - 1}-${month}`, `${year}-${month}`]
      this.filterForm.endDate = `${year}-${month}-01 00:00:00`
      this.filterForm.startDate = `${year - 1}-${month}-01 00:00:00`
      this.handlePlanTypeChange()
    },
    // 选择创建日期
    handleCreateTimeChange(val) {
      this.filterForm.startDate = `${val[0]}-01 00:00:00`
      this.filterForm.endDate = `${val[1]}-01 00:00:00`
      this.refresh()
    },
    handlePlanTypeChange() {
      this.legend = []
      if (this.filterForm.planTypeList.includes('1')) {
        this.legend.push(...this.incomeLegend)
      }
      if (this.filterForm.planTypeList.includes('2') || this.filterForm.planTypeList.includes('3')) {
        this.legend.push(...this.expensesLegend)
      }
      this.refresh()
    },
    async refresh() {
      this.clearChartData()
      let result = await this.axios.construction.post('/fund/plan/analyze', this.filterForm)
      this.list = result.data || []
      console.log('list', this.list)
      this.updateChartsInfo()
    },
    reset() {
      this.time = null
      Object.assign(this.filterForm, this.filterFormBack)
      this.init()
    },
    countAllAmount(data) {
      this.form.money = this.XEUtils.sum(data.map(row => row.planAmount))
      return this.form.money
    },
    footerMethod({ columns, data }) {
      if (this.list.length === 0) return []
      let fileds = [...this.incomeLegend, ...this.expensesLegend]
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return `总计`
          } else if (fileds.includes(column.property)) {
            return Number(this.XEUtils.sum(data, column.property || 0)).toFixed(2)
          } else {
            return '-'
          }
        })
      ]
    }
  }
}
</script>

<style lang="less" scoped>
#charts {
  height: 500px;
  margin-top: 20px;
}
</style>
