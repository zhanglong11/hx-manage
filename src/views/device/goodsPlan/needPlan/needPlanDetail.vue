<!--
@bug名称: 1254/标题应该是需用计划名称+编号
@开发人员: 董渊海
@修改日期: 2020-03-23
@任务类型: 修改代码，修改比例(2%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: e802eae5b950287398c0f6e296e66da98e86472e
@代码提交修改日期: 2020-03-02
@任务类型: 修改代码，完成 需用计划 审核列表接口对接，审核和详情接口对接，审核和详情页样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 1573f88cf95785196cb4d49b2c1187543e71d69b
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，物资设备计划 发起人详情页添加审核结果模块
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel is-footer">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="detail-a">
      <div class="detail-a-head">
        <div>{{ data.name + '-' + data.planCode }}详情</div>
      </div>
      <div class="detail-a-status">
        <span>状态</span><br />
        <span v-if="data.status === 0">草稿</span>
        <span v-if="data.status === 1">待审核</span>
        <span v-if="data.status === 2">已通过</span>
        <span v-if="data.status === 3">已驳回</span>
      </div>
      <div class="detail-a-des">
        <div>
          <div>
            <span>计量周期</span>
            <span>{{ data.calculatePeriod }}</span>
          </div>
          <div>
            <span>创建人</span>
            <span>{{ data.creatorName }}</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{ data.createTime }}</span>
          </div>
        </div>
        <div>
          <div class="accessory">
            <div>附件</div>
            <div>
              <FileList :ids="data.fileId" />
            </div>
          </div>
          <div class="remark">
            <span>备注</span>
            <span>{{ data.remark }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-b">
      <div class="detail-b-head">需用明细</div>
      <div class="detail-b-table">
        <vxe-table ref="xTable" border resizable show-overflow keep-source :data="data.list">
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
          <vxe-table-column field="materialName" title="名称"></vxe-table-column>
          <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="materialAmount" title="需用数量"></vxe-table-column>
          <vxe-table-column field="materialType" title="类别">
            <template v-slot="{ row }">
              <span v-if="row.materialType === 1">材料</span>
              <span v-else-if="row.materialType === 2">机械</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="materialKind" title="物资种类">
            <template v-slot="{ row }">
              <span v-if="row.materialKind === 1">耗材</span>
              <span v-else-if="row.materialKind === 2">周材</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
        </vxe-table>
      </div>
    </div>

    <!-- 审批组件 start -->
    <CheckCard v-if="isCheck" :id="id" ref="checkCard"></CheckCard>
    <!-- 审批组件 end -->

    <div class="footer-btn">
      <el-button v-if="!isCheck" @click="handleBack">返回</el-button>
      <template v-else>
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import Api from '@/api/device/goodsPlan/needPlan'
export default {
  name: 'NeedPlanDetail',
  data() {
    return {
      id: this.$route.params.id || '',
      isCheck: this.$route.params.isCheck,
      data: {
        id: '',
        name: '',
        planCode: '',
        calculatePeriod: '',
        creatorName: '',
        createTime: '',
        fileId: null,
        remark: '',
        list: []
      }
    }
  },
  mounted() {
    if (this.id) {
      Api.getNeedPlanDetail(this.id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
        }
      })
    }
  },
  methods: {
    handleEdit() {
      this.$router.push({ name: 'NeedPlanEdit', params: { id: this.data.id } })
    },
    handleBack() {
      this.$router.push({ name: 'NeedPlan' })
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less"></style>
