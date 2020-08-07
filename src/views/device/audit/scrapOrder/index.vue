<!--
@任务名称: 2623/物资报废处理单遗留问题
@开发人员: 董渊海
@创建日期: 2020-03-16
@任务类型: 复制修改代码，添加物资报废处理单审核列表页和列表接口对接，修改比例(10%)

@bug名称: 1183/附件列，显示【查看附件】，点击弹出模态框，可查看附件列表详情
@开发人员: 董渊海
@修改日期: 2020-03-20
@任务类型: 修改代码，修改比例(2%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: dd2327e494abad7b8fd77c09155d4cfb85dcc14b
@代码提交修改日期: 2020-03-16
@任务类型: 修改代码，物资报废处理单审核 添加审核列表页、审核页、详情页，对接审核列表接口、审核接口、详情接口，审核页和详情页样式调整，发起人查看页添加审核结果模块
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

    <vxe-table ref="xTable" border resizable show-overflow :data="tableData" :loading="loading">
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="scrapBillCode" title="报废处理单编号"></vxe-table-column>
      <vxe-table-column field="scrapTime" title="报废处理日期"></vxe-table-column>
      <vxe-table-column field="scrapAmount" title="报废处理金额"></vxe-table-column>
      <vxe-table-column field="scrapReason" title="报废原因"></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column field="fileId" title="附件">
        <template v-slot="{ row }">
          <AttachmentDialog accept=".jpg,.png,.gif,.webp,.bmp" manage :ids.sync="row.fileId"></AttachmentDialog>
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
        auditFlag: '1', //非草稿状态
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
    handleAudit(id, row) {
      this.$router.push({ name: 'AuditScrapOrder', params: { id: id } })
    },
    handleDetail(id, row) {
      this.$router.push({ name: 'AuditScrapOrderDetail', params: { id: id } })
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
