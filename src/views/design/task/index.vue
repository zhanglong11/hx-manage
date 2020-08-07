<template>
  <div>
    <Flow ref="flow" :propList="list" height="250"></Flow>
    <div class="tooltips">
      <div>
        <el-button
          v-if="canEdit || !projectStart"
          v-access="'/design/task/manage'"
          type="primary"
          @click="
            () => {
              activeTask = {}
              editDialogVisible = true
            }
          "
          >新建任务</el-button
        >
        <el-dropdown v-if="canEdit || !projectStart" v-access="'/design/task/manage'" style="margin: 0 10px;">
          <el-button>
            导入任务
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="importProjectDialogVisible = true">导入Project文件</el-dropdown-item>
            <el-dropdown-item @click.native="importBaseLineDialogVisible = true">导入基准模板</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button v-access="'/design/task/baseLineManage'" @click="saveBase">保存基准</el-button>
        <el-button v-access="'/design/task/baseLineManage'" @click="baseManageDialogVisible = true">基准管理</el-button>
        <el-button @click="refresh">刷新</el-button>
      </div>
    </div>
    <vxe-grid ref="table" :data="list" treeConfig resizable row-id="taskUniqueId">
      <vxe-table-column title="任务编号" field="wbsCode" widt h="140px" tree-node></vxe-table-column>
      <vxe-table-column title="任务名称" field="name"></vxe-table-column>
      <vxe-table-column title="工期(天)" width="80px" field="planDuration"></vxe-table-column>
      <vxe-table-column
        title="开始时间"
        :formatter="['toDateString', 'yyyy-MM-dd']"
        field="planStartTime"
      ></vxe-table-column>
      <vxe-table-column
        title="完成时间"
        :formatter="['toDateString', 'yyyy-MM-dd']"
        field="planEndTime"
      ></vxe-table-column>
      <vxe-table-column title="前置任务" field="preTaskCodes"></vxe-table-column>
      <vxe-table-column
        title="人力资源"
        field="resourceList"
        :formatter="({ cellValue }) => (cellValue || []).map(e => e.userName).join(',')"
      ></vxe-table-column>
      <vxe-table-column
        title="任务状态"
        field="status"
        :formatter="({ cellValue }) => ['未开始', '进行中', '已完成'][cellValue]"
      ></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button
            v-if="projectStart && !canEdit"
            v-access="'/design/task/progress-manage'"
            type="text"
            @click="
              () => {
                activeProgressEditTask = row
                progressEditDialogVisible = true
              }
            "
            >编辑进度</el-button
          >
          <el-button
            v-if="row.type === 2 && projectStart && !canEdit"
            v-access="'/design/task/launchMilestoneMeeting'"
            type="text"
            @click="
              () => {
                activeMilestone = row
                taskName = row.name
                AddMeetingDialogVisible = true
              }
            "
            >发起会议</el-button
          >
          <el-button
            v-if="!projectStart || canEdit"
            v-access="'/design/task/manage'"
            type="text"
            @click="
              () => {
                activeTask = row
                editDialogVisible = true
              }
            "
            >编辑</el-button
          >
          <el-button v-if="!projectStart || canEdit" v-access="'/design/task/manage'" type="text" @click="remove(row)"
            >删除</el-button
          >
        </template>
      </vxe-table-column>
    </vxe-grid>

    <Gantt
      ref="gantt"
      view-mode="month"
      :tasks="ganttTaskList"
      baseLineCompare
      style="padding-bottom: 15px;"
      @taskClick="handleGanttTaskClick"
      @task-updated="debugEventLog.push($event)"
      @task-date-updated="debugEventLog.push($event)"
      @task-progress-change="debugEventLog.push($event)"
    />
    <div style="height: 40px; background-color: #edeff2; margin: 0 -20px;"></div>
    <footer v-if="projectStart" v-access="'/design/task/manage'" class="main-footer">
      <el-button v-if="!canEdit" size="normal" type="primary" @click="canEdit = true">申请变更</el-button>
      <el-button v-else size="normal" type="primary" @click="submitChangeDialogVisible = true">提交变更</el-button>
      <el-button
        size="normal"
        @click="
          () => {
            canEdit = false
            refresh()
          }
        "
        >取消</el-button
      >
    </footer>

    <Edit
      ref="edit"
      :canEdit="canEdit"
      :task="activeTask"
      :projectStart="projectStart"
      :taskList="list"
      :visible.sync="editDialogVisible"
    ></Edit>
    <ProgressEdit
      ref="progressEdit"
      :task="activeProgressEditTask"
      active
      :visible.sync="progressEditDialogVisible"
    ></ProgressEdit>
    <el-dialog :visible.sync="baseManageDialogVisible" @close="baseManageDialogVisible = false">
      <BaseManage v-if="baseManageDialogVisible"></BaseManage>
      <footer slot="footer">
        <el-button @click="baseManageDialogVisible = false">我知道了</el-button>
      </footer>
    </el-dialog>
    <AddMeeting
      :type="2"
      :visible.sync="AddMeetingDialogVisible"
      :taskName="taskName"
      :milestone="activeMilestone"
    ></AddMeeting>

    <el-dialog
      destroy-on-close
      title="导入project"
      width="500px"
      :visible.sync="importProjectDialogVisible"
      @close="importFile = null"
    >
      <Upload v-model="importFile" accept=".xlsx,.xls,.mpp" raw></Upload>
      <span slot="footer">
        <el-button @click="importProjectDialogVisible = false">取消</el-button>
        <el-button :disabled="!importFile" type="primary" @click="submitImportProject">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="导入基准" width="800px" :visible.sync="importBaseLineDialogVisible">
      <BaseManage type="import" @change="id => (activeImportBaseLineId = id)"></BaseManage>
      <span slot="footer">
        <el-button @click="importBaseLineDialogVisible = false">取消</el-button>
        <el-button :disabled="!activeImportBaseLineId" type="primary" @click="submitImportBaseLine">导入</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提交变更" :visible.sync="submitChangeDialogVisible" width="600px">
      <el-form label-width="80px">
        <el-form-item label="变更原因">
          <el-input v-model="changeForm.changeReason" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="审批流程">
          <SelectProcessTemplate v-model="changeForm.processId"></SelectProcessTemplate>
        </el-form-item>
      </el-form>
      <Grid :tableData="processStages" :pagination="false">
        <vxe-table-column title="步骤" field="stageSeq"></vxe-table-column>
        <vxe-table-column
          title="审批人"
          field="auditorList"
          :formatter="({ cellValue }) => cellValue.map(e => e.name).join(',')"
        ></vxe-table-column>
        <vxe-table-column
          title="审批方式"
          field="passFlag"
          :formatter="({ cellValue }) => ['全部同意', '单人同意'][cellValue - 1]"
        ></vxe-table-column>
      </Grid>
      <span slot="footer">
        <el-button @click="submitChangeDialogVisible = false">取消</el-button>
        <el-button :disabled="!changeForm.changeReason && !changeForm.processId" type="primary" @click="submitChange"
          >提交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import toTree from '@/utils/toTree'
