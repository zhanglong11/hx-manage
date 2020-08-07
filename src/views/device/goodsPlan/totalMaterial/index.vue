<template>
  <div>
    <div class="head">
      <span>总物资计划</span>
    </div>

    <vxe-table
      ref="xTable"
      border
      resizable
      show-overflow
      keep-source
      :data="tableData"
      :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
      :loading="loading"
    >
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
      <vxe-table-column field="materialName" title="名称"></vxe-table-column>
      <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column field="contractAmount" title="中标数量"></vxe-table-column
      ><!--bug号：1252、修改人：董渊海、修改时间：2020-03-23-->
      <vxe-table-column field="budgetAmount" title="预算数量"></vxe-table-column>
      <vxe-table-column field="calculateAmount" title="测算数量"></vxe-table-column>
      <vxe-table-column field="materialType" title="类别">
        <template v-slot="{ row }">
          <span v-if="row.materialType === 1">材料</span>
          <span v-else-if="row.materialType === 2">机械</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="materialKind" title="物资种类">
        <template v-slot="{ row }">
          <span v-if="row.materialKind === 1">耗材</span>
          <span v-else-if="row.materialKind === 2">周材</span>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="materialSource"
        title="物资来源"
        :edit-render="{ name: 'select', options: sourceList, events: { change: sourceChangeEvent } }"
      ></vxe-table-column>
      <vxe-table-column
        field="remark"
        title="备注"
        :edit-render="{ name: 'textarea', attrs: { type: 'text' } }"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="120">
        <template v-slot="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <a @click="saveRowEvent(row)">保存</a>
            <a @click="cancelRowEvent(row)">取消</a>
          </template>
          <template v-else>
            <a @click="editRowEvent(row)">编辑</a>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import Api from '@/api/device/goodsPlan/totalMaterial'
export default {
  name: 'TotalMaterial',
  //components: { },
  data() {
    return {
      sourceList: [
        { label: '未指定', value: '0' }, //bug号：1619、修改人：董渊海、修改日期：2020-04-15
        { label: '采购', value: '1' },
        { label: '租赁', value: '2' },
        { label: '采购+租赁', value: '3' },
        { label: '甲供', value: '4' }
      ],
      tableData: [],
      loading: true
    }
  },
  watch: {
    '$store.getters.companyId': function () {
      this.refresh()
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
      let companyId = this.$store.getters.companyId
      if (companyId) {
        this.loading = true
        Api.getTotalMaterialList({
          projectId: localStorage.getItem('projectId'),
          companyId,
          page: 1,
          rows: 10000
        }).then(res => {
          //console.log(res)
          this.tableData = res.data.records
          this.loading = false
        })
      }
    },
    saveRowEvent(row) {
      //console.log(row)
      let id = row.id
      let materialSource = row.materialSource
      let remark = row.remark
      Api.totalMaterialUpdate({
        id,
        materialSource,
        remark
      }).then(res => {
        this.$message.success('编辑成功')
        this.$refs.xTable.clearActived().then(() => {})
      })
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    sourceChangeEvent({ row }, e) {
      row.materialSource = e.target.value
    }
  }
}
</script>

<style scoped lang="less">
.head {
  text-align: center;
  padding-bottom: 10px;
}
</style>
