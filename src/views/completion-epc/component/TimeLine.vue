<template>
  <div>
    <div class="timeline">
      <div v-for="(item, index) in timelineList" :key="index" class="item">
        <div @click="handleClick(item)">
          <p>{{ item.statusText }}</p>
          <p>{{ item.operatorLabel }}:{{ item.operator }}</p>
          <p>{{ item.timeLabel }}:{{ item.operatorTime | ymd }}</p>
        </div>
      </div>
    </div>
    <InspectInfo :itemInfo="itemInfo" :type="type"></InspectInfo>
  </div>
</template>

<script>
import InspectInfo from '../component/InspectInfo'
import Api from '../api/rectify.js'
export default {
  name: 'TimeLine',
  components: { InspectInfo },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      timelineList: [],
      type: 'inspect',
      itemInfo: {}
    }
  },
  watch: {
    info: {
      immediate: true,
      handler(val) {
        this.init(val)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    init(data) {
      for (let item of data.flowCharts || []) {
        let resultContent = ['不合格', '合格']
        let typeContent = ['初验', '整改', '复验']
        let typeValue = ['inspect', 'rectify', 'review']
        if (item.type === 2) {
          this.timelineList.push({
            id: item.id,
            type: 'rectify',
            statusText: '整改完成',
            operatorLabel: '整改人',
            operator: item.operator,
            timeLabel: '整改完成日期',
            operatorTime: item.operatorTime
          })
        } else {
          this.timelineList.push({
            id: item.id,
            type: `${typeValue[item.type - 1]}`,
            statusText: `${typeContent[item.type - 1]}${resultContent[item.resultStatus]}`,
            operatorLabel: `${typeContent[item.type - 1]}人`,
            operator: item.operator,
            timeLabel: `${typeContent[item.type - 1]}日期`,
            operatorTime: item.operatorTime
          })
        }
      }
    },
    async handleClick(item) {
      this.type = item.type
      if (item.type === 'inspect') {
        this.itemInfo = {
          result: this.info.acceptanceStatus === 4 ? 1 : 0,
          opinion: this.info.acceptanceOpinion,
          inspectTime: this.info.actualAcceptanceTime,
          issueDesctiption: this.info.issueDesctiption || '',
          fileIds: this.info.acceptanceFileId
        }
        return
      }
      let res = await Api.getTimeLineItemDetail(item.id)
      //整改
      if (item.type === 'rectify') {
        this.itemInfo = {
          name: this.info.name,
          result: 1,
          rectifyTime: res.data.rectifyTime,
          operator: res.data.rectifyPrincipalName,
          issueDesctiption: this.info.issueDesctiption || '',
          fileIds: res.data.rectifyFileId
        }
      }
      //复检
      if (item.type === 'review') {
        this.itemInfo = {
          result: res.data.reviewResult,
          opinion: res.data.reviewOpinion,
          reviewTime: res.data.reviewTime,
          fileIds: res.data.reviewFileId
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '../style.less';
</style>
