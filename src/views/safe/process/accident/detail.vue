<template>
  <div>
    <div class="info">
      <div class="content">
        <ul>
          <li>
            <span class="label">事故类型</span>
            <span class="val">
              {{ _.get(_.find(paramList.accidentType, { value: orderInfo.accidentType }), 'label') }}
            </span>
          </li>
          <li>
            <span class="label">事故等级</span>
            <span class="val">
              {{ _.get(_.find(paramList.accidentLevel, { value: orderInfo.accidentLevel }), 'label') }}
            </span>
          </li>
          <li>
            <span class="label">事故性质</span>
            <span class="val">
              {{ _.get(_.find(paramList.accidentNature, { value: orderInfo.accidentNature }), 'label') }}
            </span>
          </li>
          <li>
            <span class="label">事故日期</span>
            <span class="val">{{ orderInfo.accidentDate }}</span>
          </li>
          <li>
            <span class="label">事故地点</span>
            <span class="val">{{ orderInfo.accidentPosition }}</span>
          </li>
          <li>
            <span class="label">死亡人数</span>
            <span class="val">{{ orderInfo.deathNumber }}</span>
          </li>
          <li>
            <span class="label">重伤人数</span>
            <span class="val">{{ orderInfo.seriousInjuryNumber }}</span>
          </li>
          <li>
            <span class="label">轻伤人数</span>
            <span class="val">{{ orderInfo.minorWoundNumber }}</span>
          </li>
          <li>
            <span class="label">事故描述</span>
            <span class="val">{{ orderInfo.accidentDescription }}</span>
          </li>
          <li>
            <span class="label">直接经济损失（万元）</span>
            <span class="val">{{ orderInfo.directEconomicLoss }}</span>
          </li>
          <li>
            <span class="label">事故主要原因</span>
            <span class="val">{{ orderInfo.accidentReason }}</span>
          </li>
          <li>
            <span class="label">对项目处罚的政府监管部门</span>
            <span class="val">{{ orderInfo.governmentSuperviseDepartment }}</span>
          </li>
          <li>
            <span class="label">处罚决定下达日期</span>
            <span class="val">{{ orderInfo.punishmentDate }}</span>
          </li>
          <li>
            <span class="label">处罚条款</span>
            <span class="val">{{ orderInfo.punishmentClause }}</span>
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
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/safe/process/accident'
import paramList from '@/lib/paramList'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
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
