<template>
  <div>
    <!-- 图例 -->
    <div class="legend">
      <el-row :gutter="4">
        <el-col :span="8">
          <ul>
            <li class="ing dot">进行中</li>
            <li class="not-started dot">未开始</li>
            <li class="finished dot">已完成</li>
          </ul>
        </el-col>
        <el-col :span="8">
          <p class="center project-title">
            {{ !activeMilestoneId ? '里程碑任务列表' : activeMilestone.name }}
          </p>
        </el-col>
        <el-col v-show="activeMilestoneId" :span="8" class="center">
          <el-button type="primary" @click="goBack">回到主线</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="flow-canvas" :style="{ minHeight: height + 'px' }">
      <div v-show="activeMilestoneId" class="flow-canvas-arrows-left">
        <i v-show="activeMilestoneIndex !== 0" class="el-icon-arrow-left" @click="prev"></i>
      </div>
      <div v-show="activeMilestoneId" class="flow-canvas-arrows-right">
        <i
          v-show="activeMilestoneIndex !== list.filter(e => !e.parentTaskUniqueId).length - 1"
          class="el-icon-arrow-right"
          @click="next"
        ></i>
      </div>
      <div :id="idSelect" class="flow-canvas-content">
        <!-- 生成一个文本弹出框，接收三个参数：visible、left、top -->
        <Popover :showText="showText" :popoverLeft="popoverLeft" :popoverTop="popoverTop">
          <ul>
            <li v-for="(item, index) in infoList" :key="index">
              <p class="title">{{ item.name }}</p>
              <p class="time">
                <span class="time-label">计划起止时间：</span>
                <span class="time-details">{{ item.planStartTime + '~' + item.planEndTime }}</span>
              </p>
              <p class="time">
                <span class="time-label">实际起止时间：</span>
                <span class="time-details">{{ item.actualStartTime + '~' + item.actualEndTime }}</span>
              </p>
            </li>
          </ul>
        </Popover>
      </div>
    </div>
  </div>
