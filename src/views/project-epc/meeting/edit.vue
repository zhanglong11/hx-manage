<template>
  <div class="no-padding is-footer">
    <el-form ref="form" label-width="120px" :model="form" :rules="rules">
      <el-card header="发起会议" style="overflow: visible;">
        <el-form-item label="会议名称" prop="meetingName">
          <el-input v-model="form.meetingName"></el-input>
        </el-form-item>
        <el-form-item label="会议主题" prop="meetingSubject">
          <el-input v-model="form.meetingSubject"></el-input>
        </el-form-item>
        <el-form-item label="发起人" prop="initiatorName">
          <el-input v-model="form.initiatorName"></el-input>
        </el-form-item>
        <el-form-item label="会议地点" prop="meetingAddress">
          <el-input v-model="form.meetingAddress"></el-input>
        </el-form-item>
        <el-form-item label="会议时间" prop="startTime">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            placeholder="开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="记录人" prop="recorderId">
          <SelectUser
            v-model="form.recorderId"
            value-format="id"
            :name.sync="form.recorderName"
            :multiple="false"
          ></SelectUser>
        </el-form-item>
        <el-form-item label="参会人员" prop="attenderList">
          <el-select v-model="form.attenderList" filterable allow-create style="width: 100%;" multiple>
            <el-option v-for="e in userList" :key="e.label" :label="e.label" :value="e.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议内容" prop="meetingContent">
          <el-input v-model="form.meetingContent" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }"></el-input>
        </el-form-item>
      </el-card>
      <el-card header="附件">
        <el-form-item label="会议资料">
          <FileEdit v-model="form.meetingFileId"></FileEdit>
        </el-form-item>
      </el-card>
    </el-form>
    <div class="footer-btn">
      <el-button size="lg" @click="$router.back()">返回</el-button>
      <el-button size="lg" type="primary" @click="save('save')">保存</el-button>
      <el-button size="lg" type="primary" @click="save('saveAndSubmit')">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Edit',
  data() {
    return {
      id: null,
      form: {
        attenderList: [],
        meetingType: 'meetingType_1',
        startTime: null,
        endTime: null,
        projectId: localStorage.getItem('projectId')
      },
      rules: {
        meetingName: [{ required: true, message: '必填' }],
        meetingSubject: [{ required: true, message: '必填' }],
        initiatorName: [{ required: true, message: '必填' }],
        meetingAddress: [{ required: true, message: '必填' }],
        startTime: [{ required: true, message: '必填' }],
        endTime: [{ required: true, message: '必填' }],
        attenderList: [{ required: true, message: '必填' }],
        recorderId: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    userList() {
      return _.unionBy(this.$store.state.userList, 'userId')
    },
    time: {
      get() {
        return this.form.startTime ? [this.form.startTime, this.form.endTime] : null
      },
      set(arr) {
        this.form.startTime = arr[0]
        this.form.endTime = arr[1]
      }
    }
  },
  created() {
    this.id = this.$route.params.id
    if (this.id) {
      this.refresh()
    }
  },
  mounted() {},
  methods: {
    refresh() {
      this.axios.system.get('systemMeeting/get/' + this.id).then(res => {
        res.data.attenderList = res.data.attenderList.map(e => e.attenderId || e.attenderName)
        this.form = res.data
      })
    },
    async save(action = 'save') {
      await this.$refs.form.validate()
      let form = _.cloneDeep(this.form)
      form.attenderList = form.attenderList.map(userId => {
        const target = _.find(this.userList, { userId })
        if (target) {
          return {
            attenderId: target.userId,
            attenderName: target.label
          }
        } else {
          return {
            attenderName: userId
          }
        }
      })
      this.axios.system.post('systemMeeting/' + action, form).then(res => {
        this.$message.success('操作成功')
        this.$router.back()
      })
    },
    remove() {}
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.el-card {
  margin-bottom: 15px;
}
.el-form {
  .el-form-item {
    display: inline-block;
    width: 50%;
    vertical-align: middle;
  }
}
</style>
