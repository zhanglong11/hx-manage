<template>
  <el-dialog
    width="1080px"
    :title="'请选择'"
    :visible="visible"
    @open="handleOpen"
    @close="
      () => {
        $emit('update:visible', false)
      }
    "
  >
    <vxe-table
      ref="xTable"
      border
      resizable
      show-overflow
      :data="tableData"
      @checkbox-all="selectAllEvent"
      @checkbox-change="selectChangeEvent"
    >
      <vxe-table-column type="checkbox" width="50"></vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="code" title="编码"></vxe-table-column>
      <vxe-table-column field="name" title="名称"></vxe-table-column>
      <vxe-table-column field="modelNumber" title="规格型号"></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column field="count" title="数量"></vxe-table-column>
      <vxe-table-column field="price" title="采购单价(元)"></vxe-table-column>
      <vxe-table-column field="totalPrice" title="合价"></vxe-table-column>
      <vxe-table-column field="type" title="类别"></vxe-table-column>
      <vxe-table-column field="kind" title="物资种类"></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
    </vxe-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="onOk">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ModalPurchaseDetail',
  props: {
    visible: Boolean
  },
  data() {
    return {
      selectRows: [],
      tableData: [
        {
          id: 1,
          code: '01011234',
          name: '螺纹钢筋',
          modelNumber: 'φ16',
          unit: 'kg',
          count: '3000',
          price: 4.5,
          totalPrice: 13500.0,
          type: '材',
          kind: '耗材',
          remark: ''
        },
        {
          id: 2,
          code: '80010747',
          name: '预拌地面砂浆（干拌）',
          modelNumber: 'DS M15',
          unit: 'm3',
          count: '600',
          price: 220,
          totalPrice: 1132000.0,
          type: '材',
          kind: '耗材',
          remark: ''
        }
      ]
    }
  },
  methods: {
    onOk() {
      if (this.selectRows.length) {
        this.$emit('update:visible', false)
        this.$emit('disposeSelectRow', this.selectRows)
      } else {
        this.$message.error('请选择一条记录，再做该操作')
      }
    },
    selectAllEvent({ checked }) {
      this.selectRows = this.$refs.xTable.getCheckboxRecords()
    },
    selectChangeEvent({ checked, row }) {
      this.selectRows = this.$refs.xTable.getCheckboxRecords()
    },
    handleOpen() {
      this.selectRows = []
      if (this.$refs.xTable) {
        this.$refs.xTable.clearCheckboxRow()
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
