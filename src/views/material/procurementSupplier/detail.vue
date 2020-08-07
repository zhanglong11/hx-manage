<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div class="header">
        <!--        <span class="details-title">{{ info.name }}</span>-->
        <div class="statusWrapper">
          <p class="gray">计划状态</p>
          <p>{{ ['供货中', '已完成'][info.supplyStatus - 1] }}</p>
        </div>
      </div>
      <div class="details">
        <el-row>
          <el-col :md="24">
            <span class="label">甲供材计划编号:</span>
            <span>{{ info.supplyPlanCode }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">甲供材计划名称:</span>
            <span>{{ info.supplyPlanName }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">合同编号:</span>
            <span>{{ info.contractCode }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">合同名称:</span>
            <span>{{ info.contractName }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">项目经理:</span>
            <span>{{ info.projectManagerName }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">收货人:</span>
            <span>{{ info.consigneeName }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">填报时间:</span>
            <span>{{ info.createTime }}</span>
            <el-divider></el-divider>
          </el-col>
          <el-col :md="24">
            <span class="label">供应商名称:</span>
            <span>{{ info.secondParty }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">供应商联系人:</span>
            <span>{{ info.secondPartyLinkman }}</span>
          </el-col>

          <el-col :md="24">
            <span class="label">联系电话:</span>
            <span>{{ info.secondPartyMobile }}</span>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 材料计划详情 start -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>材料计划详情</span>
      </div>
      <VXTable v-loading="tableLoading" :tableData="tableData" :columns="tableColumn" :pageShow="false" />
    </el-card>
    <!-- 材料计划详情 end -->
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button v-if="info.supplyStatus === 0 && type === 1" size="lg" type="primary">通知</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../api/procurement'
export default {
  name: 'ProcurementPartyDetail',
  components: {},
  data() {
    // 这里存放数据
    return {
      tableLoading: true,
      tableData: [],
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
          field: 'quantity',
          title: '合同数量'
        },
        {
          field: 'name',
          title: '合同剩余量',
          slots: {
            default: ({ row }) => [<span>{row.quantity - row.totalSupplyNum || 0}</span>]
          }
        },
        {
          field: 'supplyNum',
          title: '本计划供应量'
        },
        {
          field: 'usedPart',
          title: '使用部位'
        },
        {
          field: 'totalSupplyNum',
          title: '累计实际已供应量'
        },
        {
          field: 'planArrivalTime',
          title: '计划到场时间'
        },
        {
          field: 'remark',
          title: '备注'
        }
      ],
      info: {},
      type: ''
    }
  },
  created() {
    this.type = this.$route.params.type
    this.getPartyDetail()
  },
  mounted() {},
  // 方法集合
  methods: {
    async getPartyDetail() {
      let id = this.$route.params.id
      const res = await Api.getPartyDetail(id)
      this.info = res.data
      this.tableData = res.data.detailList || []
      this.tableLoading = false
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.header {
  display: flex;
  justify-content: flex-end;
  margin-top: -41px;
}
.details {
  font-size: 14px;
  .label {
    margin-right: 25px;
    margin-bottom: 15px;
    color: #999;
    display: inline-block;
    width: 103px;
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
.title-btn {
  float: right;
  display: flex;
  justify-content: space-around;
  align-items: center;
  > p {
    margin-right: 10px;
    > span + span {
      margin-left: 10px;
    }
  }
}
/deep/.details {
  .label {
    margin-bottom: 10px;
  }
}
/deep/ .el-divider--horizontal {
  margin: 10px 0 20px 0;
}
.statusWrapper {
  position: relative;
  top: 55px;
  right: 50px;
  text-align: center;
  .gray {
    color: #ccc;
  }
}
.footer-btn {
  z-index: 1000;
  justify-content: flex-end;
  padding-right: 250px !important;
}
</style>
