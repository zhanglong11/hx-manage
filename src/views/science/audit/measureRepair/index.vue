<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 2df4254965c57fc2ee1459fd7516b0e3f27d8198
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器故障维修审核 搜索的时间组件添加时分秒，审核和详情的界面样式重新调整
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
              placeholder="编码/名称/规格及型号/故障描述/创建人"
              style="width: 270px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="故障发生时间" prop="breakdownTime">
            <el-date-picker
              v-model="form.breakdownTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 336px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="设备状态" prop="equipmentStatus">
            <el-select v-model="form.equipmentStatus" placeholder="请选择设备状态" style="width: 140px;">
              <el-option label="停用" value="0"></el-option>
              <el-option label="在用" value="1"></el-option>
              <el-option label="封存" value="2"></el-option>
              <el-option label="报废" value="3"></el-option>
            </el-select>
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
            <el-select v-model="form.status" placeholder="请选择状态" style="width: 140px;">
              <el-option label="故障维修待审核" value="0"></el-option>
              <el-option label="故障维修已通过" value="1"></el-option>
              <el-option label="故障维修已驳回" value="2"></el-option>
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
      <vxe-table-column field="manufactureNum" title="出厂编号"></vxe-table-column>
      <vxe-table-column field="deviceName" title="名称">
        <!--任务号：973、修改人：董渊海、修改时间：2020-03-23-->
        <template v-slot="{ row }">
          <a @click="handleDetail(row.id, row)">{{ row.deviceName }}</a>
        </template>
      </vxe-table-column>
      <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
      <vxe-table-column field="deviceStatus" title="设备状态">
        <template v-slot="{ row }">
          <span v-if="row.deviceStatus === 0">停用</span>
          <span v-else-if="row.deviceStatus === 1">在用</span>
          <span v-else-if="row.deviceStatus === 2">封存</span>
          <span v-else-if="row.deviceStatus === 3">报废</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="faultTime" title="故障发生时间"></vxe-table-column>
      <vxe-table-column field="faultDesc" title="故障描述"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column field="status" title="状态">
        <template v-slot="{ row }">
          <span v-if="row.status === 0">故障维修待审核</span>
          <span v-else-if="row.status === 1">故障维修已通过</span>
          <span v-else-if="row.status === 2">故障维修已驳回</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="130">
        <template v-slot="{ row }">
          <span v-if="row.status === 0">
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
import Api from '@/api/science/audit/measureRepair'
export default {
  name: 'MeasureRepairAudit',
  data() {
    return {
      form: {
        synthesize: '',
        breakdownTime: '',
        equipmentStatus: '',
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
      let createStartTime = ''
      let createEndTime = ''
      if (this.form.createTime !== null && this.form.createTime !== '' && this.form.createTime.length !== 1) {
        createStartTime = moment(this.form.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        createEndTime = moment(this.form.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      let faultStartTime = ''
      let faultEndTime = ''
      if (this.form.breakdownTime !== null && this.form.breakdownTime !== '' && this.form.breakdownTime.length !== 1) {
        faultStartTime = moment(this.form.breakdownTime[0]).format('YYYY-MM-DD HH:mm:ss')
        faultEndTime = moment(this.form.breakdownTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      let keyWord = this.form.synthesize
      let deviceStatus = this.form.equipmentStatus
      let status = this.form.status

      this.loading = true

      Api.getMeasureRepairAuditList({
        projectId: localStorage.getItem('projectId'),
        keyWord,
        createStartTime,
        createEndTime,
        faultStartTime,
        faultEndTime,
        deviceStatus,
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
      this.$router.push({ name: 'AuditMeasureRepairDetail', params: { id } })
    },
    handleAudit(id, row) {
      this.$router.push({ name: 'AuditMeasureRepair', params: { id: id } })
    },
    handleEdit(id, row) {},
    handleDelete(id, row) {},

    handlePageChange({ currentPage, pageSize }) {
      //this.page = currentPage
      //this.rows = pageSize
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
