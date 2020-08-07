<template>
  <el-dialog title="1#楼1单元1层01" :visible="visible" width="500px" top="10vh" @close="cancelDialog">
    <vxe-table
      ref="xTable"
      :data="tableData"
      border
      height="400"
      :cell-class-name="cellClassName"
      :show-header="false"
      @cell-click="cellClickEvent"
    >
      <vxe-table-column field="name" title="名字"></vxe-table-column>
      <vxe-table-column field="status" title="状态" width="80"></vxe-table-column>
    </vxe-table>
  </el-dialog>
</template>

<script>
export default {
  name: 'ProcedureDialog',
  props: {
    visible: {}
  },

  data() {
    return {
      filterForm: {},
      tableData: [
        {
          name: '工序名称1',
          status: 1
        },
        {
          name: '工序名称1',
          status: 2
        },
        {
          name: '工序名称1',
          status: 1
        },
        {
          name: '工序名称1',
          status: 2
        },
        {
          name: '工序名称1',
          status: 1
        }
      ]
    }
  },
  created() {},
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
      // this.$emit('close')
    },
    cellClassName({ row, rowIndex, column, columnIndex }) {
      if (column.property === 'status') {
        if (row.status === 1) {
          return 'col-red'
        } else if (row.status === 2) {
          return 'col-orange'
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .vxe-table .vxe-body--column.col-red {
  background-color: #2597e2;
  color: #fff;
}
/deep/ .vxe-table .vxe-body--column.col-orange {
  background-color: #25af71;
  color: #fff;
}
</style>
