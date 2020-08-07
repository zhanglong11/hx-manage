<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>施工日志详情</span>
      </div>

      <div class="content">
        <el-row class="row">
          <el-col :span="8">
            编制日期: <span>{{ details.diaryDate }}</span>
          </el-col>
          <el-col :span="8">
            上午温度 ℃: <span>{{ details.morningWeather }}</span>
          </el-col>
          <el-col :span="8">
            午间温度 ℃: <span>{{ details.noonWeather }}</span>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="8">
            下午温度 ℃: <span>{{ details.afternoonWeather }}</span>
          </el-col>
          <el-col :span="8">
            项目负责人: <span>{{ details.chargePersonName }}</span>
          </el-col>
          <el-col :span="8">
            施工人员: <span>{{ details.constructionPersonNames }}</span>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="8">
            施工人数: <span>{{ details.constructionPersonCount }}</span>
          </el-col>
          <el-col :span="8">
            记录人员: <span>{{ details.recordUserName }}</span>
          </el-col>
          <el-col :span="8">
            施工过程: <span>{{ details.constructionProcess }}</span>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="8">
            施工进度: <span>{{ details.constructionProgress }}</span>
          </el-col>
          <el-col :span="8">
            验收记录: <span>{{ details.acceptanceRecord }}</span>
          </el-col>
          <el-col :span="8">
            变更记录: <span>{{ details.changeRecord }}</span>
          </el-col>
        </el-row>

        <el-row class="row">
          <el-col :span="8">
            签证记录: <span>{{ details.visaRecord }}</span>
          </el-col>
          <el-col :span="8">
            待办事宜: <span>{{ details.waitThing }}</span>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="8">
            安全问题: <span>{{ details.safetyProblem }}</span>
          </el-col>
          <el-col :span="8">
            处理时间: <span>{{ details.safetyHandleDate }}</span>
          </el-col>
          <el-col :span="8">
            处理意见: <span>{{ details.safetyHandleOption }}</span>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="8">
            处理过程: <span>{{ details.safetyHandleProcess }}</span>
          </el-col>
          <el-col :span="8">
            处理人: <span>{{ details.safetyHandlePersonName }}</span>
          </el-col>
          <el-col :span="8">
            处理结果: <span>{{ ['不合格', '合格', '未处理'][details.safetyHandleResult] }}</span>
          </el-col>
        </el-row>

        <el-row class="row">
          <el-col :span="8">
            质量问题: <span>{{ details.qualityHualityProblem }}</span>
          </el-col>
          <el-col :span="8">
            处理时间: <span>{{ details.qualityHandleDate }}</span>
          </el-col>
          <el-col :span="8">
            处理意见: <span>{{ details.qualityHandleOption }}</span>
          </el-col>
        </el-row>

        <el-row class="row">
          <el-col :span="8">
            处理过程: <span>{{ details.qualityHandleProcess }}</span>
          </el-col>
          <el-col :span="8">
            处理人: <span>{{ details.qualityHandlePersonName }}</span>
          </el-col>
          <el-col :span="8">
            处理结果: <span>{{ ['不合格', '合格', '未处理'][details.qualityHandleResult] }}</span>
          </el-col>
        </el-row>

        <el-row class="row">
          抄送人: <span>{{ details.copyToPersonName }}</span>
        </el-row>

        <el-row class="row">
          备注: <span>{{ details.remark }}</span>
        </el-row>
        <el-row class="row">
          附件:
          <AttachmentDialog style="display: inline-block; margin-left: 10px;" :ids="details.fileIds"></AttachmentDialog>
        </el-row>
      </div>

      <div class="footer-btn">
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
/*
 * @Author: 许雷 创建
 * @Date: 2020-06-29
 * @Last Modified by: 许雷
 */
import Api from './api/constructionLog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ConstructionLogDetail',
  components: {},
  data() {
    return {
      logId: '',
      details: {}
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    this.logId = this.$route.query.id
    this.getData()
  },
  // 方法集合
  methods: {
    getData() {
      Api.getLogDetail(this.logId).then(res => {
        if (res.code === 200) {
          this.details = res.data
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.header {
  border-bottom: 1px solid #ddd;
}
.content {
  font-size: 14px;
  margin-left: 40px;
  .row {
    margin: 20px 0;
  }
}
.back {
  float: right;
  margin-right: 50px;
}
</style>
