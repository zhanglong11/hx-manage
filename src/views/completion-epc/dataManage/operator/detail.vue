<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>基本信息</strong>
          <el-button style="float: right; padding: 3px 0;" type="text" />
        </div>
        <div>
          <el-row>
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">申报文件名称</div>
                    <div class="lrCellValue">{{ info.name }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">负责人</div>
                    <div class="lrCellValue">{{ info.principalName }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">报审单位</div>
                  <div class="lrCellValue">{{ info.reportingUnit }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">注意事项</div>
                    <div class="lrCellValue">{{ info.remark }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">执行人</div>
                  <div class="lrCellValue">{{ info.executorName }}</div>
                </div>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <template v-if="isCheck && info.status !== 2">
        <CheckCard :id="id" ref="checkCard"></CheckCard>
      </template>
    </div>
    <div class="footer-btn">
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../../api/executor'
export default {
  name: 'TenderDetail',
  data() {
    return {
      id: this.$route.params.id || '',
      info: {}
    }
  },
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  mounted() {},
  methods: {
    async getDetail() {
      const res = await Api.detailFile(this.id)
      this.info = res.data
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../style.less';
</style>
