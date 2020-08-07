<!--
 * @Description: 会议详情
 * @Author:
 * @Date: 2020-01-17 16:27:45
 -->
<template>
  <el-dialog :visible="visible" width="740px" :title="type === 1 ? '一般会议' : '里程碑会议'" @close="close">
    <div class="max-height max-width">
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="会议主题:">{{ form.meetingTheme }}</el-form-item>
        <el-form-item v-if="type !== 1" label="关联任务:">{{ form.taskName }}</el-form-item>
        <el-form-item label="会议开始时间:">{{ form.meetingTime }}</el-form-item>
        <el-form-item label="会议地点:">{{ form.address }}</el-form-item>
        <el-form-item label="负责人:">{{ form.principalName }}</el-form-item>
        <el-form-item label="参会人员:">{{ form.participantName }}</el-form-item>
        <el-form-item label="讨论内容:">
          <el-input v-model="form.meetingContent" type="textarea" disabled></el-input>
        </el-form-item>
        <el-form-item label="会议纪要:">
          <el-input v-model="form.meetingSummary" type="textarea" disabled></el-input>
        </el-form-item>
        <el-form-item label="关联文件:">
          <!-- 存档文件 -->
          <el-table :data="tableData" style="width: 100%;" max-height="250" header-align="center">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="name" label="文件列表" align="center"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/design/meeting'
export default {
  name: 'MeetingDetails',
  props: {
    type: {
      type: Number,
      default: 1 //   1 普通会议  2 里程碑会议
    },
    milestone: Object,
    // 会议id
    meetingId: {
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      form: {
        participant: [],
        principal: null,
        files: []
      },
      visible: false,
      rules: {}
    }
  },
  watch: {
    visible: {
      handler: 'getDetails',
      immediate: true
    }
  },
  methods: {
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
    show() {
      this.visible = true
    },
    async getDetails() {
      if (!this.visible) return
      let res = await api.getMeetingDetails(this.meetingId)
      this.form = res.data ? res.data : {}
      this.getTable()
    },
    close() {
      this.visible = false
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
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
