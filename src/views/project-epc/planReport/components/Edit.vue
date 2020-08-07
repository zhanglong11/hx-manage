<template>
  <el-dialog
    width="720px"
    :title="
      (task.taskUniqueId ? (!canEdit && projectStart ? '' : '编辑') : '新建') + (form.type === 1 ? '任务' : '里程碑')
    "
    :visible="visible"
    @opened="refresh"
    @close="close"
  >
    <div id="process-edit">
      <el-form ref="form" label-positon="left" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" :disabled="type !== 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" prop="type">
          <el-radio-group v-model="form.type" :disabled="type !== 'edit'">
            <el-radio :label="2">里程碑任务</el-radio>
            <el-radio :label="1">一般任务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="父级" prop="parentTaskUniqueId">
              <SelectTask
                v-model="form.parentTaskUniqueId"
                :disabled="type !== 'edit'"
                :options="taskList"
                :disableKeys="[form.taskUniqueId]"
              ></SelectTask>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务编号" prop="wbsCode">
              <el-input v-model="form.wbsCode" disabled style="width: 120px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="前置任务" prop="preTaskId">
          <SelectTask
            v-model="form.preTaskId"
            :disabled="type !== 'edit'"
            multiple
            style="width: 100%;"
            :options="computedTaskList"
            :disableKeys="[form.taskUniqueId]"
          ></SelectTask>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="计划开始时间" prop="planStartTime">
              <el-date-picker
                v-model="form.planStartTime"
                :disabled="type !== 'edit'"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划结束时间" prop="planEndTime">
              <el-date-picker
                v-model="form.planEndTime"
                :disabled="type !== 'edit'"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工期" prop="planDuration">
              <InputNumber v-model="form.planDuration" disabled unit="天"> </InputNumber>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前进度" prop="progress">
              <InputNumber v-model="form.progress" disabled unit="%"></InputNumber>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="实际开始时间" prop="actualStartTime">
              <el-date-picker
                v-model="form.actualStartTime"
                :disabled="type !== 'progressEdit'"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际结束时间" prop="actualEndTime">
              <el-date-picker
                v-model="form.actualEndTime"
                :disabled="type !== 'progressEdit'"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="实际工期" prop="actualDuration">
              <input-number v-model="form.actualDuration" disabled unit="天"> </input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">{{ task.taskUniqueId ? '保存' : '创建' }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import toFlat from '@/utils/toFlat'
