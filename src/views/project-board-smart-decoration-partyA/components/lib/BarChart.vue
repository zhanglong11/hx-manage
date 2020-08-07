<template>
  <div :id="container" style="height: 360px;"></div>
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
    // 配置
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    //y轴标题
    yName: {
      type: String,
      default: '万'
    }
  },
  data() {
    //这里存放数据
    return {}
  },
  watch: {
    options: {
      handler: function () {
        this.initChart()
      },
      deep: true
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    this.initChart()
  },
  //方法集合
  methods: {
    initChart() {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: this.options.color,
        legend: {
          data: this.options.legend,
          top: 10,
          right: 0,
          itemWidth: 15,
          itemHeight: 5,
          textStyle: {
            color: '#666'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: 'rgba(36,137,214,0.47)'
              }
            },
            axisLabel: {
              color: 'rgba(36,137,214,0.47)',
              fontSize: 12,
              formatter: function (val) {
                let newVal = val
                if (val.length > 5) {
                  newVal = val.substring(0, 4) + '...'
                }
                return newVal
              }
            }
          }
        ],
        yAxis: [
          {
            name: this.yName,
            nameTextStyle: {
              color: '#4a97ea',
              fontSize: 14
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(36,137,214,0.47)'
              }
            },
            data: this.options.xAxis,
            type: 'category',
            axisLabel: {
              color: '#4a97ea',
              fontSize: 14
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(74,127,234,0.32)'
              }
            }
          }
        ],
        series: this.options.series
      }
      this.$nextTick(() => {
        const myChart = Echarts.init(document.getElementById(this.container))
        myChart.setOption(option)
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
