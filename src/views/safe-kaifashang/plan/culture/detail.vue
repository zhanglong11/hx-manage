<template>
  <div class="is-Footer white">
    <ViewFlow :id="$route.params.id" />
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.civilizationName }}</span>
        </h6>
        <div class="infoWrapper">
          <el-row>
            <el-col :span="10">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">安全文明计划编号</div>
                    <div class="lrCellValue">{{ orderInfo.civilizationNumber }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">负责人</div>
                    <div class="lrCellValue">{{ orderInfo.principalName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">负责人联系方式</div>
                    <div class="lrCellValue">{{ orderInfo.principalContact }}</div>
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
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">安全文明管理目标</div>
                    <div class="lrCellValue">{{ orderInfo.civilizationTarget }}</div>
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
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="status-box">
        <p class="status">状态</p>
        <p class="status-info">
          <span class="val">{{ $getLabel(statusList, orderInfo.status) }}</span>
        </p>
      </div>
    </div>
    <div class="footer-btn">
      <el-button @click="$router.go(-1)">返回</el-button>
      <!-- <el-button v-if="isCheck" type="primary" @click="approval()">确定</el-button>-->
    </div>
  </div>
</template>

<script>
import statusList from '../../lib/baseStatusList'
import Api from '../../api/index'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {
        point: {}
      },
      statusList,
      id: this.$route.params.id || '',
      isCheck: this.$route.params.isCheck
    }
  },
  computed: {
    isAudit() {
      return this.$route.meta.isAudit
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await Api.safeCivilizationTarget.detail(this.id)
      this.orderInfo = res.data
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../style.less';
</style>
