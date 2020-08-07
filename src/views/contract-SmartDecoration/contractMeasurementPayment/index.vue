<template>
  <div class="contentWrapper">
    <div class="headContainer">
      <div class="formWrapper">
        <el-form ref="form" :inline="true" :model="filter">
          <div>
            <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 20px;">
              <el-input
                v-model="filter.keyword"
                placeholder="合同编号/付款名称/付款方/收款方/创建人"
                style="width: 280px;"
              >
                <i slot="suffix" class="el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="付款状态" label-width="80px" prop="status" style="margin-right: 20px;">
              <SelectList v-model="filter.status" :self-list="auditStatus" />
            </el-form-item>
            <el-form-item label="支付时间" label-width="80px" prop="payTime">
              <el-date-picker
                v-model="filter.payTime"
                type="daterange"
                range-separator="至"
                start-placeholder="请选择"
                end-placeholder="请选择"
                style="width: 300px;"
                value-format="yyyy-MM-dd 00:00:00"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="实际支付时间" label-width="120px" prop="realPayTime" style="margin-right: 20px;">
              <el-date-picker
                v-model="filter.realPayTime"
                type="daterange"
                range-separator="至"
                start-placeholder="请选择"
                end-placeholder="请选择"
                style="width: 300px;"
                value-format="yyyy-MM-dd 00:00:00"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="创建时间" label-width="120px" prop="createTime">
              <el-date-picker
                v-model="filter.createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="请选择"
                end-placeholder="请选择"
                style="width: 300px;"
                value-format="yyyy-MM-dd 00:00:00"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="operateButton">
        <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
        <el-button
          @click="
            () => {
              $refs.form.resetFields()
              refresh(true)
            }
          "
          >重置</el-button
        >
      </div>
    </div>
    <el-row type="flex" justify="space-between">
      <el-col :span="6">
        <el-button v-if="$hasPower('ContractMeasurementAddSmartDecoration')" type="primary" @click="toEdit(null)">
          新建合同付款单
        </el-button>
        <el-button
          v-if="$hasPower('FinancePayAddSmartDecoration')"
          style="margin-left: 10px;"
          @click="handleAddFinancePay"
        >
          财务支付填报
        </el-button>
      </el-col>
      <!--      <el-col :span="6" style="text-align: right"> <a @click="handleDownload">下载合同范本</a></el-col>-->
    </el-row>
    <div class="tableWrapper">
      <vxe-table
        ref="xTable"
        v-loading="loading"
        border
        :data="tableData"
        :edit-config="{ trigger: 'manual', mode: 'row' }"
      >
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="contractCode" title="合同编号" min-width="120">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('ContractMeasurementDetailSmartDecoration')" style="margin: 0 3px;">
              <a @click="handleContractDetail(row.contractId)">{{ row.contractCode }}</a></span
            >
            <span v-else>{{ row.contractCode }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="code" title="付款单编号" min-width="120">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('ContractMeasurementDetailSmartDecoration')" style="margin: 0 3px;">
              <a @click="handleDetail(row)">{{ row.code }}</a></span
            >
            <span v-else>{{ row.code }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="payer" title="付款方" min-width="120" />
        <vxe-table-column field="payee" title="收款方" min-width="120" />
        <vxe-table-column field="name" title="付款单名称" width="120" />
        <vxe-table-column field="totalAmount" title="申报金额合计（元）" min-width="150" />
        <vxe-table-column field="status" title="支付阶段" min-width="120">
          <template slot-scope="{ row }">
            <span> {{ $getLabel([...totalPayPhase, ...projectPayPhase, ...monthPayPhase], row.paymentStage) }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="paymentTime" title="支付时间" min-width="120">
          <template slot-scope="{ row }">
            <span>{{ moment(row.paymentTime).format('YYYY-MM-DD') }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="status" title="付款状态" min-width="120">
          <template slot-scope="{ row }">
            <span>{{ $getLabel(auditStatus, row.status) }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="auditMoney" title="审批金额（元）" min-width="120" />
        <vxe-table-column field="realPaymentTime" title="实际支付时间" min-width="120" />
        <vxe-table-column field="paymentMoney" title="已支付金额（元）" min-width="150" />
        <vxe-table-column field="creatorName" title="创建人" min-width="120" />
        <vxe-table-column field="createTime" title="创建时间" min-width="120" />
        <vxe-table-column field="remark" title="备注" min-width="120" />
        <vxe-table-column title="操作" width="120">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('ContractMeasurementDetailSmartDecoration')" style="margin: 0 3px;">
              <a @click="handleDetail(row)">查看</a></span
            >
            <template v-if="row.status === 0">
              <span v-if="$hasPower('ContractMeasurementEditSmartDecoration')" style="margin: 0 3px;"
                ><a @click="toEdit(row.id)">编辑</a></span
              >
              <span v-if="$hasPower('ContractMeasurementDeleteSmartDecoration')" style="margin: 0 3px;"
                ><a @click="handleDelete(row.id)">删除</a></span
              >
            </template>
          </template>
        </vxe-table-column>
      </vxe-table>
      <div style="margin-top: 10px;">
        <div class="toolbar" style="display: flex; justify-content: space-between;">
          <div class="num">
            共 {{ total }} 条记录 第 {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }} 页
            <el-button type="text primary" class="el-icon-refresh" @click="refresh(false)"></el-button>
          </div>
          <el-pagination
            class="pagination"
            :total="total"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="sizes, prev, pager, next, jumper"
            @current-change="handlePageChange"
            @size-change="handlePageSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import paymentStatus from '@/lib/paymentStatus' //支付阶段
import Api from '@/api/contract/contractMeasurementPayment'
import auditStatus from './lib/auditStatus'
import totalPayPhase from './lib/totalPayPhase'
import projectPayPhase from './lib/projectPayPhase'
import monthPayPhase from './lib/monthPayPhase'
export default {
  name: 'ContractMeasurementPayment',
  components: {},
  data() {
    return {
      totalPayPhase,
      projectPayPhase,
      monthPayPhase,
      projectId: localStorage.getItem('projectId'),
      loading: false,
      filter: {
        keyword: '',
        paymentStage: null,
        status: null,
        payTime: [],
        realPayTime: [],
        createTime: []
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      paymentStatus: paymentStatus,
      auditStatus
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    refresh(isFirstPage) {
      console.log(this.currentPage)
      if (isFirstPage) {
        this.currentPage = 1
      }
      this.loading = true
      Api.getContractMeasurementPaymentList({
        ...this.filter,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId,
        paymentStartTime: this.filter.payTime[0],
        paymentEndTime: this.filter.payTime[1],
        realPaymentStartTime: this.filter.realPayTime[0],
        realPaymentEndTime: this.filter.realPayTime[1],
        createStartTime: this.filter.createTime[0],
        createEndTime: this.filter.createTime[1]
      })
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.records
            this.total = res.data.total
          } else {
            this.$message.error('未知错误,请重试')
          }
        })
        .finally(() => (this.loading = false))
    },
    handleDetail(row) {
      let { paymentStage, id } = row
      this.$router.push({
        name: `ContractMeasurementDetailSmartDecoration`,
        params: { id: id, isEdit: false, isCheck: false }
      })
      // this.$router.push({ name: `PaymentDetail`, params: { id: id, isEdit: false, isCheck: false } })
      /*switch (paymentStage) {
        /!**
         任务名称：BUG1251 合同管理-合同计量与支付-预付款-查看-报错
         开发人员：崔洛宜
         日期：2020-03-24
         BUG类型：测试人员发现的研发自测未通过引起的BUG
         **!/
        case 1:
          this.$router.push({ name: `ProjectProcessDetail`, params: { row: row, isEdit: false, isCheck: false } })
          break
        case 2:
          this.$router.push({ name: `ContractMeasurementPaymentDetail`, params: { row: row, id: id, isCheck: false } })
          break
        case 3:
          this.$router.push({ name: `FinalPaymentDetail`, params: { row: row, id: id, isCheck: false } })
          break
        case 4:
          this.$router.push({ name: `RefundDepositDetail`, params: { row: row, id: id, isCheck: false } })
          break
        default:
          return false
      }*/
    },
    handleAddFinancePay() {
      this.$router.push({ name: `FinancePayAddSmartDecoration`, params: {} })
    },
    toEdit(id) {
      _.isNil(id)
        ? this.$router.push({ name: `ContractMeasurementAddSmartDecoration` })
        : this.$router.push({ name: `ContractMeasurementEditSmartDecoration`, params: { id } })
    },
    handleEdit(row) {
      let { paymentStage, id } = row
      switch (paymentStage) {
        case 1:
          this.$router.push({ name: `ProjectProcessEditSmartDecoration`, params: { row: row, isEdit: true } })
          break
        case 2:
          this.$router.push({ name: `PrepaymentEditSmartDecoration`, params: { id: id, isEdit: true } })
          break
        case 3:
          this.$router.push({ name: `FinalPaymentEditSmartDecoration`, params: { id: id, isEdit: true } })
          break
        case 4:
          this.$router.push({ name: `RefundDepositEditSmartDecoration`, params: { id: id, isEdit: true } })
          break
        default:
          return false
      }
    },
    handleDelete(id) {
      Api.deleteContractMeasurementPaymentById(id).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.refresh()
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleContractDetail(id) {
      // this.$router.push(`Detail/${id}`)
      this.$router.push({
        name: 'ContractDetailSmartDecoration',
        params: {
          id
        }
      })
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh(true)
    },
    handleAddClick(command) {
      switch (command) {
        case 'a':
          this.$router.push('ProjectProcessSmartDecoration')
          break
        case 'b':
          this.$router.push({ name: `PrepaymentSmartDecoration`, params: {} })
          break
        case 'c':
          this.$router.push('FinalPaymentSmartDecoration')
          break
        case 'd':
          this.$router.push('RefundDepositSmartDecoration')
          break
        default:
          break
      }
    }
  }
}
</script>
<style lang="less" scoped>
.contentWrapper {
  padding: 10px;
}
.tableWrapper {
  margin-top: 20px;
}
.headContainer {
  display: flex;
  justify-content: space-between;
  .formWrapper {
    flex: 1;
  }
  .operateButton {
    flex: 0 0 150px;
    text-align: right;
  }
}
.dropdownItem {
  width: 120px;
  text-align: center;
}
/deep/ .el-range-separator {
  width: 20px;
}
</style>
