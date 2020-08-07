<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>基本信息</strong>
          <el-button style="float: right; padding: 3px 0;" type="text" />
        </div>
        <div>
          <div class="header">
            <div class="statusWrapper">
              <p class="gray">移交状态</p>
              <p>{{ $getLabel(overStatus, info.status) }}</p>
            </div>
          </div>
          <el-row>
            <el-col :span="12">
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">工程移交名称</div>
                    <div class="lrCellValue">{{ info.transferName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">接管单位</div>
                    <div class="lrCellValue">{{ info.takeOverUnit }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收合格日期</div>
                    <div class="lrCellValue">{{ info.acceptancePassTime }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">移交人</div>
                    <div class="lrCellValue">{{ info.transferPersonName }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">移交单位</div>
                  <div class="lrCellValue">{{ info.transferUnit }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">验收范围</div>
                  <div class="lrCellValue">{{ info.transferScope }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">移交时间</div>
                  <div class="lrCellValue">{{ info.transferTime }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">备注</div>
                  <div class="lrCellValue">{{ info.remark }}</div>
                </div>
              </el-row>
            </el-col>
            <el-col :span="24">
              <el-row>
                <div class="lrCellInfo">
                  <div class="lrCellLabel">移交附件</div>
                  <div class="lrCellValue">
                    <AttachmentDialog
                      style="display: inline-block; margin-left: 10px;"
                      :ids="info.fileId"
                    ></AttachmentDialog>
                  </div>
                </div>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <div class="footer-btn">
      <el-button v-if="info.status === 0" type="primary" @click="handleTurnOver">移交</el-button>
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/views/completion-epc/api/projectOver'
import overStatus from '../lib/overStatus'
export default {
  name: 'DetailProjectOverEpc',
  data() {
    return {
      info: {},
      overStatus
    }
  },
  created() {
    const { id } = this.$route.params
    if (id) {
      this.id = id
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      const res = await Api.getDetail(this.id)
      this.info = res.data
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    async handleTurnOver() {
      await Api.getTurnOver(this.id)
      this.$message.success('移交成功')
      this.goBack()
    }
  }
}
</script>
<style lang="less" scoped>
@import '../style.less';
.statusWrapper {
  position: relative;
  top: 0px;
  right: 150px;
  text-align: right;
  .gray {
    color: #ccc;
  }
}
</style>
