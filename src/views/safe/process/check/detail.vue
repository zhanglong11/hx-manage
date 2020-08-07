<template>
  <div>
    <div v-if="orderInfo.checkResultDTO.checkResult === 0" class="info">
      <div class="content">
        <h6 class="title">
          <span
            >状态：{{
              _.get(_.find(paramList.safeCheckStandard, { value: orderInfo.checkResultDTO.checkResult }), 'label')
            }}</span
          >
        </h6>
        <ul>
          <li>
            <span class="label">安全检查编号</span>
            <span class="val">{{ orderInfo.checkNumber }}</span>
          </li>
          <li>
            <span class="label">安全整改编号</span>
            <span class="val">{{ orderInfo.safetyPlanNum }}</span>
          </li>
          <li>
            <span class="label">问题等级</span>
            <span class="val">{{
              _.get(_.find(paramList.questionLevel, { value: orderInfo.checkResultDTO.levels }), 'label')
            }}</span>
          </li>
          <li>
            <span class="label">紧急程度</span>
            <span class="val">{{
              _.get(_.find(paramList.urgencyDegree, { value: orderInfo.checkResultDTO.urgency }), 'label')
            }}</span>
          </li>
          <li>
            <span class="label">问题描述</span>
            <span class="val">{{ orderInfo.checkResultDTO.describes }}</span>
          </li>
          <li>
            <span class="label">整改人</span>
            <span class="val">{{ orderInfo.checkResultDTO.rectificationerName }}</span>
          </li>
          <li>
            <span class="label">整改期限</span>
            <span class="val">{{ orderInfo.checkResultDTO.rectificationTime }}</span>
          </li>
          <li>
            <span class="label">整改要求</span>
            <span class="val">{{ orderInfo.checkResultDTO.rectificationRequire }}</span>
          </li>
          <li>
            <span class="label">复查人</span>
            <span class="val">{{ orderInfo.checkResultDTO.checkPersonName }}</span>
          </li>
          <li>
            <span class="label">关键部位</span>
            <span class="val">{{ orderInfo.placeNames }}</span>
          </li>
          <li>
            <span class="label">检查人</span>
            <span class="val">{{ orderInfo.checkResultDTO.checkPersonName }}</span>
          </li>
          <li>
            <span class="label">检查时间</span>
            <span class="val">{{ orderInfo.checkResultDTO.checkDate }}</span>
          </li>
          <li>
            <span class="label">附件---现场照片</span>
            <span class="val"><FileList :ids="orderInfo.checkResultDTO.files" /></span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="info">
      <div class="content">
        <h6 class="title">
          <span
            >状态：{{
              _.get(_.find(paramList.safeCheckStandard, { value: orderInfo.checkResultDTO.checkResult }), 'label')
            }}</span
          >
        </h6>
        <ul>
          <li>
            <span class="label">检查人</span>
            <span class="val">{{ orderInfo.checkResultDTO.checkPersonName }}</span>
          </li>
          <li>
            <span class="label">检查时间</span>
            <span class="val">{{ orderInfo.checkResultDTO.checkDate }}</span>
          </li>
          <li>
            <span class="label">现场照片</span>
            <span class="val"><FileList :ids="orderInfo.checkResultDTO.files" /></span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/safe/process/check'
import paramList from '@/lib/paramList'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {
        checkResultDTO: {}
      },
      paramList
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.query.id)
      this.orderInfo = res.data
      console.log(this.orderInfo)
      console.log(this.orderInfo)
    },
    toEdit(id) {
      this.$router.push({ path: 'checkStandardEdit', params: { id } })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
