<template>
  <!--/**
  任务名称：2868/修改bug
  开发人员：李建敏
  日期：2020-3月-7日
  任务类型：1.全新代码
  **/-->
  <!--
/**
bug名称：bug#1209,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220
开发人员：李建敏
日期：2020-3月-23日
任务类型：2、修改代码（50%）
**/
-->
  <div class="main is-footer">
    <div>
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
          <input-number v-model="task.realityDuration" disabled unit="天"> </input-number>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="form" label-positon="left" label-width="120px" :rules="rules">
        <el-form-item label="当前进度" prop="actualProgress">
          <InputNumber v-model="form.actualProgress" :min="0" :max="100" unit="%"></InputNumber>
        </el-form-item>
        <el-form-item label="责任人">
          <div v-text="task.principalName"></div>
        </el-form-item>
        <el-form-item label="进度情况" prop="remark">
          <el-input v-model="form.remark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="fileIds">
          <Upload v-model="form.fileIds" multiple></Upload>
        </el-form-item>
      </el-form>
    </div>
    <footer class="footer-btn">
      <el-button size="normal" @click="$router.go(-1)">取消</el-button>
      <el-button size="normal" type="primary" @click="submit">保存</el-button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Edit',
  data() {
    return {
      task: {},
      form: {
        taskId: this.$route.query.taskId,
        actualProgress: 0
      },
      rules: {
        actualProgress: [{ required: true, message: '必填' }]
      }
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
    refresh() {
      if (this.id) {
        this.axios.schedule.get('epc/task/get/' + this.id).then(res => {
          this.task = res.data
          this.form.actualProgress = res.data.actualProgress * 100
        })
      }
    },
    async submit() {
      await this.$refs.form.validate()
      await this.axios.schedule.post('epc/task/report', {
        ...this.form,
        taskId: this.id
      })
      this.$message.success('保存成功')
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
div.main {
  background-color: #f0f2f5;
  padding: 0;
  > * {
    background-color: #fff;
    padding: 25px;
    > .el-form {
      width: 600px;
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
  padding: 10px !important;
}
</style>
