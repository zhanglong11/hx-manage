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
    <el-form ref="form" :model="form" :inline="true">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="content">
            <el-input
              v-model="form.content"
              placeholder="编码 /名称 / 规格型号 /单位 / 库存数量 / 库存数量 / 平均单价 / 合价"
              style="width: 418px;"
            />
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" @click="() => {}">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </li>
      </ul>
    </el-form>

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
      <vxe-table-column field="count" title="库存数量"></vxe-table-column>
      <vxe-table-column field="price" title="平均单价(元)"></vxe-table-column>
      <vxe-table-column field="totalPrice" title="合价(元)"></vxe-table-column>
    </vxe-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="onOk">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ModalPurchaseOrder',
  props: {
    visible: Boolean
  },
  data() {
    return {
      form: {
        content: ''
      },
      selectRows: [],
      tableData: [
        {
          id: 1,
          code: '01011234',
          name: '螺纹钢筋',
          modelNumber: 'φ16',
          unit: 'kg',
          count: 3000,
          price: 4.5,
          totalPrice: 13500
        },
        {
          id: 1,
          code: '01011235',
          name: '螺纹钢筋',
          modelNumber: 'φ12',
          unit: 'kg',
          count: 3000,
          price: 4.5,
          totalPrice: 13500
        }
      ]
    }
  },
  methods: {
    resetForm() {
      this.$refs['form'].resetFields()
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
    },
    onOk() {
      if (this.selectRows.length) {
        this.$emit('update:visible', false)
        this.$emit('disposeSelectRow', this.selectRows)
      } else {
        this.$message.error('请选择一条记录，再做该操作')
      }
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
