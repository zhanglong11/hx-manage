<template>
  <span>
    <span @click="visible = !!contractId">
      <slot></slot>
    </span>
    <el-dialog :visible.sync="visible" width="800px" destroy-on-close>
      <div class="tooltips">
        <el-input
          v-model="filterForm.keyword"
          style="margin: 10px 0; width: 300px;"
          placeholder="名称/规格型号/单位/数量"
          suffix-icon="el-icon-search"
        ></el-input>
      </div>
      <Grid
        ref="table"
        :filterForm.sync="filterForm"
        :request="request"
        auto-search
        :immediate="false"
        @checkboxChange="selection => (selectedRows = selection)"
      >
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column field="serialNumber" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="itemName" title="名称"></vxe-table-column>
        <vxe-table-column field="model" title="型号"></vxe-table-column>
        <vxe-table-column field="specifications" title="规格"></vxe-table-column>
        <vxe-table-column field="unit" title="单位"></vxe-table-column>
        <vxe-table-column field="quantity" title="数量"></vxe-table-column>
      </Grid>
      <footer slot="footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </footer>
    </el-dialog>
  </span>
</template>

<script>
export default {
  name: 'SelectContractInventory',
  props: {
    contractId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      filterForm: {},
      selectedRows: [],
      request: body => {
        body.contractId = this.contractId
        return this.axios.construction.post('materialSupplyPlan/inventoryList', body)
      }
    }
  },
  watch: {
    async visible(val) {
      await this.$nextTick()
      if (val) {
        this.$refs.table.refresh()
      }
    }
  },
  methods: {
    submit() {
      this.$emit('change', this.selectedRows)
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
