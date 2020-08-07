<template>
  <div class="container no-padding is-footer">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">{{ info.supplyPlanName }} - {{ info.confirmCode }}</span>
        <div class="details-title-sub">
          <p>
            <span class="label">状态</span>
            <span class="val">{{ $getLabel(statusList, info.status) }}</span>
          </p>
          <el-button
            v-if="info.status === 0 && $hasPower('MaterialConfirmCodeEdit')"
            type="primary"
            size="mini"
            @click="$router.push({ path: `/material/confirmCodeEdit/${info.id}` })"
            >编辑</el-button
          >
          <el-button v-if="info.isRevocation && isMe" type="primary" size="mini" @click="revoke">撤回</el-button>
          <el-button v-if="!info.isRevocation && info.status === 1 && isMe" type="primary" size="mini" @click="invalid"
            >作废</el-button
          >
        </div>
      </div>
      <div class="details">
        <el-row>
          <el-col :md="8">
            <span class="label">甲供材计划编号</span>
            <span>{{ info.supplyPlanCode }}</span>
          </el-col>
          <el-col :md="8">
            <span class="label">合同编号</span>
            <span>{{ info.contractCode }}</span>
          </el-col>
          <el-col :md="8">
            <span class="label">合同名称</span>
            <span>{{ info.contractName }}</span>
          </el-col>
          <el-col :md="8">
            <span class="label">供应商</span>
            <span>{{ info.secondParty }}</span>
          </el-col>
          <el-col :md="8">
            <span class="label">联系人</span>
            <span>{{ info.secondPartyLinkman }}</span>
          </el-col>
          <el-col :md="8">
            <span class="label">联系人电话</span>
            <span>{{ info.secondPartyMobile }}</span>
          </el-col>
          <el-col :md="8">
            <span class="label">创建人</span>
            <span>{{ info.creatorName }}</span>
          </el-col>
          <el-col :md="8">
            <span class="label">创建时间</span>
            <span>{{ info.createTime }}</span>
          </el-col>

          <el-col>
            <div class="upload-con">
              <span class="label">附件</span>
              <div class="upload-list">
                <FileList :ids="info.fileId"></FileList>
              </div>
            </div>
          </el-col>
          <el-col>
            <span class="label">备注</span>
            <span>{{ info.remark }}</span>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 材料确认明细 start -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>材料确认明细</span>
        <div class="details-title-sub">
          <!-- <el-dropdown>
            <el-button>打印</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="print(1)">原始表单</el-dropdown-item>
              <el-dropdown-item @click.native="print(2)">审核流程</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
          <el-dropdown style="margin-left: 10px;">
            <el-button>下载</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="download(1)">原始表单</el-dropdown-item>
              <el-dropdown-item @click.native="download(2)">审核流程</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <VXTable
        v-loading="tableLoading"
        :tableData="tableData"
        :columns="tableColumn"
        :show-footer="true"
        :border="true"
        :footerColspanMethod="footerColspanMethod"
        :footer-method="footerMethod"
        :pageShow="false"
      />
    </el-card>
    <!-- 材料确认明细 end -->

    <el-card v-if="info.status" class="timeline-wrap" header="审核流程">
      <div class="timeline">
        <TimelineItem :status="_.get(workflowList, '0.taskVariables.flag')">
          <h4>供货单位审核</h4>
          <p>
            <span class="label">确认上表供货数量</span>
            <span class="content">
              {{ ['正确', '不正确'][_.get(workflowList, '0.taskVariables.flag') - 1] }}
            </span>
          </p>
          <p>
            <span class="label">负责人</span>
            <span class="content">{{ _.get(workflowList, '0.taskVariables.auditPerson') }}</span>
          </p>
          <p>
            <span class="label">审核时间</span>
            <span class="content">{{ _.get(workflowList, '0.endTime') | ymd }}</span>
          </p>
        </TimelineItem>
        <TimelineItem :status="_.get(workflowList, '1.taskVariables.flag')">
          <h4>收货单位审核</h4>
          <p>
            <span class="label">确认上表收货状态</span>
            <span class="content">
              {{ ['合格', '不合格'][_.get(workflowList, '1.taskVariables.flag') - 1] }}
            </span>
          </p>
          <p>
            <span class="label">数量</span>
            <span class="content">
              {{ _.get(workflowList, '1.taskVariables.receiptNumber') }}
            </span>
          </p>
          <p>
            <span class="label">质量</span>
            <span class="content">
              {{ ['合格', '不合格'][_.get(workflowList, '1.taskVariables.quality') - 1] }}
            </span>
          </p>
          <p>
            <span class="label">收货人</span>
            <span class="content">
              {{ _.get(workflowList, '1.taskVariables.auditPerson') }}
            </span>
          </p>
          <p>
            <span class="label">负责人</span>
            <span class="content">{{ _.get(workflowList, '1.taskVariables.chargePerson') }}</span>
          </p>
          <p>
            <span class="label">审核时间</span>
            <span class="content">{{ _.get(workflowList, '1.endTime') | ymd }}</span>
          </p>
        </TimelineItem>
        <TimelineItem :status="_.get(workflowList, '2.taskVariables.flag')">
          <h4>监理单位审核</h4>
          <p>
            <span class="label">审核结果</span>
            <span class="content">
              {{ ['合格', '不合格'][_.get(workflowList, '2.taskVariables.flag') - 1] }}
            </span>
          </p>
          <p>
            <span class="label">审核意见</span>
            <span class="content">{{ _.get(workflowList, '2.taskVariables.remark') }}</span>
          </p>
          <p>
            <span class="label">经办人</span>
            <span class="content">{{ _.get(workflowList, '2.taskVariables.auditPerson') }}</span>
          </p>
          <p>
            <span class="label">总监(代表)</span>
            <span class="content">{{ _.get(workflowList, '2.taskVariables.chargePerson') }}</span>
          </p>
          <p>
            <span class="label">审核时间</span>
            <span class="content">{{ _.get(workflowList, '2.endTime') | ymd }}</span>
          </p>
        </TimelineItem>
        <TimelineItem :status="_.get(workflowList, '3.taskVariables.flag')">
          <h4>建设单位审核</h4>
          <p>
            <span class="label">审核结果</span>
            <span class="content">
              {{ ['合格', '不合格'][_.get(workflowList, '3.taskVariables.flag') - 1] }}
            </span>
          </p>
          <p>
            <span class="label">审核意见</span>
            <span class="content">{{ _.get(workflowList, '3.taskVariables.remark') }}</span>
          </p>
          <p>
            <span class="label">经办人</span>
            <span class="content">{{ _.get(workflowList, '3.taskVariables.auditPerson') }}</span>
          </p>
          <p>
            <span class="label">总监(代表)</span>
            <span class="content">{{ _.get(workflowList, '3.taskVariables.chargePerson') }}</span>
          </p>
          <p>
            <span class="label">审核时间</span>
            <span class="content">{{ _.get(workflowList, '3.endTime') | ymd }}</span>
          </p>
        </TimelineItem>
      </div>
    </el-card>

    <!-- 通用审批 start -->
    <CheckCard v-if="isCheck" :id="id" ref="checkCard" :receiptNumber="totalAllSupplyNum"></CheckCard>
    <!-- 通用审批 end -->

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button v-if="isCheck" size="medium" type="primary" @click="approval()">审批</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../api/confirmCode'
import overfullList from '@/views/material/confirmCode/lib/overfullList'
import statusList from '@/views/material/confirmCode/lib/statusList'
import TimelineItem from '../components/TimelineItem'
import { saveAs } from 'file-saver'
import { toJpeg } from 'dom-to-image'
export default {
  name: 'HealthyLabourForceDetails',
  components: { TimelineItem },
  data() {
    // 这里存放数据
    return {
      tableLoading: true,
      info: {},
      overfullList,
      statusList,
      tableData: [],
      workflowList: [],
      tableColumn: [
        { type: 'seq', title: '序号', width: 100 },
        {
          field: 'itemName',
          title: '名称'
        },
        {
          field: 'model',
          title: '型号'
        },
        {
          field: 'specifications',
          title: '规格'
        },
        {
          field: 'supplyNum',
          title: '计划供应量'
        },
        {
          field: 'lastSupplyNum',
          title: '上期累计量'
        },
        {
          field: 'currentSupplyNum',
          title: '本期供应量'
        },
        {
          field: 'currentUnitPrice',
          title: '单价'
        },
        {
          field: 'total',
          title: '合价',
          slots: {
            default: ({ row }) => [<span>{row.currentUnitPrice * row.currentSupplyNum || 0}</span>]
          }
        },
        {
          field: 'totalSupplyNum',
          title: '本期累积量'
        },
        {
          field: 'overfulfilFlagStr',
          title: '是否超供'
        },
        {
          field: 'usedPart',
          title: '使用部位'
        }
      ],
      totalAllSupplyNum: 0 // 本期累积量所有数据汇总
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    isCheck() {
      return this.$route.params.isCheck
    },
    isMe() {
      return this.$store.state.user.id === this.info.creator
    }
  },
  created() {
    if (this.id) {
      this.refresh()
      this.getWorkflowTasks()
    }
  },
  // 方法集合
  methods: {
    refresh() {
      this.getDetail()
    },
    getWorkflowTasks() {
      this.axios.workflow.get('task/list/' + this.id).then(res => {
        console.log('res', res.data)
        for (let i = 0; i < 5; i++) {
          if (['2', '3'].includes(_.get(res.data[i], 'taskVariables.flag'))) {
            res.data[i + 1] = { taskVariables: { flag: '3' } }
          }
        }
        this.workflowList = res.data
      })
    },
    async getDetail() {
      const res = await Api.detail(this.id)
      let datas = res.data
      let detailList = datas.detailList || []
      let totalAllSupplyNum = 0
      detailList.map(item => {
        console.log(111, item)
        totalAllSupplyNum += parseFloat(item.totalSupplyNum)
      })
      this.totalAllSupplyNum = totalAllSupplyNum
      this.info = datas
      this.tableData = detailList
      this.tableLoading = false
    },
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['itemName'].includes(column.property)) {
            return (
              data.reduce(
                (acc, cur) => acc + _.get(cur, 'currentUnitPrice', 0) * _.get(cur, 'currentSupplyNum', 0),
                0
              ) || 0
            )
          }
          return null
        }),
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '应付款'
          }
          if (['itemName'].includes(column.property)) {
            return (
              data.reduce(
                (acc, cur) => acc + _.get(cur, 'currentUnitPrice', 0) * _.get(cur, 'currentSupplyNum', 0),
                0
              ) || 0
            )
          }
          return null
        }),
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '上期已付款'
          }
          if (['itemName'].includes(column.property)) {
            return this.info.lastSupplyMoney
          }
          return null
        })
      ]
    },
    footerColspanMethod({ columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: 1,
          colspan: 7
        }
      } else if (columnIndex === 1) {
        return {
          rowspan: 1,
          colspan: 5
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    async revoke() {
      await this.$confirm('确定撤回该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await Api.revoke(this.id)
      this.$message.success('操作成功')
      this.$router.go(-1)
    },
    async invalid() {
      await this.$confirm('确定作废该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await Api.invalid(this.id)
      this.$message.success('操作成功')
      this.$router.go(-1)
    },
    print(type) {
      if (type === 1) {
        this.axios.construction
          .post(`materialSupplyConfirmBill/print`, { type, id: this.id })
          .then(res => this.axios.get(res.data, { responseType: 'blob' }))
          .then(res => {
            const data = URL.createObjectURL(res.data)
            const iframe = document.createElement('iframe')
            iframe.src = data
            iframe.display = 'none'
            document.getElementById('iframe').appendChild(iframe)
            iframe.contentWindow.print()
          })
      } else if (type === 2) {
        toJpeg(document.getElementsByClassName('timeline')[0], { quality: 0.95 }).then(src => {
          const img = new Image()
          img.src = src
          document.getElementsByTagName('body')[0].appendChild(img)
        })
      }
    },
    download(type) {
      if (type === 1) {
        this.axios.construction
          .post(`materialSupplyConfirmBill/download`, { type, id: this.id }, { responseType: 'blob' })
          .then(res => {
            saveAs(res.data, this.info.supplyPlanName + '-原始表单.doc')
          })
      } else if (type === 2) {
        toJpeg(document.getElementsByClassName('timeline')[0], { quality: 0.95 }).then(src => {
          this.axios.construction
            .post(
              `materialSupplyConfirmBill/download`,
              { type, id: this.id, base64: src.replace('data:image/jpeg;base64,', '') },
              { responseType: 'blob' }
            )
            .then(res => {
              saveAs(res.data, this.info.supplyPlanName + '-材料确认单.doc')
            })
        })
      }
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    toEdit(id) {
      this.$router.push({ path: `/material/confirmCodeEdit/${id}` })
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.details {
  font-size: 14px;
  .label {
    margin-right: 25px;
    margin-bottom: 15px;
    color: #ccc;
    display: inline-block;
  }
  .title {
    margin-bottom: 30px;
    font-size: 20px;
  }
  .upload-con {
    display: flex;
    .upload-list {
      margin-bottom: 10px;
    }
  }
}
.details-title-sub {
  float: right;
  display: flex;
  justify-content: space-around;
  align-items: center;
  > p {
    margin-right: 10px;
    .label {
      color: #ccc;
      font-size: 12px;
    }

    > span + span {
      margin-left: 10px;
    }
  }
}
.timeline-wrap {
  /deep/ .el-card__body {
    display: flex;
    justify-content: center;
  }
  .timeline {
    background-color: #fff;
    padding: 50px;
    .label {
      min-width: 4em;
      margin-right: 25px;
    }
  }
}
</style>
