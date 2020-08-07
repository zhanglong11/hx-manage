<template>
  <div class="is-Footer white">
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.name }}</span>
        </h6>
        <div class="infoWrapper">
          <el-row>
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">奖惩人员</div>
                    <div class="lrCellValue">{{ orderInfo.personnelName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">所属部门</div>
                    <div class="lrCellValue">{{ orderInfo.departmentName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">奖惩日期</div>
                    <div class="lrCellValue">{{ orderInfo.happenDate }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">金额（元）</div>
                    <div class="lrCellValue">{{ orderInfo.money }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">事由</div>
                    <div class="lrCellValue">{{ orderInfo.reason }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">奖惩</div>
                    <div class="lrCellValue">{{ $getLabel(rewardPunishTypeList, orderInfo.type) }}</div>
                  </div>
                </el-col>
              </el-row>
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
import rewardPunishTypeList from '../../lib/rewardPunishTypeList'
import Api from '../../api'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      rewardPunishTypeList
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await Api.rewardPunish.detail(this.$route.params.id)
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
.widthLabel .lrCellLabel {
  width: 200px;
}
</style>
