<template>
  <div class="is-Footer">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <el-card class="box-card">
      <div slot="header" class="details-header">
        <span class="details-title">{{ orderInfo.dangerSource }}</span>
      </div>
      <div class="details">
        <div class="left">
          <div>
            <span class="label">伤害类别</span>
            <span> {{ orderInfo.harmCategoryNames }}</span>
          </div>
          <div>
            <span class="label">风险类型</span>
            <span> {{ $getLabel(riskCategoryList, orderInfo.riskCategory) }}</span>
          </div>
          <div>
            <span class="label">开始时间</span>
            <span> {{ orderInfo.beginTime }}</span>
          </div>
          <div>
            <span class="label">结束时间</span>
            <span> {{ orderInfo.endTime }}</span>
          </div>
          <div>
            <span class="label">防范措施</span>
            <span>{{ orderInfo.precautionaryMeasure }}</span>
          </div>
          <div>
            <span class="label">项目责任领导</span>
            <span>{{ orderInfo.principalLeaderName }}</span>
          </div>
        </div>
        <div class="right">
          <div>
            <span class="label">责任人</span>
            <span>{{ orderInfo.principalName }}</span>
          </div>
          <div>
            <span class="label">责任人联系方式</span>
            <span>{{ orderInfo.principalContact }}</span>
          </div>
          <div>
            <span class="label">创建人</span>
            <span>{{ orderInfo.creatorName }}</span>
          </div>
          <div>
            <span class="label">创建时间</span>
            <span>{{ orderInfo.createTime }}</span>
          </div>
          <div>
            <span class="label">附件</span>
            <span><FileList :ids="orderInfo.files" /></span>
          </div>
        </div>
        <div class="row">
          <div>
            <span class="label">备注</span>
            <span>{{ orderInfo.remark }}</span>
          </div>
        </div>
      </div>
    </el-card>
    <el-card style="margin-top: 20px;">
      <div slot="header" class="clearfix">
        <span>危险源关键部位</span>
        <el-button style="float: right; padding: 3px 0;" type="text"></el-button>
      </div>
      <VXTable ref="table" :columns="partsColumn" :tableData="tableList" :pageShow="false" />
    </el-card>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="$router.go(-1)">返回</el-button>
      <template v-else>
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import Api from '../../api/index'
import harmTypeList from '@/views/safe-kaifashang/lib/harmTypeList'
import baseStatusList from '@/views/safe-kaifashang/lib/baseStatusList'
import riskCategoryList from '@/views/safe-kaifashang/lib/riskCategoryList'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      harmTypeList,
      baseStatusList,
      riskCategoryList,
      id: this.$route.params.id || '',
      isCheck: this.$route.params.isCheck,
      tableList: [],
      partsColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'placeName',
          title: '关键部位名称'
        },
        {
          field: 'remark',
          title: '备注'
        }
      ]
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
      let res = await Api.dangerous.getDangerousInfoById(this.id)
      this.orderInfo = res.data
      this.tableList = res.data.dangerSourcePlaces
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/detail';
</style>
