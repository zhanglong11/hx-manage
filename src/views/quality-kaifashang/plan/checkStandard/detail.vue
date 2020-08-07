<template>
  <div class="is-Footer">
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ `${orderInfo.specificationName}(${orderInfo.specificationNumber})` }}</span>
        </h6>
        <div class="infoWrapper">
          <el-row class="rowLine">
            <el-col :span="8">
              <div class="lrCellInfo">
                <div class="lrCellLabel">类别</div>
                <div class="lrCellValue">{{ $getLabel(standardList, orderInfo.category) }}</div>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="lrCellInfo">
                <div class="lrCellLabel">创建人</div>
                <div class="lrCellValue">{{ orderInfo.creatorName }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine">
            <el-col :span="8">
              <div class="lrCellInfo">
                <div class="lrCellLabel">备注</div>
                <div class="lrCellValue">{{ orderInfo.remark }}</div>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="lrCellInfo">
                <div class="lrCellLabel">内容</div>
                <div class="lrCellValue"><FileList :ids="orderInfo.contentFileIds" /></div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine">
            <el-col :span="8">
              <div class="lrCellInfo">
                <div class="lrCellLabel">创建时间</div>
                <div class="lrCellValue">{{ orderInfo.createTime }}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 批注组件 start -->
    <template v-if="$hasPower('QualityAcceptanceSpecificationCommentPCDetail')">
      <AddComments
        :id="id"
        type="QualityAcceptanceSpecification"
        :canAdd="$hasPower('QualityAcceptanceSpecificationCommentPCAdd')"
      />
    </template>
    <!-- 批注组件 start -->
    <div class="footer-btn">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import standardList from '../../lib/standardList'
import Api from '../../api/index'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      standardList,
      id: this.$route.params.id || ''
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await Api.standard.detail(this.id)
      this.orderInfo = res.data
    },
    toEdit(id) {
      this.$router.push({ path: 'QualityPlanCheckStandardEdit', params: { id } })
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
