<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: b5e5a2177d49291f9e7b2997ee96dc6975731b83
@代码提交修改日期: 2020-03-12
@任务类型: 修改代码，物资折旧单 对接物资折旧单编辑接口、保存提交功能、详情查询接口、详情页样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="detail-a">
      <div class="detail-a-head">
        <div>{{ data.depreciationBillCode }}详情</div>
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
            <span>折旧物资编号</span>
            <span>{{ data.materialCode }}</span>
          </div>
          <div>
            <span>折旧物资名称</span>
            <span>{{ data.materialName }}</span>
          </div>
          <div>
            <span>规格型号</span>
            <span>{{ data.specification }}</span>
          </div>
          <div>
            <span>计量单位</span>
            <span>{{ data.calculateUnit }}</span>
          </div>
          <div>
            <span>折旧年度</span>
            <span>{{ data.depreciationYear }}</span>
          </div>
          <div>
            <span>折旧月份</span>
            <span>{{ data.depreciationMonth }}</span>
          </div>
          <div>
            <span>年折旧率</span>
            <span>{{ data.yearlyDepreciation }}</span>
          </div>
          <div>
            <span>月折旧额</span>
            <span>{{ data.monthDepreciation }}</span>
          </div>
          <div>
            <span>折旧方式</span>
            <span v-if="data.depreciationWay === 1">年限法</span>
            <span v-else-if="data.depreciationWay === 2">工作量法</span>
          </div>
          <div>
            <span>累计折旧金额(元)</span>
            <span>{{ data.depreciationAmount }}</span>
          </div>
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
        <div></div>
      </div>
    </div>

    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
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
import Api from '@/api/device/settleAccounts/depreciationOrder'
export default {
  name: 'DepreciationOrderDetail',
  data() {
    return {
      data: {}
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
    if (id) {
      Api.getDepreciationOrderDetailById(id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
        }
      })
    }
  },
  methods: {
    handleEdit() {
      this.$router.push({ name: 'DepreciationOrderEdit', params: { id: this.data.id } })
    },
    handleBack() {
      this.$router.push({ name: 'DepreciationOrder' })
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less"></style>
