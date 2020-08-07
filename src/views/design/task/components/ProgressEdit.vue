<template>
  <el-dialog width="700px" :title="`编辑进度(${task.name})`" :visible="visible" @close="close">
    <div id="process-edit">
      <el-form ref="form" label-positon="left" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="实际开始时间" prop="actualStartTime">
          <el-date-picker v-model="form.actualStartTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="实际结束时间" prop="actualEndTime">
          <el-date-picker v-model="form.actualEndTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="实际工期" prop="realityDuration">
          <input-number v-model="form.realityDuration" unit="天" style="width: 150px;"> </input-number>
        </el-form-item>
        <el-form-item label="当前进度" prop="actualProgress">
          <input-number v-model="form.actualProgress" unit="%" style="width: 150px;"> </input-number>
        </el-form-item>
        <el-form-item label="活动状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">未开始</el-radio>
            <el-radio :label="1">进行中</el-radio>
            <el-radio :label="2">已结束</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">{{ task.taskUniqueId ? '保存' : '创建' }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ProgressEdit',
  props: {
    visible: Boolean,
    task: Object
  },
  data() {
    return {
      form: {
        actualProgress: 0,
        status: 0,
        realityDuration: null,
        actualStartTime: null,
        actualEndTime: null
      },
      rules: {
        actualProgress: [
          { required: true, message: '必填' },
          {
            validator(rule, val, callback) {
              if (val > 100) {
                callback(new Error('非法'))
              }
              callback()
            },
            message: '非法'
          }
        ],
        status: [{ required: true, message: '必填' }],
        realityDuration: [{ required: true, message: '必填' }],
        actualStartTime: [{ required: true, message: '必填' }],
        actualEndTime: [
          { required: true, message: '必填' },
          {
            validator: (rule, val, callback) => {
              if (moment(val).isBefore(this.form.planEndTime)) {
                callback(new Error('结束时间必须大于开始时间'))
              }
              callback()
            }
          }
        ]
      }
    }
  },
  computed: {},
  watch: {
    task(val) {
      this.form = Object.assign(
        {},
        this.form,
        _.pick(val, ['actualProgress', 'status', 'realityDuration', 'actualStartTime', 'actualEndTime', 'id'])
      )
    }
  },
  methods: {
    async submit() {
      await this.$refs.form.validate()
      await this.axios.schedule.post('schedule/task/updateOnWay/', this.form)
      this.$message.success('编辑成功')
      this.$emit('update:visible', false)
      this.$parent.refresh()
    },
    async close() {
      await this.$nextTick()
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
.el-table {
  overflow: visible;
  /deep/ .cell {
    overflow: visible;
  }
  /deep/ .el-table__body-wrapper {
    overflow: visible;
  }
}
</style>