import toFlat from '@/utils/toFlat'
import treeForEach from '@/utils/treeForEach'
import treeFilter from '@/utils/treeFilter'
import compareTaskList from '@/utils/compareTaskList'
import Edit from './components/Edit'
import ProgressEdit from './components/ProgressEdit'
import BaseManage from './components/BaseManage'
import Gantt from '@/components/Gantt'
import AddMeeting from '@/views/design/components/AddMeeting'
import Flow from '../components/Flow'
import SelectProcessTemplate from '../components/SelectProcessTemplate'
import treeFind from '@/utils/treeFind'
export default {
  name: 'Task',
  components: { Edit, ProgressEdit, BaseManage, Gantt, AddMeeting, Flow, SelectProcessTemplate },
  data() {
    return {
      originList: [],
      list: [],
      taskName: '',
      activeTask: {},
      activeMilestone: null,
      activeProgressEditTask: {},
      progressEditDialogVisible: false,
      editDialogVisible: false,
      baseManageDialogVisible: false,
      AddMeetingDialogVisible: false,
      importProjectDialogVisible: false,
      importBaseLineDialogVisible: false,
      submitChangeDialogVisible: false,
      debugEventLog: [],
      changeForm: {},
      importFile: null,
      activeImportBaseLineId: null,
      filterForm: {
        type: 1
      },
      canEdit: false
    }
  },
  computed: {
    projectStart() {
      return this.projectDetail.extInfo?.projectStatus === '2'
    },
    processStages() {
      return _.get(_.find(this.$store.state.design.processTemplateList, { id: this.changeForm.processId }), 'stages')
    },
    projectDetail() {
      return this.$store.state.design.projectDetail
    },
    ganttTaskList() {
      return toFlat(this.list).map(e => ({
        id: '' + e.taskUniqueId,
        rowId: e.id,
        text: e.name,
        actual_start: e.actualStartTime && moment(e.actualStartTime).toDate(),
        actual_end: e.actualEndTime && moment(e.actualEndTime).toDate(),
        start_date: moment(e.planStartTime).toDate(),
        end_date: moment(e.planEndTime).toDate(),
        progress: e.actualProgress,
        // parent: e.parentTaskUniqueId,
        dependencies: e.preTaskId ? e.preTaskId.split(',') : []
      }))
    }
  },
  watch: {
    projectStart() {
      this.$refs.table.refreshColumn()
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.axios.schedule.get('schedule/task/treeList/' + localStorage.getItem('projectId')).then(res => {
        res.data = res.data || []
        this.originList = _.cloneDeep(res.data)
        this.calculateList(res.data)
      })
    },
    calculateList(data) {
      data = data || _.cloneDeep(this.originList)
      data = _.sortBy(data, e => moment(e.planStartTime).get('seconds'))
      let list = toTree(data, 'parentTaskUniqueId', null, 'taskUniqueId', false)
      treeForEach(this.list, (item, parent, index) => {
        if (!parent) {
          item.wbsCode = index + 1
        } else {
          item.wbsCode = parent.wbsCode + '.' + (index + 1)
        }
      })
      this.list = list
    },
    saveBase() {
      this.$prompt('请输入名称', '保存基准', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.{2,300}/,
        inputErrorMessage: '必填'
      }).then(({ value }) => {
        this.axios.schedule
          .post('schedule/plan/saveBase', { planName: value, projectId: localStorage.getItem('projectId') })
          .then(res => {
            this.$message.success('保存基准成功')
          })
      })
    },
    loadData() {
      this.$refs.table.$refs.xTable.loadData(this.list)
    },
    remove(row) {
      if (this.projectStart) {
        this.list = treeFilter(this.list, e => !(e.ancestorIds || []).concat(e.id).includes(row.id))
        this.loadData()
      } else {
        if (_.size(row.children)) {
          this.$message.error('先删除下级任务才可以删除此任务')
        } else {
          this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.axios.schedule.get('schedule/task/deleteById/' + row.id).then(res => {
              this.$message.success('删除成功')
              this.refresh()
            })
          })
        }
      }
    },
    handleGanttTaskClick(taskUniqueId) {
      this.activeTask = treeFind(this.list, e => e.taskUniqueId === +taskUniqueId)
      this.editDialogVisible = true
    },
    submitImportProject() {
      let formData = new FormData()
      formData.append('projectId', localStorage.getItem('projectId'))
      formData.append('file', this.importFile)
      this.axios.schedule.post('schedule/plan/importProject', formData).then(res => {
        this.$message.success('导入成功')
        this.importProjectDialogVisible = false
        this.refresh()
      })
    },
    submitImportBaseLine() {
      this.axios.schedule
        .get('schedule/plan/applyBase/' + this.activeImportBaseLineId + '/' + localStorage.getItem('projectId'))
        .then(res => {
          this.$message.success('导入基准成功')
          this.importBaseLineDialogVisible = false
          this.refresh()
        })
    },
    submitChange() {
      let list = _.cloneDeep(this.list)
      treeForEach(list, e => delete e.ancestorIds)
      let changeData = compareTaskList(list, _.cloneDeep(this.originList))
      this.axios.schedule
        .post('schedule/plan/submitAudit', {
          ...changeData,
          ...this.changeForm,
          projectId: localStorage.getItem('projectId'),
          planId: _.first(this.list).planId
        })
        .then(res => {
          this.$message.success('提交成功')
        })
    }
  }
}
</script>

<style scoped lang="less">
.main-footer {
  position: fixed;
  z-index: 100;
  background-color: #fff;
  width: calc(100vw - 270px);
  bottom: 0;
  left: 230px;
  padding: 10px 20px;
  box-shadow: 0 -3px 8px rgba(70, 70, 70, 0.64);
}
</style>
