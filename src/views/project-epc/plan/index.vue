<template>
  <div class="container">
    <div class="task-list-wrap">
      <div class="task-list">
        <div class="tooltips">
          <div></div>
          <div>
            <template v-if="type === 'edit'">
              <el-button
                v-if="$hasPower('ProjectPlanAddEpc')"
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
            <el-button v-if="$hasPower('ProjectPlanImportEpc')" @click="importDialogVisible = true">
              导入
            </el-button>
            <el-button v-if="$hasPower('ProjectPlanExportEpc')" @click="exportTask">导出</el-button>
          </div>
        </div>
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
          <vxe-table-column v-if="type === 'edit'" fixed="right" align="left" title="操作" field="title" width="90px">
            <template slot-scope="{ row }">
              <el-button
                v-if="$hasPower('ProjectPlanEditEpc') && row.status === 0"
                type="text"
                @click="
                  () => {
                    activeTask = row
                    editDialogVisible = true
                  }
                "
                >编辑</el-button
              >
              <el-button v-if="$hasPower('ProjectPlanDeleteEpc') && row.status === 0" type="text" @click="remove(row)"
                >删除</el-button
              >
              <el-button
                v-if="row.status !== 0 && $hasPower('ProjectPlanWriteLogDetailEpc')"
                type="text"
                @click="$router.push('planReport/' + row.id + '/detail')"
                >填报记录</el-button
              >
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </div>
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
      @submit="save"
    ></Edit>

    <el-dialog destroy-on-close width="500px" title="导入" :visible.sync="importDialogVisible">
      <el-alert type="error" style="margin-bottom: 15px;">导入会覆盖所有任务，请谨慎操作</el-alert>
      <Upload v-model="importFile" accept=".mpp" raw></Upload>
      <footer slot="footer">
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button v-loading="importLoading" type="primary" :disabled="!importFile" @click="submitImport">
          导入
        </el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
import toTree from '@/utils/toTree'
import toFlat from '@/utils/toFlat'
import treeForEach from '@/utils/treeForEach'
import Edit from './components/Edit'
import treeFilter from '@/utils/treeFilter'
import jsonAsXlsx from 'json-as-xlsx'
import compareTaskList from '@/utils/compareTaskList'
import planAuditStatus from '../lib/planAuditStatus'
export default {
  name: 'ScheduleDetail',
  components: { Edit },
  data() {
    return {
      planAuditStatus,
      planId: null,
      list: [],
      originList: [],
      activeRow: {},
      activeNode: null,
      activeId: null,
      editDialogVisible: false,
      importDialogVisible: false,
      debugEventLog: [],
      importFile: null,
      importLoading: false,
      activeTask: {}
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
    async save(type = 1) {
      let form = {}
      let data = compareTaskList(this.list, this.originList)
      form = {
        type,
        ...data,
        projectId: localStorage.getItem('projectId'),
        planId: this.planId,
        projectName: localStorage.getItem('projectName')
      }
      if (this.planId) {
        form.planId = this.planId
      }
      return this.axios.schedule.post('epc/task/addOrUpdate', form).then(res => {
        this.$message.success('操作成功')
        this.refresh()
        if (!this.planId) this.planId = res.data
      })
    },
    submitImport() {
      this.importLoading = true
      let formData = new FormData()
      formData.append('projectId', localStorage.getItem('projectId'))
      formData.append('projectName', localStorage.getItem('projectName'))
      formData.append('file', this.importFile)
      this.axios.schedule
        .post('epc/plan/importProject', formData)
        .then(res => {
          this.importDialogVisible = false
          this.refresh()
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
        fileName: `${this.activeNode?.label || localStorage.getItem('projectName') + '总控计划'}`,
        extraLength: 3
      })
    },
    async remove(row) {
      if (_.size(row.children)) {
        this.$message.error('先删除下级任务才可以删除此任务')
      } else {
        await this.$tipRemove([row])
        this.list = treeFilter(this.list, e => e.id !== row.id)
        this.save()
      }
    },
    back() {
      this.$router.back()
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
    .task-list {
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
