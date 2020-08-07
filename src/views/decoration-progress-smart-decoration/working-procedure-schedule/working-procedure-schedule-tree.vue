<template>
  <div class="main no-padding">
    <aside>
      <div class="tooltips" style="margin-bottom: 15px;">
        <el-input v-model="q" plaecholder="请输入" @input="handleSearch"></el-input>
      </div>
      <el-tree
        ref="tree"
        class="scroll-beauty"
        show-checkbox
        default-expand-all
        :data="computedTreeData"
        node-key="id"
        @check-change="handleCheckChange"
      >
        <span slot-scope="{ data }" class="tree-node-custom" :class="{ 'is-leaf-custom': data.isLeaf }">
          <span v-if="!data.isLeaf" class="folder"></span>
          <span v-else class="file"></span>
          <span :class="{ ['tree-node-type-' + (data.type || 'leaf')]: true }">{{ data.label }}</span>
        </span>
      </el-tree>
    </aside>
    <div class="content">
      <!--  <div class="tooltips">
        <div></div>
        <div><el-button type="primary">导出</el-button></div>
      </div>-->
      <Grid ref="table" :request="request">
        <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
        <vxe-table-column field="floorRule" title="工序编号"> </vxe-table-column>
        <vxe-table-column field="mainProcedure" title="任务名称"> </vxe-table-column>
        <vxe-table-column field="startTime" title="计划开始时间"></vxe-table-column>
        <vxe-table-column field="planDuration" title="工期(天)"> </vxe-table-column>
        <vxe-table-column field="actualStartTime" title="实际开始时间"></vxe-table-column>
        <vxe-table-column field="actualEndTime" title="实际结束时间"> </vxe-table-column>
        <vxe-table-column field="actualDuration" title="实际工期(天)"></vxe-table-column>
        <vxe-table-column
          title="是否延期"
          :formatter="({ row }) => (moment(row.actualEndTime).isAfter(row.planEndTime) ? '是' : '否')"
        ></vxe-table-column>
        <vxe-table-column field="mode" title="节点预警"></vxe-table-column>
        <vxe-table-column field="progress" title="当前进度(%)"></vxe-table-column>
        <vxe-table-column field="mode" title="任务状态">
          <template v-slot="{ row }">
            <span v-if="row.status === 2">已确认</span>
            <span v-else-if="row.status === 1">待确认</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="confirmorName" title="确认人"></vxe-table-column>
      </Grid>
      <div
        v-show="list.length"
        ref="gantt"
        :style="{ height: Math.max(list.length * 40 + 70, 200) + 'px' }"
        style="max-height: 600px; margin-top: 0;"
      ></div>
    </div>
  </div>
</template>

<script>
import treeFilter from '@/utils/treeFilter'
import { processProgressApi } from '@/views/decoration-progress-smart-decoration/api/process-progress'
import _ from 'lodash'
import toTree from '@/utils/toTree'
import '@/assets/js/dhtmlxgantt'
import 'dhtmlx-gantt/codebase/locale/locale_cn.js'

export default {
  name: 'ProcedureScheduleTreeSmartDecoration',
  data() {
    return {
      id: this.$route.params.id,
      treeData: [],
      list: [],
      q: '',
      debounceQ: '',
      // 本地分页
      request: ({ page, rows }) => {
        return Promise.resolve({
          data: {
            total: this.list.length,
            records: this.list.slice((page - 1) * rows, page * rows)
          }
        })
      }
    }
  },
  computed: {
    computedTreeData() {
      if (this.debounceQ) {
        return treeFilter(
          this.treeData,
          (e, parent) =>
            _.includes(e.label, this.debounceQ) || (_.includes(_.get(parent, 'name', ''), this.debounceQ) && e.isLeaf)
        )
      } else {
        return this.treeData
      }
    }
  },
  watch: {
    computedTreeData() {
      const first = _.first(this.computedTreeData)
      if (first) this.$refs.tree.setChecked(first.id, true)
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    async init() {
      let res = await processProgressApi.queryProcedureScheduleList(this.id)
      this.originData = _.cloneDeep(res.data)
      res.data.forEach(e => {
        e.label = e.name
        e.isLeaf = false
        if (e.volist) {
          e.volist.forEach(f => {
            f.label = f.mainProcedure
            f.text = f.mainProcedure
            f.isLeaf = true
            f.id = '' + e.id + f.scheduleId
            f.pid = e.id
            f.start_date = f.startTime
            f.end_date = f.endTime
            f.progress = f.actualProgress
          })
          e.children = e.volist
        }
      })
      this.treeData = toTree(res.data)
      this.setupGanttChart()
    },
    async refresh() {},
    handleCheckChange: _.debounce(function () {
      const checkedList = this.$refs.tree.getCheckedNodes().filter(e => e.type === 5)
      this.list = _.flatten(checkedList.map(e => e.children))
      this.$refs.table.reset()
      this.updateTasks()
    }, 10),
    setupGanttChart() {
      gantt.config.scale_height = 50
      gantt.config.task_height = 16
      gantt.config.row_height = 40
      gantt.config.min_column_width = 40
      gantt.config.show_task_cells = false
      gantt.config.readonly = true
      gantt.config.scales = [
        { unit: 'week', step: 1, format: '%F, %Y' },
        { unit: 'day', step: 1, format: '%j, %D' }
      ]
      gantt.config.date_format = '%Y-%m-%d %H:%i:%s'
      gantt.config.columns = [
        {
          name: 'label',
          label: '任务名称',
          resize: true,
          width: 100
        }
      ]
      gantt.init(this.$refs.gantt)
      this.render()
      gantt.attachEvent('onTaskDblClick', id => {
        return false
      })
      gantt.attachEvent('onTaskClick', id => {
        this.$emit('taskClick', id)
      })
    },
    render() {
      gantt.render()
    },
    updateTasks() {
      gantt.clearAll()
      gantt.parse({
        data: this.list,
        links: []
      })
    },
    handleSearch: _.debounce(function (val) {
      this.debounceQ = val
    }, 300)
  }
}
</script>

<style scoped lang="less">
@import '~dhtmlx-gantt/codebase/dhtmlxgantt.css';
@import '~@/styles/common';
.main {
  display: flex;
  aside {
    padding: 25px;
    background-color: #fff;
    width: 350px;
    flex-shrink: 0;
    margin-right: 20px;
  }
  .content {
    padding: 25px;
    background-color: #fff;
    flex: 1;
  }
  .el-tree {
    max-height: calc(100vh - 190px);
    overflow: auto;
  }
}
.el-tree {
  /deep/ div {
    .is-leaf + .el-checkbox {
      visibility: hidden;
    }
  }
  .tree-node-custom {
    display: flex;
    align-items: center;
  }
  .folder {
    width: 16px;
    height: 16px;
    background: url(~@/assets/images/file-folder.png) no-repeat;
    background-size: contain;
    margin-right: 10px;
  }
  .file {
    width: 16px;
    height: 16px;
    background: url(~@/assets/images/file.png) no-repeat;
    background-size: contain;
    margin-right: 10px;
  }
}
</style>
