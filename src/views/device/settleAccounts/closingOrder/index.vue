<!--
@bug名称: 1183/附件列，显示【查看附件】，点击弹出模态框，可查看附件列表详情
@开发人员: 董渊海
@修改日期: 2020-03-20
@任务类型: 修改代码，修改比例(2%)

@bug名称: 1492/如果没有附件，显示【无】；附件详情模态框，不允许上传和删除，只允许查看和下载
@开发人员: 董渊海
@修改日期: 2020-03-20
@任务类型: 修改代码，修改比例(1%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 543ebac50c423a475a1b21b616f09b34e8269555
@代码提交修改日期: 2020-03-10
@任务类型: 修改代码，物资租赁结算单 租赁单模态框接口调整，新增物资租赁结算单接口对接，新增物资租赁结算单界面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: ae534b410c148fda9e347871bf82ada349aaf3ea
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资租赁结算单 编辑接口对接，结算单列表接口对接，详情接口对接，并重新调整租赁结算单详情页样式
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 707075396d45ffaf3e980f32348af96fed37f273
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资租赁结算单 删除接口对接，审核列表接口对接，审核提交接口对接，添加审核详情页，审核页和详情页样式重新调整
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
              placeholder="物资租赁结算单编号/租赁单编号/结算金额/创建人"
              style="width: 332px;"
              suffix-icon="el-icon-search"
            />
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
              <el-option label="草稿" value="0"></el-option>
              <el-option label="待审核" value="1"></el-option>
              <el-option label="已通过" value="2"></el-option>
              <el-option label="已驳回" value="3"></el-option>
            </el-select>
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </li>
      </ul>
    </el-form>

    <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" @click="handleAdd">新增</el-button>
    <vxe-table ref="xTable" border resizable show-overflow :data="tableData" :loading="loading">
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="rentSettlementBillCode" title="物资租赁结算单编号"></vxe-table-column>
      <vxe-table-column field="rentBillCode" title="租赁单编号"></vxe-table-column>
      <vxe-table-column field="contractCode" title="合同编号"></vxe-table-column>
      <vxe-table-column field="settlementAmount" title="结算金额"></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column field="fileId" title="附件">
        <template v-slot="{ row }">
          <AttachmentDialog accept=".jpg,.png,.gif,.webp,.bmp" :ids.sync="row.fileId"></AttachmentDialog>
        </template>
      </vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
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
          <span v-if="row.status === 0">
            <a @click="handleDetail(row.id, row)">查看</a>&nbsp; <a @click="handleEdit(row.id, row)">编辑</a>&nbsp;
            <a @click="handleDelete(row.id, row)">删除</a>
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
import Api from '@/api/device/settleAccounts/closingOrder'
export default {
  name: 'ClosingOrder',
  data() {
    return {
      form: {
        synthesize: '',
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

      this.loading = true

      Api.getClosingOrderList({
        projectId: localStorage.getItem('projectId'),
        content,
        createTimeBegin,
        createTimeEnd,
        status,
        page,
        rows
      }).then(res => {
        //console.log(res)
        this.loading = false
        this.tableData = res.data.records
        this.tableData.map(item => {
          item.fileId = item.fileId ? item.fileId : ''
        })
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
    handleAdd() {
      this.$router.push({ name: 'ClosingOrderAdd' })
    },
    handleDetail(id, row) {
      this.$router.push({ name: 'ClosingOrderDetail', params: { id: id } })
    },
    handleEdit(id, row) {
      this.$router.push({ name: 'ClosingOrderEdit', params: { id: id } })
    },
    handleDelete(id, row) {
      this.$confirm(`确定移除 ${row.rentSettlementBillCode} 记录吗？`).then(res => {
        Api.deleteClosingOrder(id).then(res => {
          this.$message.success('删除成功')
          this.refresh(1, this.rows)
        })
      })
    },

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
