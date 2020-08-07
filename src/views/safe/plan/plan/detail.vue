<!--
* @任务编号:检查性质字段转换
* @开发人员:张龙
* @日期:2020-03-18
* @任务类型: 修改代码
-->
<template>
  <div>
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.planName }}({{ orderInfo.planNumber }})</span>
        </h6>
        <ul>
          <li>
            <span class="label">检查性质</span>
            <span class="val">{{
              _.get(_.find(paramList.checkNatureList, { value: orderInfo.checkNature }), 'label')
            }}</span>
          </li>
          <li>
            <span class="label">检查人</span>
            <span class="val">{{ orderInfo.checkPersonName }}</span>
          </li>
          <li>
            <span class="label">检查人联系方式</span>
            <span class="val">{{ orderInfo.checkPersonContact }}</span>
          </li>
          <li>
            <span class="label">检查部门</span>
            <span class="val">{{ orderInfo.checkDepartmentName }}</span>
          </li>
          <li>
            <span class="label">通知人</span>
            <span class="val">{{ orderInfo.notificationPersonNames }}</span>
          </li>
          <li>
            <span class="label">通知人联系方式</span>
            <span class="val">{{ orderInfo.notificationPersonPhones }}</span>
          </li>
          <li>
            <span class="label">计划开始时间</span>
            <span class="val">{{ moment(orderInfo.planStartDate).format('YYYY-MM-DD') }}</span>
          </li>
          <li>
            <span class="label">计划结束时间</span>
            <span class="val">{{ moment(orderInfo.planEndDate).format('YYYY-MM-DD') }}</span>
          </li>
          <li>
            <span class="label">工期（天）</span>
            <span class="val">{{ moment(orderInfo.planEndDate).diff(moment(orderInfo.planStartDate), 'days') }}</span>
          </li>
          <li>
            <span class="label">危险源名称</span>
            <span class="val">{{ orderInfo.dangerSourceNames }}</span>
          </li>
          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.creatorName }}</span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.createTime }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.files" />
            </span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
      <div class="status-box">
        <p class="status">状态</p>
        <p class="status-info">
          <span class="val">{{ _.get(_.find(paramList.safeCommonStatus, { value: orderInfo.status }), 'label') }}</span>
        </p>
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
import api from '@/api/safe/plan/plan'
import paramList from '@/lib/paramList'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      paramList
    }
  },
  computed: {
    isAudit() {
      return this.$route.meta.isAudit
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
    cancel() {
      this.$router.go(-1)
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped></style>
