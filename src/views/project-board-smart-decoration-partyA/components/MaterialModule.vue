<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="10">
        <div class="tooltips">
          <el-form ref="pageQuery" :model="filterForm" inline>
            <el-row>
              <el-col :span="24">
                <h3>材料库存</h3>
                <el-form-item label="">
                  <el-button type="primary" @click="selectMaterialBtn">选择材料</el-button>
                </el-form-item>
                <el-form-item label="">
                  <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate" />
                </el-form-item>
                <el-form-item>
                  <el-button-group>
                    <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
                    <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
                  </el-button-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
      <el-col :span="14">
        <LineChart></LineChart>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="10">
        <div class="tooltips">
          <el-form ref="pageQuery" :model="materialForm" inline>
            <el-row>
              <el-col :span="24">
                <h3>材料使用情况</h3>
                <el-form-item label="">
                  <el-button type="primary" @click="procurentVisible2 = true">选择材料</el-button>
                </el-form-item>
                <el-form-item label="">
                  <el-date-picker v-model="materialForm.month" type="month" placeholder="选择月"> </el-date-picker>
                  <!--                  <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate" />-->
                </el-form-item>
                <el-form-item>
                  <el-select v-model="materialForm.unit" placeholder="请选择单位">
                    <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button-group>
                    <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
                    <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
                  </el-button-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
      <el-col :span="14">
        <div>
          <BarChart container="jobStatistics" :options="jobChartOptions" y-name=""></BarChart>
        </div>
      </el-col>
    </el-row>
    <!--材料库存 start-->
    <ProcurentDialog
      v-if="procurentVisible"
      :visible="procurentVisible"
      @close="procurentVisible = false"
      @getTarget="getTarget"
    >
    </ProcurentDialog>
    <!--材料库存 end-->
    <!--材料使用情况 start-->
    <ProcurentMultipleDialog
      v-if="procurentVisible2"
      :visible="procurentVisible2"
      @close="procurentVisible2 = false"
      @getTarget="getTargetMultiple"
    >
    </ProcurentMultipleDialog>
    <!--材料使用情况 end-->
  </div>
</template>

<script>
import ProcurentDialog from './lib/ProcurentDialog'
import ProcurentMultipleDialog from './lib/ProcurentMultipleDialog'
import LineChart from '@/views/project-board-smart-decoration-partyA/components/lib/LineChart'
import BarChart from '@/views/project-board-smart-decoration-partyA/components/lib/BarChart'
export default {
  name: 'MaterialModule',
  components: {
    ProcurentDialog,
    ProcurentMultipleDialog,
    LineChart,
    BarChart
  },
  data() {
    return {
      //库存form
      filterForm: {},
      //材料使用情况
      materialForm: {},
      purchaseList: [],
      procurentVisible: false,
      procurentVisible2: false,
      //选择单位
      unitList: [
        {
          value: '1',
          label: '克'
        }
      ],
      jobChartOptions: {
        color: ['#2099ea', '#4ecb73'],
        legend: ['计划', '实际'],
        xAxis: [],
        series: [
          {
            name: '计划',
            type: 'bar',
            stack: 'total',
            barWidth: 10,
            data: []
          },
          {
            name: '实际',
            type: 'bar',
            stack: 'total',
            barWidth: 10,
            data: []
          }
        ]
      }
    }
  },
  created() {
    this.getMateialData()
  },
  methods: {
    refresh() {},
    reset() {},
    selectMaterialBtn() {
      this.procurentVisible = true
    },
    getMateialData() {
      this.jobChartOptions.xAxis = ['材料1', '材料2', '材料3', '材料5', '材料6']
      this.jobChartOptions.series[0].data = ['20', '40', '30', '60', '37', '80']
      this.jobChartOptions.series[1].data = ['30', '50', '20', '40', '50', '20']
    },
    //材料库存弹窗数据
    getTarget(e) {
      console.log(e)
    },
    //材料使用情况弹窗数据
    getTargetMultiple(e) {
      console.log('多选', e)
    }
  }
}
</script>

<style scoped lang="less">
h3 {
  margin: 20px 0 10px 0;
}
</style>
