<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">{{ details.title }}</span>
        <el-tag>{{ $enum.getDescByValue('NOTICE_TYPE', details.cateogry) }}</el-tag>
      </div>
      <div class="details">
        <el-row>
          <el-col>
            <span class="label">创建时间</span>
            <span>{{ details.createTime }}</span>
          </el-col>
          <el-col>
            <span class="label">创建人</span>
            <span>{{ details.creatorName }}</span>
          </el-col>
          <el-col>
            <span class="label">状态</span>
            <span><el-switch :value="details.status === 1" /> {{ details.status ? '已读' : '未读' }}</span>
          </el-col>
          <el-col>
            <span class="label">正文</span>
            <span>{{ details.content }}</span>
          </el-col>
          <el-col>
            <span class="label">附件</span>
            <div style="display: inline-block; vertical-align: top;">
              <FileList :ids="details.contentFileIds" />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
/**
  任务名称：task#2849 【智慧工地2.0-前端】公告管理》列表、新建、编辑、详情切图及功能开发
  开发人员：耿为刚
  日期：2020-04-02
  任务类型：全新代码
**/
import { noticeApi } from '@/api/notice'
export default {
  name: 'NoticeDetails',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || '',
      details: {}
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getDetails()
  },
  // 方法集合
  methods: {
    // 获取消息详情
    async getDetails() {
      if (!this.id) {
        return
      }
      const result = await noticeApi.getDetailsNotice(this.id)
      const datas = result.data
      datas.receiverName = ''
      this.details = datas
      // this.getUserInfo(datas.receiverId)
    },
    // 查询用户详情
    async getUserInfo(id) {
      const result = await noticeApi.getUserInfo(id)
      const datas = result.data
      this.details.receiverName = datas.nickName
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.details {
  font-size: 14px;
  .label {
    margin-right: 25px;
    margin-bottom: 15px;
    color: #ccc;
    display: inline-block;
    width: 150px;
    text-align: right;
  }
  .title {
    margin-bottom: 30px;
    font-size: 20px;
  }
  .status {
    display: flex;
    align-items: center;
    font-size: 14px;
    i {
      margin-right: 6px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00cc00;
    }
    &.status-2 i {
      background: #999;
    }
    &.status-3 i {
      background: #ff9900;
    }
  }
  .upload-con {
    display: flex;
    .upload-list {
      margin-bottom: 10px;
    }
  }
}
</style>
