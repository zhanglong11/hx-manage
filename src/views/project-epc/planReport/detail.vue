<template>
  <div class="main is-footer no-padding">
    <el-card header="填报记录">
      <el-form ref="taskForm" label-positon="left" label-width="120px" disabled>
        <el-form-item label="任务名称" prop="name">
          <div v-text="task.name"></div>
        </el-form-item>
        <el-form-item label="任务类型" prop="type">
          {{ ['一般任务', '里程碑任务'][task.type - 1] }}
        </el-form-item>
        <el-form-item label="父级" prop="parentTaskUniqueId">
          <div v-text="task.pidName"></div>
        </el-form-item>
        <el-form-item label="任务编号" prop="wbsCode">
          <div disabled style="width: 120px;" v-text="task.wbsCode"></div>
        </el-form-item>
        <el-form-item label="前置任务" prop="preTaskId">
          <div v-text="task.preTaskName"></div>
        </el-form-item>
        <el-form-item label="计划开始日期" prop="planStartTime">
          <div v-text="task.planStartTime"></div>
        </el-form-item>
        <el-form-item label="计划结束日期" prop="planEndTime">
          <div v-text="task.planEndTime"></div>
        </el-form-item>
        <el-form-item label="工期" prop="planDuration">
          <div>{{ task.planDuration }}天</div>
        </el-form-item>
        <el-form-item label="实际开始时间" prop="actualStartTime">
          <div v-text="task.actualStartTime"></div>
        </el-form-item>
        <el-form-item label="实际结束时间" prop="actualEndTime">
          <div v-text="task.actualEndTime"></div>
        </el-form-item>
        <el-form-item label="实际工期" prop="actualDuration">
          <div>{{ task.realityDuration }}天</div>
        </el-form-item>
        <el-form-item label="当前进度" prop="actualProgress">
          <div>{{ task.actualProgress }}</div>
        </el-form-item>
        <el-form-item label="责任人">
          <div v-text="task.principalName"></div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card header="填报记录明细" style="margin-top: 20px;">
      <vxe-table :data="list">
        <vxe-table-column
          title="当前进度"
          field="currentProgress"
          width="100px"
          :formatter="({ cellValue }) => cellValue + '%'"
        ></vxe-table-column>
        <vxe-table-column title="进度情况" field="remark"></vxe-table-column>
        <vxe-table-column title="附件" field="fileIds" width="100px">
          <template v-slot="{ row }">
            <AttachmentDialog :ids="row.fileIds"></AttachmentDialog>
          </template>
        </vxe-table-column>
        <vxe-table-column title="填报时间" field="createTime" width="160px"></vxe-table-column>
      </vxe-table>
    </el-card>
    <footer class="footer-btn">
      <el-button size="normal" @click="$router.go(-1)">返回</el-button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      task: {},
      list: [] // 填报记录
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      if (this.id) {
        await this.axios.schedule.get('epc/task/get/' + this.id).then(res => {
          res.data.actualProgress = res.data.actualProgress * 100 + '%'
          this.task = res.data
        })
        this.axios.schedule
          .post('epc/task/reportList', {
            taskUniqueId: this.task.taskUniqueId,
            projectId: localStorage.getItem('projectId'),
            page: 1,
            rows: 1000
          })
          .then(res => {
            this.list = res.data.records
          })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 600px;
}
</style>
