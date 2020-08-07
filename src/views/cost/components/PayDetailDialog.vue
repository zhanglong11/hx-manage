<template>
  <el-dialog title="材料成本核算" :visible="visible" width="1400px" top="10px" @close="$emit('close')">
    <div class="contentWrapper">
      <div class="tableWrapper">
        <vxe-table
          ref="xTable"
          border
          :data="tableData"
          :edit-config="{ trigger: 'manual', mode: 'row' }"
          @radio-change="radioChangeEvent"
        >
          <vxe-table-column type="radio" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="period" title="计量期次" />
          <vxe-table-column field="code" title="项目编号" />
          <vxe-table-column field="name" title="项目名称" />
          <vxe-table-column field="specification" title="规格型号" />
          <vxe-table-column field="unit" title="计量单位" />
          <vxe-table-column field="thisTimeNumber" title="本期完成量" />
          <vxe-table-column field="realPrice" title="实际单价(元)" />
          <vxe-table-column field="totalPrice" title="合价(元)" />
          <vxe-table-column field="disintegrateRemainNumber" title="分解剩余量" />
          <vxe-table-column
            field="disintegrateNumber"
            title="分解量"
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
          />
          <vxe-table-column field="disintegrateTotalPrice" title="分解合价(元)" />
          <vxe-table-column title="操作" width="150px">
            <template v-slot="{ row }">
              <template v-if="$refs.xTable.isActiveByRow(row)">
                <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
                <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
              </template>
              <template v-else>
                <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
                <vxe-button @click="handleDelete">删除</vxe-button>
              </template>
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
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'PayDetailDialog',
  props: ['visible'],
  data() {
    return {
      selectRow: null,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    refresh(isFirstPage) {
      this.total = 50
      if (isFirstPage) {
        this.currentPage = 1
      }
      this.tableData = [
        {
          id: 1,
          period: '20200202001',
          code: 'XY0001',
          name: '10月需用计划',
          specification: 'c30',
          unit: 'kg',
          thisTimeNumber: 100,
          realPrice: 1000,
          totalPrice: 100000,
          disintegrateRemainNumber: 300,
          disintegrateNumber: 200,
          disintegrateTotalPrice: 200000
        }
      ]
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    saveRowEvent(row) {
      console.log(row)
      this.$refs.xTable.clearActived().then(() => {
        this.$message.success('保存成功')
        this.tableData = [{ id: 1, name: 1, type: 1, fileName: '分部分项工程和单价措施项目清单与计价表.xlsx' }]
      })
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    handleDelete() {
      this.$message.success('删除成功')
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh(true)
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh(true)
    },
    radioChangeEvent({ row }) {
      this.selectRow = row
    },
    handleSubmit() {
      if (this.selectRow) {
        this.$emit('submit', this.selectRow)
      } else {
        this.$message.error('请选择一列')
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
