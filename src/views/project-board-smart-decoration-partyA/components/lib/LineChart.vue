<template>
  <div>
    <ul class="fundListTab">
      <li :class="{ active: lineChartTab === 'month' }" @click="lineChartTab = 'month'">月度</li>
      <li :class="{ active: lineChartTab === 'year' }" @click="lineChartTab = 'year'">年度</li>
    </ul>
    <div :id="container" style="height: 260px;"></div>
  </div>
</template>

<script>
import Echarts from 'echarts'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    // 图表容器
    container: {
      type: String,
      default: 'echartBar'
    },
    // 是否是空心
    isHollow: {
      type: Boolean,
      default: false
    },
    // 显示图例
    isLegend: {
      type: Boolean,
      default: true
    },
    // 配色
    color: {
      type: Array,
      default: () => {
        return ['#22f1cd', '#2ebeff']
      }
    },
    // 默认数据
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    //这里存放数据
    return {
      lineChartTab: 'month'
    }
  },
  watch: {
    dataList() {
      this.initChart()
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.initChart()
  },
  //方法集合
  methods: {
    initChart() {
      let option = {
        tooltip: {},
        dataset: {
          source: []
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'rgba(36,137,214,0.47)'
            }
          }
        },
        yAxis: {
          name: '万',
          nameTextStyle: {
            color: '#4a97ea'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(74,127,234,0.32)'
            }
          },
          axisLabel: {
            show: true,
            fontSize: 14,
            color: '#4a97ea',
            formatter: '{value}'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(74,127,234,0.32)'
            }
          }
        },
        series: [
          {
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#11b4dc'
            },
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  type: 'linear',
                  global: false,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(162,215,241,0.5)'
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(162,215,241,0)'
                    }
                  ]
                },
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            }
          },
          {
            type: 'line',
            smooth: true,
            itemStyle: {
              color: 'rgba(24,220,17,0.35)'
            },
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  type: 'linear',
                  global: false,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(24,220,17,0.5)'
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(24,220,17,0)'
                    }
                  ]
                },
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            }
          }
        ]
      }
      option.dataset.source = [
        { product: '1月', count: 223, score: 134.8 },
        { product: '2月', count: 435, score: 545.4 },
        { product: '3月', count: 1042, score: 856.2 },
        { product: '4月', count: 988, score: 999.9 }
      ]
      this.$nextTick(() => {
        const myChart = Echarts.init(document.getElementById(this.container))
        myChart.setOption(option)
      })
    }
  }
}
</script>
<style lang="less" scoped>
@blue: #2489d6;
@yellow: #fddd02;
.fundListTab {
  display: flex;
  justify-content: flex-end;
  position: relative;
  top: 10px;
  right: 46px;
  z-index: 1000;
  li {
    padding: 4px 3px;
    cursor: pointer;
    &.active {
      border-bottom: 2px solid @blue;
      color: @blue;
    }
  }
  li:first-child {
    margin-right: 10px;
  }
}
</style>
