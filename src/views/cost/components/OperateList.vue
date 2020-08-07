<template>
  <el-card shadow="never" style="margin-top: 20px;">
    <div slot="header" class="clearfix">
      <span>操作记录</span>
      <el-button type="text" style="float: right; padding: 3px 0;"></el-button>
    </div>
    <div>
      <vxe-table ref="xTable" border :data="tableData">
        <vxe-table-column type="seq" width="60"></vxe-table-column>
        <vxe-table-column field="operator" title="操作人" />
        <vxe-table-column field="operateTime" title="操作时间" />
        <vxe-table-column field="type" title="操作类型" />
        <vxe-table-column field="detail" title="操作内容" />
        <vxe-table-column field="file" title="附件"
          ><template slot-scope="{ row }">
            <a
              @click="
                () => {
                  row
                }
              "
              >附件</a
            >
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
  </el-card>
</template>
<script>
export default {
  name: 'OperateList',
  components: {},
  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return { tableData: [], total: 50, pageSize: 10, currentPage: 1 }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.tableData = [
        { operator: '张三', operateTime: '2020-02-04 10:00:00', type: '删除', detail: '删除无用' },
        { operator: '张三', operateTime: '2020-02-04 10:00:00', type: '删除', detail: '删除无用' },
        { operator: '张三', operateTime: '2020-02-04 10:00:00', type: '删除', detail: '删除无用' }
      ]
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh(true)
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh(true)
    }
  }
}
</script>
<style lang="less" scoped></style>
