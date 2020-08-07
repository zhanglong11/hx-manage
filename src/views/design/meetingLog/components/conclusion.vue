<!--
 * @Description: 会议结论
 * @Author:
 * @Date: 2020-01-17 16:27:45
 -->
<template>
  <el-dialog :visible="visible" width="740px" :title="type === 1 ? '一般会议' : '里程碑会议'" @close="close">
    <div class="max-height max-width">
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="会议主题">{{ form.meetingTheme }}</el-form-item>
        <el-form-item label="会议开始时间">{{ form.meetingTime }}</el-form-item>
        <el-form-item label="会议地点">{{ form.address }}</el-form-item>
        <el-form-item label="负责人">{{ form.principalName }}</el-form-item>
        <el-form-item label="实际参会人员" prop="participant">
          <SelectUser v-model="form.participant"></SelectUser>
        </el-form-item>
        <el-form-item label="讨论内容" prop="meetingContent">
          <el-input v-model="form.meetingContent" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="会议纪要" prop="meetingSummary">
          <el-input v-model="form.meetingSummary" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="会议结论" prop="meetingConclusion">
          <el-radio-group v-model="form.meetingConclusion">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="结论批准人" prop="approverIdInfo">
          <SelectUser v-model="form.approverIdInfo" :multiple="false"></SelectUser>
        </el-form-item>
        <el-form-item prop="sendMeetingNotice">
          <el-checkbox v-model="form.sendMeetingNotice" :true-label="1" :false-label="0"
            >发出会议结论到消息</el-checkbox
          >
        </el-form-item>
        <el-form-item label="关联文件">
          <Upload :isOnlyButton="true" @input="uploadSuccess"></Upload>
        </el-form-item>
        <el-form-item>
          <!-- 存档文件 -->
          <el-table :data="tableData" style="width: 100%;" max-height="250" header-align="center">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="name" label="文件列表" align="center"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="remove(scope.$index, tableData)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/design/meeting'
export default {
  name: 'Conclusion',
  props: {
    type: {
      type: Number,
      default: 1 //   1 普通会议  2 里程碑会议
    },
    // 会议id
    meetingId: {
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      form: {
        approverIdInfo: null,
        participant: [],
        principal: null,
        files: [{ name: '文件' }]
      },
      visible: false,
      rules: {
        approverIdInfo: [{ required: true, message: '必填' }],
        meetingTheme: [{ required: true, message: '必填' }],
        meetingTime: [{ required: true, message: '必填' }],
        address: [{ required: true, message: '必填' }],
        principal: [{ required: true, message: '必填' }],
        participant: [{ required: true, message: '必填' }],
        meetingContent: [{ required: true, message: '必填' }],
        meetingConclusion: [{ required: true, message: '必选' }]
      }
    }
  },
  watch: {
    visible: {
      handler: 'getDetails',
      immediate: true
    }
  },
  methods: {
    remove(index, rows) {
      rows.splice(index, 1)
    },
    uploadSuccess(e, f) {
      if (e.code === 200) {
        this.tableData.push({ name: f[0].name, id: e.data })
      }
    },
    show() {
      this.visible = true
    },
    async getDetails() {
      if (!this.visible) return
      let res = await api.getMeetingDetails(this.meetingId)
      this.form = res.data
      if (!res.data.participantId) return

      let participant = []
      let ids = res.data.participantId.split(',')
      let names = res.data.participantName.split(',')
      for (let i = 0; i < res.data.participantId.split(',').length; i++) {
        let item = {
          id: ids[i],
          name: names[i],
          label: names[i]
        }
        participant.push(item)
      }
      this.form.participant = participant
      this.getTable()
    },
    // 获取文件列表
    async getTable() {
      let res = await api.getMeetingFileList({
        meetingId: this.meetingId,
        page: null,
        rows: null
      })
      if (res.data && res.data.records) {
        this.tableData = res.data.records.map(item => {
          let obj = {
            name: item.fileName,
            id: item.fileId
          }
          return obj
        })
      }
    },
    close() {
      this.visible = false
      this.tableData = []
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    async submit() {
      await this.$refs.form.validate()
      let form = _.cloneDeep(this.form)
      if (_.size(form.participant)) {
        form.participantId = form.participant.map(e => e.id).join(',')
        form.participantName = form.participant.map(e => e.userRealName).join(',')
      }
      if (form.principal) {
        form.principalId = form.principal.id
        form.principalName = form.principal.name
      }
      // 批准人
      if (form.approverIdInfo) {
        form.approverId = form.approverIdInfo.id
        form.approverName = form.approverIdInfo.name
      }
      form.type = this.type
      let fileIdList = this.tableData.map(item => item.id)
      form.fileIdList = fileIdList ? fileIdList : []
      this.addConclusion(form)
    },
    async addConclusion(form) {
      let res = await api.addConclusion(form)
      this.close()
      this.$emit('success')
      return this.$message.success('会议结论填写成功')
    }
  }
}
</script>

<style scoped lang="less">
.max-height {
  max-height: 400px;
  overflow-y: scroll;
}
.max-width {
  padding: 0 16px 0 0;
}
</style>
