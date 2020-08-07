<template>
  <div class="is-Footer white">
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>成品保护编号{{ orderInfo.protectionNumber }}</span>
        </h6>
        <div class="infoWrapper">
          <el-row>
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">保护部位</div>
                    <div class="lrCellValue">{{ orderInfo.protectionPlace }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">保护时间</div>
                    <div class="lrCellValue">{{ orderInfo.protectionDate }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">拆除时间</div>
                    <div class="lrCellValue">{{ orderInfo.dismantleDate }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">保护办法</div>
                    <div class="lrCellValue">{{ orderInfo.protectionMethod }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">责任部门</div>
                    <div class="lrCellValue">{{ orderInfo.responsibleDepartmentName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">责任人</div>
                    <div class="lrCellValue">{{ orderInfo.principalName }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">创建人</div>
                    <div class="lrCellValue">{{ orderInfo.creatorName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">创建时间</div>
                    <div class="lrCellValue">{{ orderInfo.createTime }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">附件</div>
                    <div class="lrCellValue"><FileList :ids="orderInfo.files" /></div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">备注</div>
                    <div class="lrCellValue">{{ orderInfo.remark }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="footer-btn">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>
<script>
import Api from '../../api/index'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {}
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await Api.finishProtect.detail(this.$route.params.id)
      this.orderInfo = res.data
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../style.less';
</style>
