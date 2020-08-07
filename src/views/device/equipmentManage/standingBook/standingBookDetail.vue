<!--
* @任务编号: 2824 || 详情接口对接
* @开发人员:张龙
* @日期:2020-03-03
* @任务类型:修改代码
-->
<template>
  <div>
    <div style="display: flex; justify-content: space-between;">
      <div style="font-weight: bold;">设备台账详情</div>
    </div>
    <div style="text-align: right; padding-top: 20px;">
      <span style="color: #c1c1c1; font-size: 12px;">状态</span><br />
      <span>{{ _.get(_.find(paramList.equipmentStatus, { value: orderInfo.useStatus }), 'label') }}</span>
    </div>

    <div class="description">
      <div>
        <div>
          <span>设备状态</span>
          <span class="val">{{
            _.get(_.find(paramList.equipmentStatus, { value: orderInfo.useStatus }), 'label')
          }}</span>
        </div>
        <div>
          <span>设备属性</span>
          <span class="val">{{
            _.get(_.find(paramList.equipmentType, { value: orderInfo.equipmentType }), 'label')
          }}</span>
        </div>
        <div>
          <span>存放地点</span>
          <span>{{ orderInfo.depositLocation }}</span>
        </div>
        <div>
          <span>折旧方式</span>
          <span class="val">{{
            _.get(_.find(paramList.depreciationMode, { value: orderInfo.depreciationMode }), 'label')
          }}</span>
        </div>
        <div>
          <span>技术状况</span>
          <span class="val">{{
            _.get(_.find(paramList.technologyLevel, { value: orderInfo.technologyLevel }), 'label')
          }}</span>
        </div>
        <div>
          <span>使用人</span>
          <span>{{ orderInfo.principalName }}</span>
        </div>
        <div>
          <span>是否为特种装备</span>
          <span class="val">{{ _.get(_.find(paramList.specialFlag, { value: orderInfo.specialFlag }), 'label') }}</span>
        </div>
        <div>
          <span>原值(元)</span>
          <span>{{ orderInfo.originalValue }}</span>
        </div>
        <div>
          <span>累计折旧(元)</span>
          <!--          bug1460 张龙 4-1-->
          <span>{{ orderInfo.accumulativeDepreciationAmount }}</span>
        </div>
        <div>
          <span>净值(元)</span>
          <span>{{ orderInfo.netValue }}</span>
        </div>
        <div>
          <span>净残值(元)</span>
          <span>{{ orderInfo.netSalvage }}</span>
        </div>
        <div>
          <span>使用月限</span>
          <!--          bug 1397 张龙 3-31-->
          <span>{{ getMonth() }}</span>
        </div>
        <div>
          <span>工作总量</span>
          <span>{{ orderInfo.totalWorkload }}</span>
        </div>
        <div>
          <span>累计工作量</span>
          <span>{{ orderInfo.accumulativeWorkload }}</span>
        </div>
        <div>
          <span>月折旧率(%)</span>
          <span>{{ orderInfo.monthDepreciationRate }}</span>
        </div>
        <div>
          <span>月折旧额(元)</span>
          <span>{{ orderInfo.monthDepreciationAmount }}</span>
        </div>
      </div>
      <div>
        <div>
          <span>净残值率(%)</span>
          <span>{{ orderInfo.netSalvageRate }}</span>
        </div>
        <div>
          <span>计量单位</span>
          <span>{{ orderInfo.unit }}</span>
        </div>
        <div>
          <span>资金来源</span>
          <span class="val">{{
            _.get(_.find(paramList.capitalSource, { value: orderInfo.capitalSource }), 'label')
          }}</span>
        </div>
        <div>
          <span>电机功率</span>
          <span>{{ orderInfo.motorPower }}</span>
        </div>
        <div>
          <span>特种设备审验证号</span>
          <span>{{ orderInfo.specialEquipmentVerifyNum }}</span>
        </div>
        <div>
          <span>使用开始日期</span>
          <span>{{ orderInfo.useStartTime }}</span>
        </div>
        <div>
          <span>使用结束日期</span>
          <span>{{ orderInfo.useEndTime }}</span>
        </div>
        <div>
          <span>进口/国产</span>
          <span class="val">{{ _.get(_.find(paramList.importFlag, { value: orderInfo.importFlag }), 'label') }}</span>
        </div>
        <div>
          <span>车牌号</span>
          <span>{{ orderInfo.identificationCode }}</span>
        </div>
        <div>
          <span>创建人</span>
          <span>{{ orderInfo.creatorName }}</span>
        </div>
        <div>
          <span>创建时间</span>
          <span>{{ orderInfo.createTime }}</span>
        </div>
        <div style="display: flex;">
          <span>附件</span>
          <span><FileList :ids="orderInfo.fileId" /></span>
        </div>
        <div style="display: flex;">
          <span style="white-space: nowrap;">备注</span>
          <span>{{ orderInfo.remark }}</span>
        </div>
      </div>
    </div>

    <div class="btn-box">
      <el-button @click="handleBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/device/equipment/standingBook'
import paramList from './selectList'
export default {
  name: 'StandingBookDetail',
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
    toEdit() {
      this.$router.push({ path: 'addStandingBook', query: { id } })
    },
    handleBack() {
      this.$router.back()
    },
    getMonth() {
      let start = moment(this.orderInfo.useStartTime)
      let end = moment(this.orderInfo.useEndTime)
      return end.diff(start, 'months')
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
