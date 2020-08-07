<template>
  <div class="container is-footer">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="info">
      <ul>
        <li>
          <span>会议主题</span><span>{{ detail.meetingSubject }}</span>
        </li>
        <li>
          <span>会议名称</span><span>{{ detail.meetingName }}</span>
        </li>
        <li>
          <span>发起人</span><span>{{ detail.initiatorName }}</span>
        </li>
        <li>
          <span>会议地点</span><span>{{ detail.meetingAddress }}</span>
        </li>
        <li style="width: 100%;">
          <span>会议时间</span><span>{{ detail.startTime }} - {{ detail.endTime }}</span>
        </li>
        <li>
          <span>参与人员</span><span>{{ _.join(_.map(detail.attenderList, 'attenderName'), ',') }}</span>
        </li>
        <li>
          <span>会议内容</span><span>{{ detail.meetingContent }}</span>
        </li>
        <li style="width: 100%;">
          <span>会议状态</span><span>{{ $getLabel(meetingStatusList, detail.status) }}</span>
        </li>
        <li style="width: 100%;">
          <span>记录人</span><span>{{ detail.recorderName }}</span>
        </li>
        <li>
          <span>会议结果记录</span><span>{{ detail.meetingResult }}</span>
        </li>
        <li style="width: 100%;">
          <span>会议资料</span><AttachmentDialog :ids="detail.meetingFileId"></AttachmentDialog>
        </li>
        <li><span>会议纪要</span><AttachmentDialog :ids="detail.resultFileId"></AttachmentDialog></li>
      </ul>
    </div>
    <template v-if="detail.status === 1 && $route.query.isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <footer class="footer-btn">
      <el-button v-if="!$route.query.isCheck" size="lg" @click="$router.back()">返回</el-button>
      <template v-else>
        <el-button size="lg" @click="$router.back()">取消</el-button>
        <el-button size="lg" type="primary" @click="$refs.checkCard.audit()">提交</el-button>
      </template>
    </footer>
  </div>
</template>

<script>
import meetingStatusList from '../lib/meetingStatusList'
export default {
  name: 'Detail',
  data() {
    return {
      id: null,
      detail: {},
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
        this.detail = res.data
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
        width: 100px;
        color: #666;
        &:after {
          content: '：';
        }
      }
    }
  }
}
</style>
