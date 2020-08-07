<template>
  <div class="main">
    <!-- 流程图 start -->
    <ViewFlow v-if="$route.meta.showAudit" :id="id" />
    <!-- 流程图 end -->
    <div
      class="task-list-wrap"
      :class="{
        'full-height': !$route.meta.showAffectManage && !([2, 3].includes(form.status) && $route.meta.showAudit)
      }"
    >
      <!--      <template v-if="[2, 3].includes(form.status) && $route.meta.showAudit" style="margin-top: 15px;max-width: 800px">-->
      <!--        &lt;!&ndash; 流程图 start &ndash;&gt;-->
      <!--        <ViewFlow :id="$route.params.id" />-->
      <!--        &lt;!&ndash; 流程图 end &ndash;&gt;-->
      <!--      </template>-->
      <div class="aside">
        <div class="tooltips">
          <div>
            <el-button v-if="type === 'edit'" @click="importDialogVisible = true">导入</el-button>
            <router-link
              v-if="$hasPower('SchedulePlanChange') && $route.meta.showChangeLogButton"
              class="el-button el-button--small"
              to="/schedule/planChange"
              >查看变更记录</router-link
            >
          </div>
        </div>
        <el-tree
          highlight-current
          :expand-on-click-node="false"
          :data="treeData"
          default-expand-all
          @current-change="data => (activeNode = data)"
        ></el-tree>
      </div>
      <div class="task-list">
        <div class="tooltips">
          <div></div>
          <div>
            <template v-if="type === 'edit'">
              <el-button
                v-if="$hasPower('SchedulePlanAdd')"
                type="primary"
                @click="
                  () => {
                    activeTask = {}
                    editDialogVisible = true
                  }
                "
                >新建任务</el-button
              >
            </template>
            <template v-if="$route.meta.showProgressControl">
              <el-button type="primary" :disabled="activeRow.status !== 0" @click="startDialogVisible = true"
                >开始</el-button
              >
              <el-button :disabled="activeRow.status !== 1" @click="endDialogVisible = true">结束</el-button>
              <el-button
                :disabled="!activeRow.id || activeRow.status !== 1"
                @click="$router.push('writeLog/new?taskId=' + activeRow.id)"
                >填报</el-button
              >
              <el-button @click="$router.push('/schedule/writeLog')">填报记录</el-button>
            </template>
            <el-button v-if="$hasPower('SchedulePlanExport')" type="primary" @click="exportTask">导出</el-button>

            <div v-if="$route.meta.showAuditStatus" class="audit-status">
              <span>审核状态：</span>
              <span>{{ planAuditStatus.getLabel(form.status) }}</span>
            </div>
          </div>
        </div>
        <vxe-table
          ref="table"
          max-height="500px"
          highlightHoverRow
          highlightCurrentRow
          resizable
          tree-config
          :data="computedListWithFilter"
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
            title="里程碑"
            width="80px"
            field="type"
            :formatter="({ cellValue }) => (cellValue === 2 ? '√' : '')"
          ></vxe-table-column>
          <vxe-table-column
            title="当前进度"
            width="100px"
            field="actualProgress"
            :formatter="({ cellValue }) => (cellValue ? cellValue * 100 + '%' : '')"
          ></vxe-table-column>
          <vxe-table-column title="任务状态" width="100px" field="statusText"></vxe-table-column>
          <vxe-table-column v-if="type === 'edit'" fixed="right" align="left" title="操作" field="title" width="90px">
            <template slot-scope="{ row }">
              <el-button
                v-if="$hasPower('SchedulePlanEdit')"
                type="text"
                @click="
                  () => {
                    activeTask = row
                    editDialogVisible = true
                  }
                "
                >编辑</el-button
              >
              <el-button v-if="$hasPower('SchedulePlanRemove')" type="text" @click="remove(row)">删除</el-button>
            </template>
          </vxe-table-column>
        </vxe-table>
        <Gantt
          view-mode="month"
          :tasks="ganttTasks"
          @task-updated="debugEventLog.push($event)"
          @task-date-updated="debugEventLog.push($event)"
          @task-progress-change="debugEventLog.push($event)"
        />
      </div>
    </div>

    <el-card v-if="$route.meta.showAffectManage" style="margin-top: 10px;">
      <header slot="header">施工进度影响</header>
      <vxe-table
        ref="affectTable"
        max-height="280px"
        show-overflow
        border
        :data="effectList"
        :edit-config="type === 'edit' ? { trigger: 'click', mode: 'row', showStatus: true } : {}"
        :edit-rules="validRules"
      >
        <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
        <vxe-table-column title="施工影响名称" field="effectName" :editRender="{ name: 'ElInput' }"></vxe-table-column>
        <vxe-table-column title="影响范围" field="effectScope" :editRender="{ name: 'ElInput' }"></vxe-table-column>
        <vxe-table-column title="影响值" field="effectValue" :editRender="{ name: 'ElInput' }"></vxe-table-column>
        <vxe-table-column title="单位" field="unit" :editRender="{ name: 'ElInput' }"></vxe-table-column>
        <vxe-table-column
          width="260px"
          title="影响日期"
          range-separator="至"
          field="daterange"
          :edit-render="{
            name: 'ElDatePicker',
            props: { type: 'daterange', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd HH:mm:ss' }
          }"
        ></vxe-table-column>
        <vxe-table-column
          title="影响工期(天)"
          field="effectDuration"
          :editRender="{ name: 'ElInput' }"
        ></vxe-table-column>
        <vxe-table-column title="附件" field="fileIds">
          <template v-slot="{ row }">
            <AttachmentDialog
              accept=".jpg,.png,.gif,.webp,.bmp"
              :manage="type === 'edit'"
              :ids.sync="row.fileIds"
            ></AttachmentDialog>
          </template>
        </vxe-table-column>
        <vxe-table-column title="备注" field="remark" :editRender="{ name: 'ElInput' }"></vxe-table-column>
        <vxe-table-column v-if="type === 'edit'" title="操作">
          <el-button
            slot-scope="{ rowIndex }"
            icon="el-icon-delete"
            type="danger"
            @click="effectList.splice(rowIndex, 1)"
          ></el-button>
        </vxe-table-column>
      </vxe-table>
      <div v-if="type === 'edit'" class="add-row" @click="addAffect"><i class="el-icon-plus"></i>添加</div>
      <el-form
        ref="form"
        :disabled="type === 'view'"
        style="margin-top: 15px; width: 600px;"
        :model="form"
        label-width="90px"
      >
        <el-form-item v-if="$route.meta.showChangeReason" label="变更原因" prop="changeReason">
          <el-input v-model="form.changeReason"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.desp" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div style="height: 50px;"></div>
    <footer v-if="type === 'edit'" class="main-footer">
      <el-button size="normal" @click="$router.go(-1)">取消</el-button>
      <el-button size="normal" @click="save(1)">保存</el-button>
      <el-button type="primary" size="normal" @click="save(2)">保存并提交</el-button>
    </footer>
    <!--    bug#1500 张龙 04-07-->
    <template v-if="$route.meta.showAudit">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div v-if="type !== 'edit' && $route.meta.showFooterBtn !== false" class="footerButton">
      <el-button v-if="!$route.meta.showAudit" @click="$router.go(-1)">返回</el-button>
      <template v-else>
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button v-if="form.status !== 2" type="primary" @click="approval()">确定</el-button>
      </template>
    </div>

    <Edit
      ref="edit"
      :type="type"
      :task="activeTask"
      :projectStart="projectStart"
      :taskList="computedList"
      :visible.sync="editDialogVisible"
    ></Edit>

    <el-dialog destroy-on-close width="500px" title="导入" :visible.sync="importDialogVisible">
      <Upload v-model="importFile" accept=".mpp" raw></Upload>
      <footer slot="footer">
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button v-loading="importLoading" type="primary" :disabled="!importFile" @click="submitImport">
          导入
        </el-button>
      </footer>
    </el-dialog>
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
import toFlat from '@/utils/toFlat'
import treeForEach from '@/utils/treeForEach'
import Edit from './components/Edit'
import Gantt from '@/components/Gantt'
import treeFilter from '@/utils/treeFilter'
import jsonAsXlsx from 'json-as-xlsx'
import compareTaskList from '@/utils/compareTaskList'
import planAuditStatus from '../lib/planAuditStatus'
export default {
  name: 'ScheduleDetail',
  components: { Edit, Gantt },
  data() {
    return {
      planAuditStatus,
      planId: null,
      list: [],
      originList: [],
      validRules: {
        // title: [{ required: true, message: '必填' }]
      },
      activeRow: {},
      activeNode: null,
      flatData: [],
      activeId: null,
      activeMilestone: null,
      editDialogVisible: false,
      baseManageDialogVisible: false,
      AddMeetingDialogVisible: false,
      importDialogVisible: false,
      startDialogVisible: false,
      endDialogVisible: false,
      debugEventLog: [],
      importFile: null,
      importLoading: false,
      effectList: [],
      activeTask: {},
      form: {},
      auditForm: {},
      startForm: { actualStartTime: moment().format('YYYY-MM-DD HH:mm:ss') },
      endForm: { actualEndTime: moment().format('YYYY-MM-DD HH:mm:ss') }
    }
  },
  computed: {
    computedList() {
      let data = this.list
      let list = toTree(data, 'parentTaskUniqueId', 'planStartTime', 'taskUniqueId', true)
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
    computedListWithFilter() {
      let list = this.computedList
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
      return list
    },
    projectDetail() {
      return this.$store.state.design.projectDetail
    },
    projectStart() {
      return this.projectDetail.extInfo?.projectStatus === '2'
    },
    type() {
      return this.$route.meta.type
    },
    ganttTasks() {
      return toFlat(this.computedListWithFilter, 'parentTaskUniqueId', 'taskUniqueId').map(e => ({
        id: '' + e.taskUniqueId,
        rowId: e.id,
        text: e.name,
        planned_start: moment(e.planStartTime).toDate(),
        planned_end: moment(e.planEndTime).toDate(),
        start_date: moment(e.planStartTime).toDate(),
        end_date: moment(e.planEndTime).toDate(),
        progress: e.actualProgress,
        // parent: e.parentTaskUniqueId,
        dependencies: e.preTaskId ? e.preTaskId.split(',') : [],
        linkType: e.preTaskId === (e.parentTaskUniqueId || -1).toString() ? '1' : '0'
      }))
    },
    treeData() {
      let yearList = []
      // 计算年月集合
      function c(start, end) {
        const startYear = moment(start).year()
        const startMonth = moment(start).month()
        const endYear = moment(end).year()
        const endMonth = moment(end).month()
        let currentYear = startYear
        let currentMonth = startMonth
        while (!(currentYear > endYear || (currentYear === endYear && currentMonth > endMonth))) {
          let targetYear = _.find(yearList, { year: currentYear })
          if (targetYear) {
            if (!targetYear.children.includes(currentMonth)) {
              targetYear.children.push(currentMonth)
            }
          } else {
            yearList.push({
              year: currentYear,
              children: [currentMonth]
            })
          }
          if (currentMonth + 1 === 12) {
            currentYear += 1
            currentMonth = 0
          } else {
            currentMonth += 1
          }
        }
      }
      _.sortBy(this.originList, 'planStartTime').forEach(e => {
        c(e.planStartTime, e.planEndTime)
      })
      yearList.forEach(e => {
        e.label = e.year + '年进度计划'
        e.children = e.children.map(month => ({
          label: e.year + '年' + (month + 1) + '月计划',
          year: e.year,
          month
        }))
      })
      return [
        {
          label: this.form.planName || '当前计划',
          children: yearList
        }
      ]
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
      if (this.$route.params.id) {
        res = await this.axios.schedule.get('construct/plan/detail/' + this.$route.params.id)
        this.planId = this.$route.params.id
      } else {
        res = await this.axios.schedule.get('construct/plan/taskList/' + localStorage.getItem('projectId'))
      }
      if (res.data) {
        this.originList = _.cloneDeep(res.data.taskList)
        this.list = res.data.taskList
        if (this.$route.params.id) {
          this.effectList = res.data.effectList || []
          this.form = res.data
        }
      }
    },
    loadData() {
      this.$refs.table.loadData(this.list)
    },
    addAffect() {
      this.effectList.push({
        effectName: '',
        effectScope: '',
        effectValue: '',
        unit: '',
        effectDuration: 0,
        fileIds: '',
        remark: '',
        daterange: [new Date(), new Date()],
        isNew: true
      })
    },
    async save(type = 1) {
      if (!_.size(this.form.addTaskList) && !_.size(this.list)) {
        this.$message.error('至少有一个任务才可以提交')
        return false
      }
      await this.$refs.affectTable.validate()
      await this.$refs.form.validate()
      let form = {}
      this.effectList.forEach(e => {
        if (e.daterange) {
          e.beginDate = e.daterange[0]
          e.endDate = e.daterange[1]
        }
      })
      if (this.$route.query.isNew === 'true') {
        form = {
          type,
          addTaskList: this.list,
          projectId: localStorage.getItem('projectId'),
          planId: this.planId,
          projectName: localStorage.getItem('projectName'),
          addEffectList: this.effectList.filter(e => this.form.status === 0 || e.isNew),
          ..._.pick(this.form, ['changeReason', 'desp'])
        }
      } else {
        let data = compareTaskList(this.list, this.originList)
        form = {
          type,
          list: this.list,
          ...data,
          projectId: localStorage.getItem('projectId'),
          planId: this.planId,
          projectName: localStorage.getItem('projectName'),
          addEffectList: this.effectList.filter(e => this.form.status === 0 || e.isNew),
          ..._.pick(this.form, ['changeReason', 'desp'])
        }
      }

      if (this.planId) {
        form.planId = this.planId
      }
      if (this.$route.query.isNew) {
        Object.assign(form, JSON.parse(localStorage.getItem('lastAddSchedulePlanInfo')))
      }
      return this.axios.schedule.post('construct/plan/' + (this.planId ? 'edit' : 'add'), form).then(res => {
        this.$message.success(type === 1 ? '保存成功' : '保存并提交成功')
        this.$router.back()

        if (!this.planId) this.planId = res.data
      })
    },
    submitImport() {
      this.importLoading = true
      let formData = new FormData()
      formData.append('projectId', localStorage.getItem('projectId'))
      formData.append('file', this.importFile)
      this.axios.schedule
        .post('construct/plan/importProject', formData)
        .then(res => {
          this.originList = _.cloneDeep(res.data)
          this.list = res.data
          this.importDialogVisible = false
        })
        .finally(() => (this.importLoading = false))
    },
    exportTask() {
      let list = toFlat(this.computedList)
      const columns = this.$refs.table
        .getTableColumn()
        .visibleColumn.map(e => ({ label: e.title, value: e.property }))
        .slice(1)
      list.forEach(e => (e.type = e.type === 2 ? '√' : ''))
      jsonAsXlsx(columns, list, {
        fileName: `${this.activeNode?.label || this.form.planName || localStorage.getItem('projectName') + '进度计划'}`
      })
    },
    remove(row) {
      if (_.size(row.children)) {
        this.$message.error('先删除下级任务才可以删除此任务')
      } else {
        this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.list = treeFilter(this.list, e => e.taskUniqueId !== row.taskUniqueId)
        })
      }
    },
    submitStart() {
      this.axios.schedule.post('construct/task/start', { ...this.startForm, taskId: this.activeRow.id }).then(res => {
        this.$message.success('开始任务成功')
        this.startDialogVisible = false
        this.refresh()
      })
    },
    submitEnd() {
      this.axios.schedule.post('construct/task/finish', { ...this.endForm, taskId: this.activeRow.id }).then(res => {
        this.$message.success('结束任务成功')
        this.endDialogVisible = false
        this.refresh()
      })
    },
    back() {
      this.$router.back()
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less">
div.main {
  background-color: #f0f2f5;
  padding: 0;
  .task-list-wrap {
    display: flex;
    &.full-height {
      min-height: calc(100vh - 120px);
    }
    .aside {
      width: 240px;
      margin-right: 10px;
      padding: 20px;
      background-color: #fff;
    }
    .task-list {
      width: calc(100% - 240px);
      padding: 20px;
      background-color: #fff;
    }
  }
  .audit-status {
    display: inline-block;
    vertical-align: middle;
    font-size: 18px;
    margin-bottom: 17px;
    margin-left: 15px;
    font-weight: bold;
    span:first-child {
      color: #8f8f8f;
    }
    span:last-child {
      color: #606060;
    }
  }
}
.add-row {
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
  font-size: 14px;
  line-height: 30px;
  border: 1px dashed #ddd;
  margin-top: -1px;
  i {
    margin-right: 8px;
  }
  text-align: center;
}
.main-footer {
  text-align: right;
  z-index: 100;
  position: absolute;
  bottom: 0;
  width: calc(100% - 40px);
  background-color: #fff;
  margin-top: 15px;
  padding: 10px;
}
</style>
