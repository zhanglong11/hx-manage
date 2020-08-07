<!--
 * @Description: 修改会议通知
 * @Author:
 * @Date: 2020-01-17 16:27:45
 -->
<template>
  <el-dialog :visible="visible" width="740px" :title="type === 1 ? '一般会议' : '里程碑会议'" @close="close">
    <div class="max-height padding-width">
      <el-form ref="form" :rules="rules" :model="form" label-width="140px">
        <el-form-item label="会议地点" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="会议开始时间" prop="meetingTime">
          <el-date-picker
            v-model="form.meetingTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="负责人" prop="principal">
          <SelectUser v-model="form.principal" :multiple="false"></SelectUser>
        </el-form-item>
        <el-form-item label="参会人员" prop="participant">
          <SelectUser v-model="form.participant"></SelectUser>
        </el-form-item>
        <el-form-item label="讨论内容" prop="meetingContent">
          <el-input v-model="form.meetingContent" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox>发出会议通知到每个参会人</el-checkbox>
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
  name: 'Modification',
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
      formData: {
        // 备份标记
        // backupFlag:1
        meetingId: ''
      },
      form: {
        participant: [],
        principal: null,
        files: [{ name: '文件' }]
      },
      visible: false,
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
    async getDetails() {
      if (!this.visible) return
      this.formData.meetingId = this.meetingId
      let res = await api.getMeetingDetails(this.meetingId)
      this.form = res.data
      // 参会人员
      if (res.data.participantId && res.data.participantName) {
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
      }
      if (res.data.principalId) {
        let item = {
          id: res.data.principalId,
          name: res.data.principalName,
          label: res.data.principalName
        }
        this.form.principal = item
      }
      this.getTable()
    },
    show() {
      this.visible = true
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
        form.participantName = form.participant.map(e => e.name).join(',')
      }
      if (form.principal) {
        form.principalId = form.principal.id
        form.principalName = form.principal.name
      }
      let fileIdList = this.tableData.map(item => item.id)
      form.fileIdList = fileIdList ? fileIdList : []
      this.addModification(form)
    },
    async addModification(form) {
      let res = await api.meetingUpdate(form)
      this.close()
      this.$emit('success')
      return this.$message.success('修改会议通知成功')
    },
    uploadSuccess(e, f) {
      if (e.code === 200) {
        this.tableData.push({ name: f[0].name, id: e.data })
      }
    }
  }
}
</script>

<style scoped lang="less">
.max-height {
  max-height: 400px;
  overflow-y: scroll;
}
.padding-width {
  padding: 0 16px 0 0;
}
</style>
