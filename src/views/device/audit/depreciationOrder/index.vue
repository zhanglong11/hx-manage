<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 27219c8d737cc106b7914b5ea5ee60c04acc8d4e
@代码提交修改日期: 2020-03-12
@任务类型: 修改代码，物资折旧单审核 列表接口对接，审核接口对接，添加审核详情页，审核页和详情页样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div>
    <el-form ref="form" :inline="true" :model="form">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="synthesize">
            <el-input
              v-model="form.synthesize"
              placeholder="折旧物资编号/折旧物资名称"
              style="width: 210px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="折旧月份" prop="month">
            <el-date-picker v-model="form.month" type="month" placeholder="请选择" format="MM" style="width: 100px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="折旧年度" prop="year">
            <el-date-picker v-model="form.year" type="year" placeholder="请选择" style="width: 100px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 336px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态" style="width: 120px;">
              <el-option label="草稿" value="1"></el-option>
              <el-option label="待审核" value="2"></el-option>
              <el-option label="已通过" value="3"></el-option>
              <el-option label="已驳回" value="4"></el-option>
            </el-select>
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </li>
      </ul>
    </el-form>

    <vxe-table ref="xTable" border resizable show-overflow :data="tableData" :loading="loading">
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="materialCode" title="折旧物资编号"></vxe-table-column>
      <vxe-table-column field="materialName" title="折旧物资名称"></vxe-table-column>
      <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
      <vxe-table-column field="amount" title="数量"></vxe-table-column>
      <vxe-table-column field="calculateUnit" title="计量单位"></vxe-table-column>
      <vxe-table-column field="depreciationYear" title="折旧年度"></vxe-table-column>
      <vxe-table-column field="depreciationMonth" title="折旧月度"></vxe-table-column>
      <vxe-table-column field="yearlyDepreciation" title="年折旧率"></vxe-table-column>
      <vxe-table-column field="monthDepreciation" title="月折旧额"></vxe-table-column>
      <vxe-table-column field="depreciationAmount" title="累计折旧"></vxe-table-column>
      <vxe-table-column field="depreciationWay" title="折旧方式">
        <template v-slot="{ row }">
          <span v-if="row.depreciationWay === 1">年限法</span>
          <span v-else-if="row.depreciationWay === 2">工作量法</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="status" title="状态">
        <template v-slot="{ row }">
          <span v-if="row.status === 0">草稿</span>
          <span v-else-if="row.status === 1">待审核</span>
          <span v-else-if="row.status === 2">已通过</span>
          <span v-else-if="row.status === 3">已驳回</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="130">
        <template v-slot="{ row }">
          <span v-if="row.status === 1">
            <a @click="handleAudit(row.id, row)">审核</a>
          </span>
          <span v-else>
            <a @click="handleDetail(row.id, row)">查看</a>
          </span>
        </template>
      </vxe-table-column>
    </vxe-table>

    <vxe-pager
      border
      size="medium"
      :loading="loading"
      :current-page="page"
      :page-size="rows"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange"
    >
    </vxe-pager>
  </div>
</template>

<script>
import Api from '@/api/device/settleAccounts/depreciationOrder'
export default {
  name: 'DepreciationOrderAudit',
  data() {
    return {
      form: {
        synthesize: '',
        month: '',
        year: '',
        createTime: '',
        status: ''
      },
      tableData: [],

      loading: false,
      page: 1,
      rows: 10,
      total: 0
    }
  },
  mounted() {
    this.refresh(1, this.rows)
  },
  methods: {
    refresh(page, rows) {
      let createTimeBegin = ''
      let createTimeEnd = ''
      if (this.form.createTime !== null && this.form.createTime !== '' && this.form.createTime.length !== 1) {
        createTimeBegin = moment(this.form.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        createTimeEnd = moment(this.form.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      let content = this.form.synthesize
      let status = this.form.status

      let depreciationMonth = ''
      if (this.form.month !== null && this.form.month !== '') {
        depreciationMonth = moment(this.form.month).format('MM')
      }
      let depreciationYear = ''
      if (this.form.year !== null && this.form.year !== '') {
        depreciationYear = moment(this.form.year).format('YYYY')
      }

      this.loading = true

      Api.getDepreciationOrderList({
        auditFlag: '1', //非草稿状态
        projectId: localStorage.getItem('projectId'),
        content,
        createTimeBegin,
        createTimeEnd,
        depreciationMonth,
        depreciationYear,
        status,
        page,
        rows
      }).then(res => {
        //console.log(res)
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
        this.page = page
        this.rows = rows
      })
    },
    handleSearch() {
      this.refresh(1, this.rows)
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.refresh(1, this.rows)
    },
    handleDetail(id, row) {
      this.$router.push({ name: 'AuditDepreciationOrderDetail', params: { id: id } })
    },
    handleAudit(id, row) {
      this.$router.push({ name: 'AuditDepreciationOrder', params: { id: id } })
    },
    handleEdit(id, row) {},
    handleDelete(id, row) {},

    handlePageChange({ currentPage, pageSize }) {
      this.refresh(currentPage, pageSize)
    }
  }
}
</script>

<style scoped lang="less">
.search_bar {
  display: flex;
  justify-content: space-between;

  .search_bar_btn {
    white-space: nowrap;
  }
}
</style>
