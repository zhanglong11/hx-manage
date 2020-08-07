<!--
* @任务编号: 2824 || 详情接口对接
* @开发人员:张龙
* @日期:2020-03-03
* @任务类型:修改代码
-->
<template>
  <div>
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div style="text-align: right; padding-top: 20px;">
      <span style="color: #c1c1c1; font-size: 12px;">状态</span><br />
      <span>{{ _.get(_.find(paramList.safeCommonStatus, { value: orderInfo.status }), 'label') }}</span>
    </div>
    <!--    状态问题 张龙 3-31-->

    <div class="description">
      <div>
        <div>
          <span>规格及型号</span>
          <span>{{ orderInfo.specification }}</span>
        </div>
        <div>
          <span>责任人</span>
          <span>{{ orderInfo.principalName }}</span>
        </div>
        <div>
          <span>维修人员</span>
          <span>{{ orderInfo.repairManName }}</span>
        </div>
        <div>
          <span>维修部门</span>
          <span>{{ orderInfo.repairDeptName }}</span>
        </div>
        <div>
          <span>故障发生日期</span>
          <span>{{ orderInfo.faultOccurTime }}</span>
        </div>
        <div>
          <span>预计维修完成日期</span>
          <span>{{ orderInfo.repairTime }}</span>
        </div>
        <div>
          <span>故障描述</span>
          <span>{{ orderInfo.faultDesc }}</span>
        </div>
        <div>
          <span>故障原因</span>
          <span>{{ orderInfo.faultReason }}</span>
        </div>
        <div>
          <span>是否外委</span>
          <span>{{ orderInfo.delegateFlag ? '是' : '否' }}</span>
        </div>
      </div>
      <div>
        <div>
          <span>创建人</span>
          <span>{{ orderInfo.creatorName }}</span>
        </div>
        <div>
          <span>创建时间</span>
          <span>{{ orderInfo.createTime }}</span>
        </div>
        <div>
          <span>附件</span>
          <span><FileList :ids="orderInfo.fileId" /></span>
        </div>
        <div style="display: flex;">
          <span style="white-space: nowrap;">备注</span>
          <span>{{ orderInfo.remark }}</span>
        </div>
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
import api from '@/api/device/equipment/breakDown'
import paramList from '@/lib/paramList'
export default {
  name: 'BreakDownDetail',
  data() {
    return {
      orderInfo: {},
      paramList
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.params.id)
      this.orderInfo = res.data
    },
    toEdit() {
      this.$router.push({ path: 'addBreakDown', query: { id } })
    },
    handleBack() {
      this.$router.back()
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less">
.description {
  display: flex;
  > div {
    flex: 1;
    font-size: 14px;
    > div {
      padding: 10px 0px;
      > span:nth-child(1) {
        color: #c1c1c1;
        padding-right: 10px;
      }
    }
  }
}
</style>
