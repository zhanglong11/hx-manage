<template>
  <div class="container">
    <vxe-table
      ref="table"
      highlightHoverRow
      highlightCurrentRow
      resizable
      tree-config
      :data="computedList"
      row-id="taskUniqueId"
      @current-change="({ row }) => (activeRow = row)"
    >
      <vxe-table-column title="序号" type="seq" width="60"></vxe-table-column>
      <vxe-table-column title="任务编号" field="wbsCode" width="140px" tree-node></vxe-table-column>
      <vxe-table-column title="任务名称" field="name" min-width="200px"></vxe-table-column>
      <vxe-table-column
        width="100px"
        title="计划开始时间"
        :formatter="['toDateString', 'yyyy-MM-dd']"
        field="planStartTime"
      ></vxe-table-column>
      <vxe-table-column
        width="100px"
        title="计划结束时间"
        :formatter="['toDateString', 'yyyy-MM-dd']"
        field="planEndTime"
      ></vxe-table-column>
      <vxe-table-column title="工期(天)" width="70px" field="planDuration"></vxe-table-column>
      <vxe-table-column
        width="100px"
        title="实际开始时间"
        :formatter="['toDateString', 'yyyy-MM-dd']"
        field="actualStartTime"
      ></vxe-table-column>
      <vxe-table-column
        width="100px"
        title="实际结束时间"
        :formatter="['toDateString', 'yyyy-MM-dd']"
        field="actualEndTime"
      ></vxe-table-column>
      <vxe-table-column title="实际工期(天)" width="100px" field="realityDuration"></vxe-table-column>
      <vxe-table-column
        title="当前进度"
        width="100px"
        field="actualProgress"
        :formatter="({ cellValue }) => (cellValue ? cellValue * 100 + '%' : '')"
      ></vxe-table-column>
      <vxe-table-column title="责任人" width="100px" field="principalName"></vxe-table-column>
      <vxe-table-column title="任务状态" width="100px" field="statusText"></vxe-table-column>
      <vxe-table-column fixed="right" align="left" title="操作" field="title" width="160px">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.status === 0 && $hasPower('ProjectPlanStartEpc')"
            type="text"
            @click="startDialogVisible = true"
            >开始</el-button
          >
          <el-button
            v-else-if="row.status === 1 && $hasPower('ProjectPlanEndEpc')"
            type="text"
            @click="endDialogVisible = true"
            >结束</el-button
          >
          <el-button
            v-if="row.status === 1 && $hasPower('ProjectPlanWriteLogEditEpc')"
            type="text"
            @click="$router.push('planReport/' + row.id + '/edit')"
            >填报</el-button
          >
          <el-button
            v-if="$hasPower('ProjectPlanWriteLogDetailEpc')"
            type="text"
            @click="$router.push('planReport/' + row.id + '/detail')"
            >填报记录</el-button
          >
        </template>
      </vxe-table-column>
    </vxe-table>
    <footer v-if="type === 'edit'" class="main-footer">
      <el-button size="normal" @click="$router.go(-1)">取消</el-button>
    </footer>
    <el-dialog title="开始任务" width="380px" :visible.sync="startDialogVisible">
      <el-form>
        <el-form-item label="开始时间">
          <el-date-picker v-model="startForm.actualStartTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
      </el-form>
      <footer slot="footer">
        <el-button @click="startDialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!startForm.actualStartTime" @click="submitStart">提交</el-button>
      </footer>
    </el-dialog>
    <el-dialog title="结束任务" width="380px" :visible.sync="endDialogVisible">
      <el-form>
        <el-form-item label="结束时间">
          <el-date-picker v-model="endForm.actualEndTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
      </el-form>
      <footer slot="footer">
        <el-button @click="endDialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!endForm.actualEndTime" @click="submitEnd">提交</el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
import toTree from '@/utils/toTree'
import treeForEach from '@/utils/treeForEach'
import treeFilter from '@/utils/treeFilter'
import planAuditStatus from '../lib/planAuditStatus'
export default {
  name: 'ScheduleDetail',
  data() {
    return {
      planAuditStatus,
      planId: null,
      list: [],
      activeRow: {},
      activeNode: null,
      activeId: null,
      startDialogVisible: false,
      endDialogVisible: false,
      activeTask: {},
      startForm: { actualStartTime: moment().format('YYYY-MM-DD HH:mm:ss') },
      endForm: { actualEndTime: moment().format('YYYY-MM-DD HH:mm:ss') }
    }
  },
  computed: {
    computedList() {
      let data = this.list
      let list = toTree(data, 'parentTaskUniqueId', 'planStartTime', 'taskUniqueId', true)
      if (this.activeNode) {
        const { year, month } = this.activeNode
        if (_.isNumber(month)) {
          list = treeFilter(list, e => {
            return moment()
              .year(year)
              .month(month)
              .isBetween(moment(e.planStartTime), moment(e.planEndTime), 'month', '[]')
          })
        } else if (year) {
          list = treeFilter(list, e => {
            return moment().year(year).isBetween(moment(e.planStartTime), moment(e.planEndTime), 'year', '[]')
          })
        }
      }
      treeForEach(list, (item, parent, index) => {
        if (!parent) {
          item.wbsCode = index + 1
        } else {
          item.wbsCode = parent.wbsCode + '.' + (index + 1)
        }
        let PS = item.planStartTime.slice(0, 10)
        let PE = item.planEndTime.slice(0, 10)
        let today = moment().format('YYYY-MM-DD')
        if ([1, 2].includes(item.status)) {
          let AS = item.actualStartTime.slice(0, 10)
          if (item.status === 1) {
            if (AS > PS) {
              item.statusText = '延期开始'
            } else if (AS < PS) {
              item.statusText = '提前开始'
            } else {
              item.statusText = '正常开始'
            }
          } else if (item.status === 2) {
            let AE = item.actualEndTime.slice(0, 10)
            if (AE < PE) {
              item.statusText = '提前结束'
            } else if (AE > PE) {
              item.statusText = '延期结束'
            } else {
              item.statusText = '正常结束'
            }
          }
        } else {
          if (today > PS) {
            item.statusText = '已延期'
          } else {
            item.statusText = '未开始'
          }
        }
      })
      return _.cloneDeep(list)
    },
    projectDetail() {
      return this.$store.state.design.projectDetail
    },
    projectStart() {
      return this.projectDetail.extInfo?.projectStatus === '2'
    },
    type() {
      return this.$route.meta.type
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = {}
      res = await this.axios.schedule.get('epc/plan/taskList/' + localStorage.getItem('projectId'))
      if (res.data) {
        res.data = res.data || []
        this.originList = _.cloneDeep(res.data)
        this.list = res.data
      }
    },
    loadData() {
      this.$refs.table.loadData(this.list)
    },
    submitStart() {
      this.axios.schedule.post('epc/task/start', { ...this.startForm, taskId: this.activeRow.id }).then(res => {
        this.$message.success('开始任务成功')
        this.startDialogVisible = false
        this.refresh()
      })
    },
    submitEnd() {
      this.axios.schedule.post('epc/task/finish', { ...this.endForm, taskId: this.activeRow.id }).then(res => {
        this.$message.success('结束任务成功')
        this.endDialogVisible = false
        this.refresh()
      })
    },
    back() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less"></style>
