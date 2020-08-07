<template>
  <div>
    <el-form ref="form" :inline="true" :model="form">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="content">
            <!--
                /**
               任务名称：BUG#1380 物资与设备管理-材料管理-剩余库存-搜索功能没效果
               开发人员：崔洛宜
               日期：2020-03-30
               BUG类型：测试人员发现的研发自测未通过引起的BUG
               **/
            -->
            <!--<el-input
              v-model="form.content"
              placeholder="编码/名称/规格型号/单位/库存数量/平均单价/合价"
              style="width: 340px"
              suffix-icon="el-icon-search"
            />-->
            <el-input
              v-model="form.content"
              placeholder="编码/名称/规格型号/单位"
              style="width: 200px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </li>
      </ul>
    </el-form>
    <vxe-table ref="xTable" border resizable show-overflow :data="tableData" show-footer :footer-method="footerMethod">
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
      <vxe-table-column field="materialName" title="名称"></vxe-table-column>
      <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column field="materialAmount" title="库存数量"></vxe-table-column>
      <vxe-table-column field="unitPrice" title="平均单价(元)"></vxe-table-column>
      <vxe-table-column field="totalPrice" title="合价(元)">
        <template slot-scope="{ row }">
          <span>{{ row.unitPrice && row.materialAmount ? row.unitPrice * row.materialAmount : 0 }}</span>
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
import Api from '@/api/device/material/remnantInventory'
export default {
  name: 'RemnantInventory',
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      form: {
        content: ''
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
        projectId: this.projectId
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
    footerMethod({ columns, data }) {
      let result = [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['totalPrice'].includes(column.property)) {
            return this.XEUtils.sum(data, column.property)
          }
          return null
        })
      ]
      return result
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
