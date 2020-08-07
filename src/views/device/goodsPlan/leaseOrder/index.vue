<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 59853e620c5d96d0dab46c54c6bd564896eec168
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，完成 租赁单列表查询接口对接(80%)，新增租赁单界面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: e04dcf4a7120d82136af418984d5c7ad6cd64082
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，完成 租赁单 新增租赁单时，查询租赁合同明细与租赁计划明细的交集业务；新增租赁单接口对接；租赁单列表功能；编辑租赁单接口对接；保存提交功能；删除租赁单接口对接；详情接口对接；详情界面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 205b52064519eb0958411cba677f55987291c7c8
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，物资设备计划模块和审核模块 时间组件 添加时分秒
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: edaef18d4be0b375e110fd81486e140300f62f44
@代码提交修改日期: 2020-03-09
@任务类型: 修改代码，租赁单和租赁单审核模块，对接实际开始时间字段和实际结束时间字段
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
              placeholder="租赁单编号/租赁计划名称/创建人"
              style="width: 236px;"
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
            <el-select v-model="form.status" placeholder="请选择状态">
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
    <vxe-table border resizable show-overflow :data="tableData" :loading="loading">
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="dispatchCode" title="租赁单编号"></vxe-table-column>
      <vxe-table-column field="planCode" title="租赁计划编号"></vxe-table-column>
      <vxe-table-column field="supplierName" title="供应商名称"></vxe-table-column>
      <vxe-table-column field="contractCode" title="合同编号"></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
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
          <span v-else-if="row.status === 1 || row.status === 2 || row.status === 3">
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
import Api from '@/api/device/goodsPlan/leaseOrder'
export default {
  name: 'LeaseOrder',
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

      Api.getLeaseOrderList({
        projectId: localStorage.getItem('projectId'),
        type: '2', //代表租赁单
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
      this.$router.push({ name: 'LeaseOrderAdd' })
    },
    handleDetail(id, row) {
      this.$router.push({ name: 'LeaseOrderDetail', params: { id: id } })
    },
    handleEdit(id, row) {
      this.$router.push({ name: 'LeaseOrderEdit', params: { id: id } })
    },
    handleDelete(id, row) {
      this.$confirm(`确定移除 ${row.dispatchCode} 记录吗？`).then(res => {
        Api.deleteLeaseOrder(id).then(res => {
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
