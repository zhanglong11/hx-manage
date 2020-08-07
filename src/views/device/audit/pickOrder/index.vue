<template>
  <div>
    <el-form ref="form" :inline="true" :model="form">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="content">
            <el-input
              v-model="form.content"
              placeholder="领料单编号/领料单位/领料人/创建人"
              style="width: 260px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="领料日期" prop="checkTime">
            <el-date-picker
              v-model="form.checkTime"
              type="daterange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              style="width: 220px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <BasicStatusSelect v-model="form.status"></BasicStatusSelect>
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              style="width: 220px;"
            ></el-date-picker>
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </li>
      </ul>
    </el-form>

    <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" @click="handleAdd">新增</el-button>
    <vxe-table ref="xTable" border resizable show-overflow :data="tableData">
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="receiveBillCode" title="领料单编号"></vxe-table-column>
      <vxe-table-column field="receiveOrganName" title="领料单位"></vxe-table-column>
      <vxe-table-column field="receiverName" title="领料人"></vxe-table-column>
      <vxe-table-column field="receiveTime" title="领料日期"></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column field="status" title="状态">
        <template slot-scope="{ row }">
          <span>{{
            row.status !== null && row.status !== undefined
              ? baseStatus.filter(item => item.value === row.status)[0].label
              : ''
          }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="130">
        <template v-slot="{ row }">
          <span v-if="row.status === 1">
            <a @click="handleCheck(row.id, row)">审核</a>
          </span>
          <span v-else>
            <a @click="handleDetial(row.id, row)">查看</a>
          </span>
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
</template>

<script>
import Api from '@/api/device/material/pickOrder'
import baseStatus from '@/lib/basicStatus'
export default {
  name: 'PickOrderCheck',
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      form: {
        content: '',
        checkTime: [],
        status: '',
        createTime: []
      },
      tableData: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      baseStatus
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
      Api.getList({
        ...this.form,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId,
        receiveBeginTime: this.form.checkTime[0],
        receiveEndTime: this.form.checkTime[1],
        createBeginTime: this.form.createTime[0],
        createEndTime: this.form.createTime[1]
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
    },
    handleAdd() {
      this.$router.push('AddPickOrder')
    },
    handleDetial(id, row) {
      this.$router.push({
        name: 'AuditPickOrderDetail',
        params: {
          id: id,
          isCheck: false
        }
      })
    },
    handleCheck(id, row) {
      this.$router.push({
        name: 'AuditPickOrder',
        params: {
          id: id,
          isCheck: true
        }
      })
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh()
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
