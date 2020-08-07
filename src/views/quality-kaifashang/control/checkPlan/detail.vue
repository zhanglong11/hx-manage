<template>
  <div class="is-Footer">
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.planName }}{{ orderInfo.planNum }}</span>
        </h6>
        <div class="infoWrapper">
          <el-row class="rowLine" :gutter="20">
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">检查性质</div>
                <div class="lrCellValue">
                  {{ $getLabel(checkNatureList, orderInfo.planNature) }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">检查内容</div>
                <div class="lrCellValue">
                  {{ orderInfo.inspectContent }}
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine" :gutter="20">
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">检查数量</div>
                <div class="lrCellValue">{{ orderInfo.inspectNum }}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">允许偏差</div>
                <div class="lrCellValue">{{ orderInfo.allowableDeviation }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine" :gutter="20">
            <el-col :span="12" :gutter="20">
              <div class="lrCellInfo">
                <div class="lrCellLabel">检查要求</div>
                <div class="lrCellValue">{{ orderInfo.inspectRequirements }}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">检查部门</div>
                <div class="lrCellValue">{{ orderInfo.inspectDeptName }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine" :gutter="20">
            <el-col :span="12" :gutter="20">
              <div class="lrCellInfo">
                <div class="lrCellLabel">检查负责人</div>
                <div class="lrCellValue">{{ orderInfo.inspectPrincipalName }}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">检查执行人</div>
                <div class="lrCellValue">{{ orderInfo.inspectExecutorName }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine" :gutter="20">
            <el-col :span="12" :gutter="20">
              <div class="lrCellInfo">
                <div class="lrCellLabel">
                  {{ $store.state.project.projectType === 'decoration' ? '受检班组' : '受检部门' }}
                </div>
                <div class="lrCellValue">{{ orderInfo.beInspectedDeptName }}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">受检负责人</div>
                <div class="lrCellValue">{{ orderInfo.beInspectedPrincipalName }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine" :gutter="20">
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">计划开始时间</div>
                <div class="lrCellValue">{{ orderInfo.planStartTime | ymd }}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">计划结束时间</div>
                <div class="lrCellValue">{{ orderInfo.planEndTime | ymd }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine" :gutter="20">
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">检查周期</div>
                <div class="lrCellValue">{{ orderInfo.inspectDuration }}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">检查频率</div>
                <div class="lrCellValue">{{ orderInfo.inspectFrequency }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine" :gutter="20">
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">附件</div>
                <div class="lrCellValue"><FileList :ids="orderInfo.fileId" /></div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">备注</div>
                <div class="lrCellValue">{{ orderInfo.remark }}</div>
              </div>
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
    <!-- 批注组件 start -->
    <template v-if="$hasPower('QualityInspectPlanCommentPCDetail')">
      <AddComments :id="id" type="QualityInspectPlan" :canAdd="$hasPower('QualityInspectPlanCommentPCAdd')" />
    </template>
    <!-- 批注组件 end -->
    <div class="footer-btn">
      <el-button @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>

<script>
import checkNatureList from '../../lib/checkNatureList'
import statusList from '../../lib/statusList'
import Api from '../../api/index'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {
        point: {}
      },
      checkNatureList,
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
      let res = await Api.checkPlan.detail(this.id)
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
