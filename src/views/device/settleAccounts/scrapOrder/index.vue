<!--
@任务名称: 2623/物资报废处理单遗留问题
@开发人员: 董渊海
@创建日期: 2020-02-12
@任务类型: 全新代码

@修改日期: 2020-03-13
@任务类型: 修改代码，对接报废处理单列表接口，修改比例(50%)

@修改日期: 2020-03-16
@修改代码: 修改代码，列表接口完善，修改比例(60%)

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
@git提交编号: 1d1dc3029f349f97ee597e982bfb6edb5d8220c9
@代码提交修改日期: 2020-03-13
@任务类型: 修改代码，物资报废处理单 列表接口对接(50%)、新增报废处理单页面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: c168eaca35978f92de892657dd54701bdaaed203
@代码提交修改日期: 2020-03-16
@任务类型: 修改代码，物资报废处理单 对接 列表接口(100%)、新增接口、编辑接口、保存提交功能、删除接口、详情接口、模态框选择剩余库存物资列表接口
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
              placeholder="报废处理单编号/报废处理金额/报废原因/创建人"
              style="width: 320px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="报废处理时间" prop="scrapTime">
            <el-date-picker
              v-model="form.scrapTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 336px;"
            ></el-date-picker>
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
      <vxe-table-column field="scrapBillCode" title="报废处理单编号"></vxe-table-column>
      <vxe-table-column field="scrapTime" title="报废处理日期"></vxe-table-column>
      <vxe-table-column field="scrapAmount" title="报废处理金额"></vxe-table-column>
      <vxe-table-column field="scrapReason" title="报废原因"></vxe-table-column>
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
import Api from '@/api/device/settleAccounts/scrapOrder'
export default {
  name: 'ScrapOrder',
  data() {
    return {
      form: {
        synthesize: '',
        scrapTime: '',
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

      let scrapTimeBegin = ''
      let scrapTimeEnd = ''
      if (this.form.scrapTime !== null && this.form.scrapTime !== '' && this.form.scrapTime.length !== 1) {
        scrapTimeBegin = moment(this.form.scrapTime[0]).format('YYYY-MM-DD HH:mm:ss')
        scrapTimeEnd = moment(this.form.scrapTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }

      let content = this.form.synthesize
      let status = this.form.status

      this.loading = true

      Api.getScrapOrderList({
        projectId: localStorage.getItem('projectId'),
        createTimeBegin,
        createTimeEnd,
        content,
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
      this.$router.push({ name: 'ScrapOrderAdd' })
    },
    handleDetail(id, row) {
      this.$router.push({ name: 'ScrapOrderDetail', params: { id: id } })
    },
    handleEdit(id, row) {
      this.$router.push({ name: 'ScrapOrderEdit', params: { id: id } })
    },
    handleDelete(id, row) {
      this.$confirm(`确定移除 ${row.scrapBillCode} 记录吗？`).then(res => {
        Api.deleteScrapOrder(id).then(res => {
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
