<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 20px;">
          <el-input v-model="filter.keyword" placeholder="合同编号/付款名称/付款方/收款方/创建人" style="width: 300px;">
            <i slot="suffix" class="el-icon-search"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="支付阶段" label-width="80px" prop="paymentStage" style="margin-right: 20px;">
          <PaymentStatusSelect v-model="filter.paymentStage"></PaymentStatusSelect>
        </el-form-item>
        <el-form-item label="付款状态" label-width="80px" prop="status" style="margin-right: 20px;">
          <PayStatusSelect v-model="filter.status"></PayStatusSelect>
        </el-form-item>
        <el-form-item>
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
        </el-form-item>
      </el-form>
      <div class="tableWrapper">
        <vxe-table ref="xTable" v-loading="loading" border :data="tableData">
          <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
          <vxe-table-column field="contractCode" title="合同编号" min-width="120">
            <template slot-scope="{ row }">
              <span v-if="$hasPower('ContractDetail')" style="margin: 0 3px;">
                <a @click="handleContractDetail(row.contractId)">{{ row.contractCode }}</a></span
              >
              <span v-else>
                {{ row.contractCode }}
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="code" title="付款单编号" min-width="120">
            <template slot-scope="{ row }">
              <span v-if="$hasPower('PaymentDetail')" style="margin: 0 3px;">
                <a @click="handleDetail(row)">{{ row.code }}</a></span
              >
              <span v-else>{{ row.code }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="payer" title="付款方" min-width="120" />
          <vxe-table-column field="payee" title="收款方" min-width="120" />

          <vxe-table-column field="name" title="付款单名称" min-width="120" />
          <vxe-table-column field="totalAmount" title="申报金额合计（元）" min-width="150" />
          <vxe-table-column field="paymentStage" title="支付阶段" min-width="150">
            <template slot-scope="{ row }">
              <span>{{
                row.paymentStage ? paymentStatus.filter(item => item.value === row.paymentStage)[0].label : ''
              }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="paymentTime" title="支付时间" min-width="120">
            <template slot-scope="{ row }">
              <span>{{ moment(row.paymentTime).format('YYYY-MM-DD') }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="status" title="付款状态" min-width="120">
            <template slot-scope="{ row }">
              <span>{{ payStatus.filter(item => item.value === row.status)[0].label }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="auditMoney" title="审批金额（元）" min-width="120" />
          <vxe-table-column field="realPaymentTime" title="实际支付时间" min-width="120" />
          <vxe-table-column field="paymentMoney" title="已支付金额（元）" min-width="150" />
          <vxe-table-column field="currentPaymentMoney" title="本月支付金额（元）" min-width="150" />
          <vxe-table-column field="creatorName" title="创建人" min-width="120" />
          <vxe-table-column field="createTime" title="创建时间" min-width="120" />
          <vxe-table-column field="remark" title="备注" min-width="120" />
          <vxe-table-column title="操作" width="120" fixed="right">
            <template slot-scope="{ row }">
              <span v-if="$hasPower('PaymentDetail')" style="margin: 0 3px;">
                <a @click="handleDetail(row)">查看</a></span
              >
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
    <div class="footer-btn">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import paymentStatus from '@/lib/paymentStatus' //支付阶段
import payStatus from '../../lib/payStatus'
import Api from '@/api/contract/contractMeasurementPayment'
export default {
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      loading: false,
      filter: {
        statusList: [4, 5],
        keyword: '',
        paymentStage: null,
        status: null
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      paymentStatus: paymentStatus,
      payStatus: payStatus
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    refresh(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      this.loading = true
      this.axios.construction
        .post(`/contractMeasurementPayment/epcList`, {
          ...this.filter,
          rows: this.pageSize,
          page: this.currentPage,
          projectId: this.projectId,
          ...this.$route.query
        })
        .then(res => {
          console.log('list')
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
      this.$router.push({ name: `PaymentDetail`, params: { id: id, isEdit: false, isCheck: false } })
    },

    handleContractDetail(id) {
      // this.$router.push(`Detail/${id}`)
      this.$router.push({
        name: 'ContractDetail',
        params: { id }
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
    cancel() {
      this.$router.back()
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