</template>
<script>
import G6 from '@antv/g6'
import Popover from '_c/Popover'
import status from '@/lib/projectStatus'
import treeForEach from '@/utils/treeForEach'
import toTree from '@/utils/toTree'
import toFlat from '@/utils/toFlat'
export default {
  name: 'Flow',
  components: {
    Popover
  },
  props: {
    // 容器id
    idSelect: {
      default: 'container'
    },
    width: {},
    height: {
      default: 500
    },
    propList: {
      type: [Array, Boolean],
      default: false
    }
  },
  data() {
    return {
      list: [],
      // 节点弹出相关参数
      showText: false,
      popoverLeft: 0,
      popoverTop: 0,
      infoList: [],
      // g6实例
      graph: null,
      title: '',
      // 里程碑id
      taskUniqueId: '',
      activeMilestoneId: null
    }
  },
  computed: {
    computedFlowData() {
      let list = toTree(this.list, 'parentTaskUniqueId', null, 'taskUniqueId')
      treeForEach(list, e => (e.taskUniqueId = '' + e.taskUniqueId))
      let nodes = []
      let edges = []
      if (this.activeMilestoneId) {
        let activeMilestone = _.find(list, { taskUniqueId: this.activeMilestoneId })
        convertToNodes(toFlat(activeMilestone.children))
        let template = {
          status: activeMilestone.status,
          actualStartTime: activeMilestone.actualStartTime,
          actualEndTime: activeMilestone.actualEndTime,
          planStartTime: activeMilestone.planStartTime,
          planEndTime: activeMilestone.planEndTime,
          type: 'ellipse'
        }
        let start = Object.assign({}, template, {
          id: activeMilestone.taskUniqueId,
          label: `${activeMilestone.name} 开始`,
          style: {
            stroke: activeMilestone.status === 0 ? 'lightgray' : activeMilestone.status === 1 ? '#FF8D27' : '#409eff',
            fill: activeMilestone.status === 0 ? 'lightgray' : activeMilestone.status === 1 ? '#FF8D27' : '#409eff',
            lineWidth: 3
          }
        })
        let end = Object.assign({}, template, {
          id: activeMilestone.taskUniqueId + 's',
          label: `${activeMilestone.name} 结束`,
          style: {
            stroke: activeMilestone.status === 0 ? 'lightgray' : activeMilestone.status === 1 ? 'lightgray' : '#409eff',
            fill: activeMilestone.status === 0 ? 'lightgray' : activeMilestone.status === 1 ? 'lightgray' : '#409eff',
            lineWidth: 3
          }
        })
        let nodeIds = nodes.map(e => e.id).concat(start.id)
        let sourceIds = edges.map(e => e.source)
        let lastIds = _.difference(nodeIds, sourceIds)
        nodes.push(start)
        nodes.push(end)
        lastIds.forEach(id => {
          edges.push({
            source: id,
            target: end.id
          })
        })
      } else {
        convertToNodes(list.filter(e => !e.parentTaskUniqueId))
      }
      function convertToNodes(data) {
        data.forEach(item => {
          const color = _.get(_.find(status, { value: item.status }), 'color', 'lightgray')
          nodes.push({
            label: `${item.name}`,
            status: item.status,
            actualStartTime: item.actualStartTime,
            actualEndTime: item.actualEndTime,
            planStartTime: item.planStartTime,
            planEndTime: item.planEndTime,
            type: 'ellipse',
            id: item.taskUniqueId,
            anchorPoints: [
              [0, 0.5],
              [1, 0.5]
            ],
            style: {
              stroke: color,
              fill: color,
              lineWidth: 3
            }
          })
          if (item.preTaskId) {
            item.preTaskId.split(',').forEach(e => {
              edges.push({
                source: e,
                target: item.taskUniqueId
              })
            })
          }
        })
      }
      return { nodes, edges }
    },
    activeMilestoneIndex() {
      return _.findIndex(
        this.list.filter(e => !e.parentTaskUniqueId),
        { taskUniqueId: +this.activeMilestoneId }
      )
    },
    activeMilestone() {
      return _.find(this.list, { taskUniqueId: +this.activeMilestoneId })
    }
  },
  watch: {
    propList(val) {
      if (_.size(val)) {
        this.list = val
      }
    },
    computedFlowData() {
      this.loadData()
    },
    // 里程碑id更新
    activeMilestoneId(val) {
      this.$emit('taskUniqueIdChange', val, this.activeMilestone?.name)
    }
  },
  created() {
    !this.propList && this.refresh()
  },
  methods: {
    async refresh() {
      this.list = await this.axios.schedule
        .get('schedule/task/treeList/' + localStorage.getItem('projectId'))
        .then(res => res.data || [])
    },
    // graph：g6实例
    clear() {
      if (this.graph) {
        this.graph.clear()
        this.graph.destroy()
      }
    },
    //
    goBack() {
      this.activeMilestoneId = null
    },
    loadData() {
      this.clear()
      this.$nextTick(() => {
        this.initG6()
      })
    },
    prev() {
      this.activeMilestoneId =
        '' + this.list.filter(e => !e.parentTaskUniqueId)[this.activeMilestoneIndex - 1].taskUniqueId
    },
    next() {
      this.activeMilestoneId =
        '' + this.list.filter(e => !e.parentTaskUniqueId)[this.activeMilestoneIndex + 1].taskUniqueId
    },
    initG6() {
      // 自定义节点
      G6.registerNode(
        'sql',
        {
          drawShape(cfg, group) {
            const rect = group.addShape('rect', {
              attrs: {
                // x、y确定中心点，要取width、height的一半
                x: -75,
                y: -25,
                width: 150,
                height: 50,
                radius: 10,
                stroke: '#5B8FF9',
                fill: '#C6E5FF',
                lineWidth: 3
              }
            })

            return rect
          }
        },
        'single-shape'
      )
      const width = this.width ? this.width : document.getElementById(this.idSelect).scrollWidth
      const graph = new G6.Graph({
        container: this.idSelect,
        width: width,
        height: this.height,
        layout: {
          type: 'dagre',
          rankdir: 'LR',
          align: 'UR',
          nodesepFunc: d => {
            return 50
          },
          ranksep: 70
        },
        pixelRatio: 2,
        // 不同状态下样式
        // 默认线
        defaultEdge: {
          type: 'polyline',
          style: {
            radius: 20,
            offset: 10,
            lineWidth: 2,
            endArrow: true, //是否显示终点箭头
            stroke: '#C2C8D5'
          },
          lineJoin: 'bevel'
        },
        // 交互模式
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'click-select']
        },
        // 各种事件样式
        nodeStateStyles: {
          hover: {}
        },
        fitView: true
      })
      this.graph = graph

      this.graph.data(this.computedFlowData || { nodes: [], edges: [] })
      this.graph.render()
      // 鼠标进入节点
      this.graph.on('node:mouseenter', evt => {
        const { item, target } = evt
        const model = item.getBBox()
        const x = model.centerX + model.width / 2
        const y = model.centerY + model.height / 2 + 3
        const point = this.graph.getCanvasByPoint(x, y)
        this.popoverLeft = point.x + 'px'
        this.popoverTop = point.y + 'px'
        this.showText = true
        this.infoList = [
          {
            name: model.label,
            planStartTime: model.planStartTime ? moment(model.planStartTime).format('YYYY-MM-DD') : '',
            planEndTime: model.planEndTime ? moment(model.planEndTime).format('YYYY-MM-DD') : '',
            actualStartTime: model.actualStartTime ? moment(model.actualStartTime).format('YYYY-MM-DD') : '',
            actualEndTime: model.actualEndTime ? moment(model.actualEndTime).format('YYYY-MM-DD') : ''
          }
        ]
      })
      // 出去节点
      this.graph.on('node:mouseleave', () => {
        this.showText = false
      })
      this.graph.on('node:click', e => {
        // 获取节点详情
        if (!this.activeMilestoneId) {
          let { item } = e
          let { defaultCfg } = item
          this.activeMilestoneId = defaultCfg.id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.time {
  font-size: 14px;
  &-details {
    color: #409eff;
  }
}
.legend {
  ul {
    padding-left: 60px;
  }
}
.title {
  color: #303133;
  font-size: 16px;
}
.center {
  text-align: center;
}
.project-title {
  font-size: 30px;
}
.flow-canvas {
  position: relative;
  &-arrows-left,
  &-arrows-right {
    font-size: 60px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
  &-arrows-left {
    left: 0;
  }
  &-arrows-right {
    right: 0;
  }

  &-content {
    width: 80%;
    margin: 0 auto;
  }
}
</style>
