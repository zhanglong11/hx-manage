<template>
  <div>
    <div class="tooltips">
      <el-form ref="filterForm" :model="filterForm" inline>
        <!-- <el-form-item label="分类" prop="type">
          <SelectProcessCategory v-model="filterForm.processCategory"></SelectProcessCategory>
        </el-form-item> -->
        <el-form-item label="名称" prop="name">
          <el-input v-model="filterForm.name" placeholder="请搜索">
            <el-button slot="append" size="mini" icon="el-icon-search" @click="refresh(true)"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <!--
    /**
     任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
     开发人员：李建敏
     日期：2020-3月-17日
     任务类型：2、复制修改代码 （1行）
     **/
     -->
    <Grid ref="table" auto-search :filter-form.sync="filterForm" :request="request">
      <vxe-table-column field="taskId" title="ID"></vxe-table-column>
      <vxe-table-column field="taskName" title="流程实例名称"></vxe-table-column>
      <vxe-table-column field="processDefinitionName" title="流程定义名称"></vxe-table-column>
      <vxe-table-column field="applyUserName" title="申请人"></vxe-table-column>
      <vxe-table-column field="taskStatus" title="流程状态">
        待审批
      </vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作" width="170px">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('WorkflowTodoCheck')" size="mini" type="text" @click="viewTask(scope.row, 0)"
            >审批</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
    <!-- <Edit :task="activeTask" :visible.sync="editDialogVisible"></Edit> -->
  </div>
</template>

<script>
//import Edit from './components/Edit'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （1行）
 **/
import SelectProcessCategory from '../components/SelectProcessCategory'
import { workBenchApi } from '@/views/work-bench/api/work-bench'
let tempList = {
  total: 1,
  records: [
    {
      taskId: '32739',
      taskName: '材料员一发起的物资与设备管理的“20200428需用-计划”',
      taskDefinitionKey: null,
      processDefinitionId: 'need_plan:1:100',
      processDefinitionCategory: 'start_apply',
      targetId: '140b17ea77824afabdc677cafe205316',
      processInstanceId: '32729',
      applyUserId: 'b7b6a2808d514a08804bd683f8d3f84e',
      applyUserName: '材料员一',
      owner: null,
      assignee: 'b7b6a2808d514a08804bd683f8d3f84e',
      createTime: '2020-04-28 16:52:39',
      endTime: null,
      dueDate: null,
      taskVariables: { taskDelegateName: '材料员一', taskDelegateId: 'b7b6a2808d514a08804bd683f8d3f84e' },
      projectId: '01b2a1d7857d476fbf3efdfce1d5dea1',
      companyId: 'f4d122e61c2f4bfbb279d3c7694c890e'
    }
  ]
}
export default {
  name: 'Todo',
  /**
   任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
   开发人员：李建敏
   日期：2020-3月-17日
   任务类型：2、复制修改代码 （1行）
   **/
  components: {},
  props: {
    // 是否是工作台操作
    isWorkBench: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editDialogVisible: false,
      activeTask: {},
      filterForm: {
        sortField: 'createTime',
        sortValue: 'desc',
        taskStatus: 0,
        projectId: localStorage.getItem('projectId')
      },
      /**
       任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
       开发人员：李建敏
       日期：2020-3月-17日
       任务类型：2、复制修改代码 （1行）
       **/
      request: body => {
        body.projectId = this.isWorkBench ? '' : this.$store.state.project.projectId
        return this.axios.workflow.post('task/list', body).then(res => res.data) //res.data
      }
    }
  },
  watch: {
    'filterForm.processStatus'(val) {
      localStorage.setItem('lastSelectProcessStatus', val)
    }
  },
  mounted() {
    this.queryProjectList() // 获取项目列表
  },
  methods: {
    // 刷新 列表
    refresh() {
      this.$refs.table.refresh()
    },
    /**
     任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
     开发人员：李建敏
     日期：2020-3月-17日
     任务类型：2、复制修改代码 （1行）
     **/
    agree(row) {
      this.axios.workflow.post('task/complete/' + row.taskId, {})
      this.refresh()
    },
    // 获取项目列表
    async queryProjectList() {
      const result = await workBenchApi.queryProjectList({ page: 1, rows: 999 })
      const datas = (result.data && result.data.records) || []
      this.projectDataList = datas
    },
    // 查看任务
    viewTask(item, index) {
      let routerName = this.$enum.getDescByValue('APPROVAL_TYPE', item.processDefinitionCategory)
      if (routerName) {
        this.$store.commit('setApprovalType', {
          index,
          item,
          routerName,
          projectDataList: this.projectDataList
        })
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
