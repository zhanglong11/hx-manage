<template>
  <div>
    <div class="info">
      <div class="content">
        <ul>
          <li>
            <span class="label">分项工程</span>
            <span class="val">{{ orderInfo.engineeringName }}</span>
          </li>
          <li>
            <span class="label">测量项目</span>
            <span class="val">{{ orderInfo.measureProject }}</span>
          </li>
          <li>
            <span class="label">测量内容</span>
            <span class="val">{{ orderInfo.measureContent }}</span>
          </li>
          <li>
            <span class="label">合格标准</span>
            <span class="val">{{ orderInfo.deviationValue }}</span>
          </li>
          <li>
            <span class="label">实测点</span>
            <span class="val">{{ orderInfo.eyeball }}</span>
          </li>
          <li>
            <span class="label">合格点</span>
            <span class="val">{{ orderInfo.qualifiedPoint }}</span>
          </li>
          <li>
            <span class="label">合格率</span>
            <span class="val">{{ getPercentFun(orderInfo.qualifiedPoint, orderInfo.eyeball) }}</span>
          </li>
          <li>
            <span class="label">爆点数</span>
            <span class="val">{{ orderInfo.criticalPoints }}</span>
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
            <!--            bug1443 张龙 3-31-->
            <span class="val"><FileList :ids="orderInfo.fileIds" /></span>
          </li>
        </ul>
      </div>
    </div>
    <section>
      <el-card>
        <div slot="header" class="card-header">
          <span>测点明细</span>
        </div>
        <VXTable ref="table" :columns="tableColumn" :tableData="tableList" />
      </el-card>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/quality/control/actualMeasure'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      tableList: [],
      requestFlag: false,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '点号', width: 80 },
        {
          field: 'location',
          title: '位置'
        },
        {
          field: 'designValue',
          title: '设计值'
        },
        {
          field: 'measuredValue',
          title: '测量值'
        },
        {
          field: 'content',
          title: '偏差',
          slots: {
            default: ({ row }) => [<span>{row.measuredValue - row.designValue}</span>]
          }
        },
        {
          field: 'content',
          title: '是否合格',
          slots: {
            default: ({ row }) => [<span>{row.conformityFlag ? '合格' : '不合格'}</span>]
          }
        },
        {
          field: 'measuredManName',
          title: '测量人'
        }
      ],
      form: {}
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.query.id)
      this.orderInfo = res.data
      this.tableList = res.data.detailList
    },
    toEdit(id) {
      this.$router.push({ path: 'actualMeasureEdit', query: { id } })
    },
    cancel() {
      this.$router.go(-1)
    },
    getPercentFun(num, total) {
      num = parseFloat(num)
      total = parseFloat(total)
      if (isNaN(num) || isNaN(total)) {
        return '-'
      }
      return total <= 0 ? '0%' : Math.round((num / total) * 10000) / 100.0 + '%'
    }
  }
}
</script>

<style scoped></style>
