<template>
  <div class="container is-footer">
    <div class="info">
      <ul>
        <li>
          <span>会议主题</span><span>{{ form.meetingSubject }}</span>
        </li>
        <li>
          <span>会议名称</span><span>{{ form.meetingName }}</span>
        </li>
        <li>
          <span>发起人</span><span>{{ form.initiatorName }}</span>
        </li>
        <li>
          <span>会议地点</span><span>{{ form.meetingAddress }}</span>
        </li>
        <li style="width: 100%;">
          <span>会议时间</span><span>{{ form.startTime }} - {{ form.endTime }}</span>
        </li>
        <li>
          <span>参与人员</span><span>{{ _.join(_.map(form.attenderList, 'attenderName'), ',') }}</span>
        </li>
        <li>
          <span>会议内容</span><span>{{ form.meetingContent }}</span>
        </li>
        <li style="width: 100%;">
          <span>会议状态</span><span>{{ $getLabel(meetingStatusList, form.status) }}</span>
        </li>
        <li style="width: 100%;">
          <span>记录人</span><span>{{ form.recorderName }}</span>
        </li>
        <li style="width: 80%;">
          <span><i style="color: #f56c6c;">* </i>会议结果记录</span>
          <el-input v-model="form.meetingResult" type="textarea" :autosize="{ minRows: 3, maxRows: 10 }"></el-input>
        </li>
        <li style="width: 100%;">
          <span>会议资料</span><AttachmentDialog :ids="form.meetingFileId"></AttachmentDialog>
        </li>
        <li><span>会议纪要</span><FileEdit v-model="form.resultFileId"></FileEdit></li>
      </ul>
    </div>
    <footer class="footer-btn">
      <el-button size="lg" @click="$router.back()">返回</el-button>
      <el-button size="lg" type="primary" @click="save('saveResult')">保存</el-button>
      <el-button size="lg" type="primary" @click="save('saveResultAndSubmit')">保存并提交</el-button>
    </footer>
  </div>
</template>

<script>
import meetingStatusList from '../lib/meetingStatusList'
export default {
  name: 'Record',
  data() {
    return {
      id: null,
      form: {},
      meetingStatusList
    }
  },
  created() {
    this.id = this.$route.params.id
    this.refresh()
  },
  mounted() {},
  methods: {
    refresh() {
      this.axios.system.get('systemMeeting/get/' + this.id).then(res => {
        this.form = res.data
      })
    },
    save(action = 'saveResult') {
      let form = _.cloneDeep(this.form)
      if (!form.meetingResult) {
        this.$message.error('会议结果必填')
        return false
      }
      this.axios.system.post('systemMeeting/' + action, form).then(res => {
        this.$message.success('操作成功')
        this.$router.back()
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.info {
  ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    li {
      width: 50%;
      padding: 10px 0;
      display: flex;
      align-items: flex-start;
      span:first-child {
        width: 140px;
        color: #666;
        &:after {
          content: '：';
        }
      }
    }
  }
}
</style>
