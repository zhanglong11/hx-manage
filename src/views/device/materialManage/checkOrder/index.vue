<template>
  <div>
    <el-form ref="form" :inline="true" :model="form">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="content">
            <el-input
              v-model="form.content"
              placeholder="原材料检验记录编号/原材料检验计划编号/检验内容/检验机构/检验结果/创建人"
              style="width: 500px;"
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
              style="width: 350px;"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="检验日期" prop="checkTime">
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
      <vxe-table-column field="inspectRecordCode" title="检验单编号"></vxe-table-column>
      <vxe-table-column field="materialName" title="材料名称"></vxe-table-column>
      <vxe-table-column field="inspectContent" title="检验内容"></vxe-table-column>
      <vxe-table-column field="inspectOrgan" title="检验机构"></vxe-table-column>
      <vxe-table-column field="inspectTime" title="检验时间"></vxe-table-column>
      <vxe-table-column field="inspectResult" title="检验结果">
        <template slot-scope="{ row }">
          {{ !!row.inspectResult ? '不合格' : '合格' }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>

      <vxe-table-column title="操作" width="130">
        <template v-slot="{ row }">
          <a @click="handleDetial(row.id, row)">查看</a>
          <a @click="handleEdit(row.id, row)">编辑</a>
          <a @click="handleDelete(row.id, row)">删除</a>
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
import Api from '@/api/device/material/checkOrder'
export default {
  name: 'CheckOrder',
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      form: {
        content: '',
        checkTime: [],
        createTime: []
      },
      tableData: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0
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
      this.$router.push('AddCheckOrder')
    },
    handleDetial(id, row) {
      this.$router.push({
        name: 'CheckOrderDetail',
        params: {
          id: id
        }
      })
    },
    handleEdit(id, row) {
      this.$router.push({ name: 'CheckOrderEdit', params: { id: id, isEdit: true } })
    },
    async handleDelete(id, row) {
      await this.$confirm('此操作将删除该原材料检验单, 是否继续?', '提示', {
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
