<template>
  <div>
    <el-form ref="form" :inline="true" :model="form">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="content">
            <el-input
              v-model="form.content"
              placeholder="入库单编号/采购单编号/验收人/创建人"
              style="width: 270px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="入库日期" prop="checkTime">
            <el-date-picker
              v-model="form.checkTime"
              type="daterange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              style="width: 220px;"
              value-format="yyyy-MM-dd 00:00:00"
            ></el-date-picker>
          </el-form-item>
          <!--
               /**
              任务名称：BUG#1375 物资与设备管理-材料管理-入库单&出库单&材料清点-不需要【状态】
              开发人员：崔洛宜
              日期：2020-03-30
              BUG类型：测试人员发现的研发自测未通过引起的BUG
              **/
          -->
          <!--<el-form-item label="状态" prop="status">
            <BasicStatusSelect v-model="form.status"></BasicStatusSelect>
          </el-form-item>-->
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              style="width: 350px;"
              value-format="yyyy-MM-dd HH:mm:ss"
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
      <vxe-table-column field="stockCode" title="入库单编号"></vxe-table-column>
      <vxe-table-column field="purchaseBillCode" title="采购单编号"></vxe-table-column>
      <vxe-table-column field="inspectorName" title="验收人"></vxe-table-column>
      <vxe-table-column field="inspectTime" title="入库时间">
        <template v-slot="{ row }">
          {{ row.inspectTime | dateYMD }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="supplierName" title="供应商名称"></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <!--
               /**
              任务名称：BUG#1375 物资与设备管理-材料管理-入库单&出库单&材料清点-不需要【状态】
              开发人员：崔洛宜
              日期：2020-03-30
              BUG类型：测试人员发现的研发自测未通过引起的BUG
              **/
          -->
      <!--<vxe-table-column field="status" title="状态">
        <template slot-scope="{ row }">
          <span>{{
            row.status !== null && row.status !== undefined
              ? baseStatus.filter(item => item.value === row.status)[0].label
              : ''
          }}</span>
        </template>
      </vxe-table-column>-->
      <vxe-table-column field="flag" title="是否入库">
        <template v-slot="{ row }">
          {{ !!row.flag ? '是' : '否' }}
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="200">
        <template v-slot="{ row }">
          <a @click="handleDetial(row.id, row)">查看</a>
          <template v-if="row.flag === 0"
            ><a @click="handleEdit(row.id, row)">编辑</a>&nbsp; <a @click="handleDelete(row.id, row)">删除</a>&nbsp;
            <a @click="handleInstore(row.id, row)">入库</a>
          </template>
        </template>
        <!--<template v-slot="{ row }">
          <span v-if="row.status === 0">
            <a @click="handleDetial(row.id, row)">查看</a>&nbsp; <a @click="handleEdit(row.id, row)">编辑</a>&nbsp;
            <a @click="handleDelete(row.id, row)">删除</a>
          </span>
          <span v-if="row.status === 1 || row.status === 2">
            <a @click="handleDetial(row.id, row)">查看</a>
          </span>
          <span v-if="row.status === 3">
            <a @click="handleDetial(row.id, row)">查看</a>&nbsp;
            <a @click="handleEdit(row.id, row)">编辑</a>
          </span>
        </template>-->
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
import Api from '@/api/device/material/instoreOrder'
import baseStatus from '@/lib/basicStatus'
export default {
  name: 'InstoreOrder',
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
        inspectBeginTime: this.form.checkTime[0],
        inspectEndTime: this.form.checkTime[1],
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
      /**
       任务名称：BUG#1373 物资与设备管理-材料管理模块下所有的【重置】按钮，只重置了搜索框，没有重置列表数据
       开发人员：崔洛宜
       日期：2020-03-30
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      this.refresh(true)
    },
    handleAdd() {
      this.$router.push('AddInstoreOrder')
    },
    handleDetial(id, row) {
      this.$router.push({
        name: 'InstoreOrderDetail',
        params: {
          id: id
        }
      })
    },
    handleEdit(id, row) {
      this.$router.push({ name: 'InstoreOrderEdit', params: { id: id, isEdit: true } })
    },
    async handleDelete(id, row) {
      await this.$confirm('此操作将删除该入库单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      await Api.deleteOrder(id)
      this.$message.success('删除成功')
      this.refresh()
    },
    handleInstore(id, row) {
      Api.handleInstore([id]).then(res => {
        if (res.code === 200) {
          this.$message.success('入库成功')
          this.refresh()
        } else {
          this.$message.error('未知错误,请重试')
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