import SelectTask from './SelectTask'
import treeFind from '@/utils/treeFind'
export default {
  name: 'Edit',
  components: { SelectTask },
  props: {
    visible: Boolean,
    task: Object,
    taskList: Array,
    parent: Object,
    type: {
      type: String,
      required: true
    },
    projectStart: {
      type: Boolean,
      default: false
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        type: 2, // 1 一般任务  2 里程碑
        preTaskId: [],
        status: 0,
        wbsCode: '',
        parentTaskUniqueId: null,
        resourceList: [],
        planDuration: null,
        planStartTime: null,
        planEndTime: null
      },
      rules: {
        type: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }],
        parentTaskUniqueId: [{ required: false, message: '必填' }],
        planDuration: [{ required: true, message: '必填' }],
        planStartTime: [
          { required: true, message: '必填' },
          {
            validator: (rule, val, callback) => {
              if (val) {
                if (!this.form.parentTaskUniqueId) {
                  for (let task of this.taskList) {
                    if (
                      task.taskUniqueId !== this.form.taskUniqueId &&
                      moment(val).isBefore(task.planEndTime) &&
                      moment(val).isAfter(task.planStartTime)
                    ) {
                      callback(new Error('与' + task.name + '时间有重叠'))
                    }
                  }
                } else {
                  let parent = _.find(this.flatList, { taskUniqueId: this.form.parentTaskUniqueId })
                  if (parent) {
                    if (moment(val).isBefore(parent.planStartTime) || moment(val).isAfter(parent.planEndTime)) {
                      callback(new Error('时间必须在父任务范围之内'))
                    }
                  }
                }
              }
              callback()
            }
          }
        ],
        planEndTime: [
          { required: true, message: '必填' },
          {
            validator: (rule, val, callback) => {
              if (moment(val).isBefore(this.form.planStartTime)) {
                callback(new Error('结束时间必须大于开始时间'))
              }
              if (!this.form.parentTaskUniqueId) {
                for (let task of this.taskList) {
                  if (
                    task.taskUniqueId !== this.form.taskUniqueId &&
                    moment(val).isBefore(task.planEndTime) &&
                    moment(val).isAfter(task.planStartTime)
                  ) {
                    callback(new Error('与任务') + task.name + '时间有重叠')
                  }
                }
              } else {
                let parent = _.find(this.flatList, { taskUniqueId: this.form.parentTaskUniqueId })
                if (parent) {
                  if (moment(val).isBefore(parent.planStartTime) || moment(val).isAfter(parent.planEndTime)) {
                    callback(new Error('时间必须在父任务范围之内'))
                  }
                }
              }
              callback()
            }
          }
        ]
      }
    }
  },
  computed: {
    treeData() {
      return this.$store.state.design.processGroupListTree
    },
    flatList() {
      return toFlat(this.taskList)
    },
    computedTaskList() {
      let taskList = _.cloneDeep(this.taskList)
      if (!this.form.parentTaskUniqueId) {
        return taskList.map(e => _.omit(e, 'children')).filter(e => e.taskUniqueId !== this.form.taskUniqueId)
      } else {
        let parent = treeFind(taskList, e => e.taskUniqueId === this.form.parentTaskUniqueId)
        _.forEach(parent.children, e => delete e.children)
        if (_.size(parent.children)) {
          parent.children = parent.children.filter(e => e.taskUniqueId !== this.form.taskUniqueId)
          if (parent.children.length === 0) delete parent.children
        }
        return [parent]
      }
    }
  },
  watch: {
    'form.parentTaskUniqueId'() {
      this.calculateWbsCode()
    },
    form() {
      if ('' + this.form.wbsCode === '1') {
        this.rules.parentTaskUniqueId[0].required = false
      }
    },
    'form.type'(val) {
      if ('' + this.form.wbsCode === '1') {
        this.rules.parentTaskUniqueId[0].required = false
      } else {
        this.rules.parentTaskUniqueId[0].required = val === 1
      }
    },
    'form.planStartTime'(val) {
      if (val && !this.form.planEndTime) {
        this.form.planEndTime = val
      }
    },
    'form.planEndTime'(val) {
      if (val && this.form.planStartTime) {
        this.form.planDuration = moment(val).diff(this.form.planStartTime, 'days') + 1
      }
    }
  },
  methods: {
    calculateWbsCode() {
      let parent = treeFind(this.taskList, e => e.taskUniqueId === this.form.parentTaskUniqueId)
      let baseList = parent ? parent.children || [] : this.taskList
      let current = _.pick(this.form, ['planStartTime'])
      if (!current.planStartTime) current.planStartTime = '9999'
      const index =
        _.sortedIndexBy(
          baseList.filter(e => e.taskUniqueId !== this.form.taskUniqueId),
          current,
          e => e.planStartTime
        ) + 1
      if (parent) {
        this.form.wbsCode = parent.wbsCode + '.' + index
      } else {
        this.form.wbsCode = index
      }
    },
    refresh() {
      if (!this.task.taskUniqueId) {
        if (_.size(this.taskList)) {
          this.form.planStartTime = moment(_.last(this.taskList).planEndTime)
            .add(1, 'days')
            .format('YYYY-MM-DD 00:00:00')
        }
        this.calculateWbsCode()
        return false
      }
      let form = _.cloneDeep(this.task)
      if (form.preTaskId && form.preTaskId !== '0') form.preTaskId = form.preTaskId.split(',').map(e => +e)
      else form.preTaskId = []
      if (!form.parentTaskUniqueId) form.parentTaskUniqueId = null
      if (_.size(form.resourceList)) form.resourceList = form.resourceList.map(e => ({ id: e.userId }))
      this.form = form
    },
    async submit() {
      await this.$refs.form.validate()
      let form = _.cloneDeep(this.form)
      Object.assign(form, {
        projectId: localStorage.getItem('projectId'),
        projectName: localStorage.getItem('projectName')
      })
      if (_.size(form.preTaskId)) {
        form.preTaskCodes = form.preTaskId.map(id => _.find(this.flatList, { taskUniqueId: id }).name).join(',')
        form.preTaskId = form.preTaskId.join(',')
      } else {
        form.preTaskId = 0
      }
      if (!form.parentTaskUniqueId) form.parentTaskUniqueId = 0
      form.planStartTime = moment(form.planStartTime).format('YYYY-MM-DD 00:00:00')
      form.planEndTime = moment(form.planEndTime).format('YYYY-MM-DD 23:59:59')
      if (form.resourceList)
        form.resourceList = form.resourceList.map(e => ({
          organId: e.organId,
          userId: e.taskUniqueId,
          userName: e.name
        }))
      if (!form.taskUniqueId) {
        form.taskUniqueId = _.max(this.flatList.map(e => e.taskUniqueId)) + 1 || 1
      }
      if (this.task.taskUniqueId) {
        let target = _.find(this.$parent.list, { taskUniqueId: this.task.taskUniqueId })
        Object.assign(target, form)
        this.$parent.list = this.$parent.list.slice()
      } else {
        console.log(this.$parent)
        this.$parent.list.push(_.omit(form, 'children'))
      }
      this.$emit('update:visible', false)
    },
    async close() {
      await this.$nextTick()
      this.$refs.form.resetFields()
      this.form.taskUniqueId = null
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
