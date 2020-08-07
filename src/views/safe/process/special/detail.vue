<template>
  <div>
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>特种作业施工记录</span>
        </h6>
        <ul>
          <li>
            <span class="label">作业部门</span>
            <span class="val">{{ orderInfo.operationDepartment }}</span>
          </li>
          <li>
            <span class="label">作业地点</span>
            <span class="val">{{ orderInfo.operationAddress }}</span>
          </li>
          <li>
            <span class="label">作业类别</span>
            <span class="val">
              {{ _.get(_.find(paramList.operationType, { value: orderInfo.operationCategory }), 'label') }}
            </span>
          </li>
          <li>
            <span class="label">计划开始时间</span>
            <span class="val">{{ orderInfo.planStartDate }}</span>
          </li>
          <li>
            <span class="label">计划结束时间</span>
            <span class="val">{{ orderInfo.planEndDate }}</span>
          </li>
          <li>
            <span class="label">作业内容</span>
            <span class="val">{{ orderInfo.operationContent }}</span>
          </li>
          <li>
            <span class="label">作业安全标准</span>
            <span class="val">{{ orderInfo.operationSafetyStandard }}</span>
          </li>
          <li>
            <span class="label">现场指挥人</span>
            <span class="val">{{ orderInfo.fieldManger }}</span>
          </li>
          <li>
            <span class="label">现场监护人</span>
            <span class="val">{{ orderInfo.onsiteGuardian }}</span>
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
import api from '@/api/safe/process/special'
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
