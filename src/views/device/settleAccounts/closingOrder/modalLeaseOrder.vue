<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 543ebac50c423a475a1b21b616f09b34e8269555
@代码提交修改日期: 2020-03-10
@任务类型: 修改代码，物资租赁结算单 租赁单模态框接口调整，新增物资租赁结算单接口对接，新增物资租赁结算单界面样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <el-dialog width="1080px" :title="'请选择租赁单'" :visible="visible" @open="handleLoad" @close="handleCancel">
    <el-form ref="form" :model="form" :inline="true">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="synthesize">
            <el-input
              v-model="form.synthesize"
              placeholder="租赁计划编号/租赁计划名称/创建人"
              style="width: 252px;"
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
            />
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </li>
      </ul>
    </el-form>

    <vxe-table
      ref="xTable"
      border
      resizable
      show-overflow
      :data="tableData"
      :loading="loading"
      @radio-change="radioChangeEvent"
    >
      <vxe-table-column type="radio" width="50"></vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="dispatchCode" title="租赁单编号" show-overflow="title"></vxe-table-column>
      <vxe-table-column field="planCode" title="租赁计划编号" show-overflow="title"></vxe-table-column>
      <vxe-table-column field="supplierName" title="供应商名称"></vxe-table-column>
      <vxe-table-column field="contractCode" title="合同编号"></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" show-overflow="title"></vxe-table-column>
      <vxe-table-column field="status" title="状态">
        <template v-slot="{ row }">
          <span v-if="row.status === 0">草稿</span>
          <span v-else-if="row.status === 1">待审核</span>
          <span v-else-if="row.status === 2">已通过</span>
          <span v-else-if="row.status === 3">已驳回</span>
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

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleEnter">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/api/device/goodsPlan/leaseOrder'
export default {
  name: 'ModalPurchaseOrder',
  props: {
    visible: Boolean
  },
  data() {
    return {
      form: {
        synthesize: '',
        startTime: '',
        endTime: '',
        createTime: ''
      },
      selectRow: null,
      tableData: [],

      loading: false,
      page: 1,
      rows: 10,
      total: 0
    }
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

      this.loading = true

      Api.getLeaseOrderList({
        projectId: localStorage.getItem('projectId'),
        type: '2', //代表租赁单
        content,
        createTimeBegin,
        createTimeEnd,
        status: '2', //状态已通过
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
    handleLoad() {
      this.refresh(1, this.rows)
    },
    handleCancel() {
      this.selectRow = null
      this.$refs.xTable.clearRadioRow()
      this.$emit('update:visible', false)
    },
    handleEnter() {
      if (this.selectRow) {
        this.$emit('update:visible', false)
        this.$emit('optionSelectRecord', this.selectRow)
      } else {
        this.$message.error('请选择一条记录，再做该操作')
      }
    },
    radioChangeEvent({ row }) {
      this.selectRow = row
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
