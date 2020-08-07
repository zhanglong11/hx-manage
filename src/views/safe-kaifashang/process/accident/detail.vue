<template>
  <div class="is-Footer white">
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span></span>
        </h6>
        <div class="infoWrapper">
          <el-row>
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">事故类型</div>
                    <div class="lrCellValue">{{ $getLabel(accidentTypeList, orderInfo.accidentType) }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">事故等级</div>
                    <div class="lrCellValue">{{ $getLabel(accidentLevelList, orderInfo.accidentLevel) }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">事故性质</div>
                    <div class="lrCellValue">{{ $getLabel(accidentNatureList, orderInfo.accidentNature) }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">事故日期</div>
                    <div class="lrCellValue">{{ orderInfo.accidentDate }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">事故地点</div>
                    <div class="lrCellValue">{{ orderInfo.accidentPosition }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">死亡人数</div>
                    <div class="lrCellValue">{{ orderInfo.deathNumber }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">重伤人数</div>
                    <div class="lrCellValue">{{ orderInfo.seriousInjuryNumber }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">轻伤人数</div>
                    <div class="lrCellValue">{{ orderInfo.minorWoundNumber }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">事故描述</div>
                    <div class="lrCellValue">{{ orderInfo.accidentDescription }}</div>
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
            <el-col :span="8" class="widthLabel">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">直接经济损失（万元）</div>
                    <div class="lrCellValue">{{ orderInfo.directEconomicLoss }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">事故主要原因</div>
                    <div class="lrCellValue">{{ orderInfo.accidentReason }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">对项目处罚的政府监管部门</div>
                    <div class="lrCellValue">{{ orderInfo.governmentSuperviseDepartment }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">处罚决定下达日期</div>
                    <div class="lrCellValue">{{ orderInfo.governmentSuperviseDepartment }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">处罚条款</div>
                    <div class="lrCellValue">{{ orderInfo.punishmentClause }}</div>
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
    </div>
    <!-- 批注组件 start -->
    <template v-if="$hasPower('SafeProcessAccidentCommentPCDetail')">
      <AddComments :id="id" type="SafetyAccidentHandling" :canAdd="$hasPower('SafeProcessAccidentCommentPCAdd')" />
    </template>
    <!-- 批注组件 end -->
    <div class="footer-btn">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import accidentTypeList from '../../lib/accidentTypeList'
import accidentLevelList from '../../lib/accidentLevelList'
import accidentNatureList from '../../lib/accidentNatureList'
import Api from '../../api/index'
export default {
  name: 'Detail',
  data() {
    return {
      id: this.$route.params.id || '',
      orderInfo: {},
      accidentTypeList,
      accidentLevelList,
      accidentNatureList
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await Api.accidentResolve.detail(this.$route.params.id)
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
