<template>
  <el-dialog
    :visible="visible"
    width="700px"
    destroy-on-close
    :title="type === 1 ? '一般会议' : '里程碑会议'"
    @close="$emit('update:visible', false)"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="会议主题" prop="meetingTheme">
        <el-input v-model="form.meetingTheme"></el-input>
      </el-form-item>
      <el-form-item label="会议时间" prop="meetingTime">
        <el-date-picker v-model="form.meetingTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="会议地点" prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="principal">
        <SelectUser v-model="form.principal" :multiple="false"></SelectUser>
      </el-form-item>
      <el-form-item label="参会人员" prop="participant">
        <SelectUser v-model="form.participant"></SelectUser>
      </el-form-item>
      <el-form-item label="讨论内容" prop="meetingContent">
        <el-input v-model="form.meetingContent"></el-input>
      </el-form-item>
      <el-form-item label="关联文件">
        <Upload style="display: inline-block; margin-right: 15px;" :isOnlyButton="true" @input="uploadSuccess"></Upload>
        <el-button v-if="type === 2" @click="selectFileDialogVisible = true">从工作区中选择</el-button>
        <SelectFile
          :visible.sync="selectFileDialogVisible"
          :milestone="milestone"
          @change="handleSelectFileChange"
        ></SelectFile>
      </el-form-item>
      <el-form-item label="关联文件">
        <el-table :data="files" style="width: 100%;" max-height="250" header-align="center">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="name" label="文件列表" align="center"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="remove(scope.$index, files)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item prop="sendMeetingNotice">
        <el-checkbox v-model="form.sendMeetingNotice" :true-label="1" :false-label="0"
          >发出会议通知到每个参会人</el-checkbox
        >
      </el-form-item>
    </el-form>
    <!-- 存档文件 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">创建</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SelectFile from './SelectFile'
export default {
  name: 'AddMeeting',
  components: { SelectFile },
  props: {
    taskName: {},
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1 //   1 普通会议  2 里程碑会议
    },
    milestone: Object
  },
  data() {
    return {
      files: [],
      selectFileDialogVisible: false,
      form: {
        participant: [],
        principal: null
      },
      rules: {
        meetingTheme: [{ required: true, message: '必填' }],
        meetingTime: [{ required: true, message: '必填' }],
        address: [{ required: true, message: '必填' }],
        principal: [{ required: true, message: '必填' }],
        participant: [{ required: true, message: '必填' }],
        meetingContent: [{ required: true, message: '必填' }]
      }
    }
  },
  methods: {
    uploadSuccess(e, f) {
      if (e.code === 200) {
        this.files.push({ name: f[0].name, id: e.data })
      }
    },
    remove(index, rows) {
      rows.splice(index, 1)
    },
    handleSelectFileChange(arr) {
      this.files = _.unionBy(this.files, arr, 'id')
    },
    async submit() {
      await this.$refs.form.validate()
      let form = _.cloneDeep(this.form)
      if (_.size(form.participant)) {
        form.participantId = form.participant.map(e => e.id).join(',')
        form.participantName = form.participant.map(e => e.name).join(',')
      }
      if (form.principal) {
        form.principalId = form.principal.id
        form.principalName = form.principal.name
      }
      if (this.milestone) form.taskId = this.milestone.id
      let fileIdList = this.files.map(item => item.id)
      form.fileIdList = fileIdList ? fileIdList : []
      if (this.type !== 1) form.taskName = this.taskName
      this.axios.design
        .post('project/meeting/add', {
          type: this.type,
          projectId: localStorage.getItem('projectId'),
          ...form
        })
        .then(res => {
          this.$message.success('发起成功')
          this.$emit('update:visible', false)
          this.$emit('addSuccess')
          this.$refs.form.resetFields()
          this.files = []
        })
    }
  }
}
</script>

<style scoped lang="less"></style>
