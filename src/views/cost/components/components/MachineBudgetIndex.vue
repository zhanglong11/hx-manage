<template>
  <div class="container">
    <vxe-table
      ref="xTable"
      border
      :data="tableData"
      auto-resize
      :edit-config="$route.query.isEdit ? { trigger: 'manual', mode: 'row', autoClear: false } : null"
      :edit-rules="validRules"
    >
      <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
      <vxe-table-column field="quotaCode" title="定额编号" width="120" />
      <vxe-table-column field="quotaName" title="定额名称" width="120" />
      <vxe-table-column title="类别" width="80">机</vxe-table-column>
      <vxe-table-column field="categoryCode" title="类别编码" width="120" />
      <vxe-table-column field="categoryName" title="类别名称" width="120" />
      <vxe-table-column field="specificationsModels" title="规格型号" width="120" />
      <vxe-table-column field="unit" title="单位" width="80" />
      <vxe-table-column field="budgetQuantity" title="数量" width="80" />
      <vxe-table-column
        field="budgetUnitPrice"
        title="单价(元)"
        width="100"
        :formatter="({ cellValue }) => toFixed2(cellValue)"
      />
      <vxe-table-column
        field="budgetCombinedPrice"
        title="合价(元)"
        width="100"
        :formatter="({ cellValue }) => toFixed2(cellValue)"
      >
      </vxe-table-column>
      <vxe-table-column
        field="calculateQuanlity"
        title="测算数量"
        width="120"
        :edit-render="{
          name: '$input',
          props: { type: 'number' }
        }"
      />
      <vxe-table-column
        field="calculateUnitPrice"
        title="测算单价(元)"
        width="150"
        :edit-render="{ name: '$input', props: { type: 'number' } }"
      />
      <vxe-table-column field="calculateCombinedPrice" title="测算合价(元)" width="100">
        <template v-slot="{ row }">
          <span>{{ (row.calculateUnitPrice * row.calculateQuanlity) | toFixed2 }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column v-if="showBtn" title="操作" width="150px">
        <template v-slot="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
            <vxe-button @click="handleDelete(row)">删除</vxe-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>
<script>
import Api from '@/api/cost/contractTargetCostBudget'
import tableValid from '@/utils/tableValidate'
export default {
  name: 'MachineBudgetIndex',
  components: {},
  props: {
    showSelect: {
      type: Boolean,
      default: false
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    showChangedColumn: {
      type: Boolean,
      default: false
    },
    listId: {
      type: [Number, String],
      default: ''
    },
    meteringUnitId: {
      type: [Number, String],
      default: ''
    },
    costId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      validRules: {
        calculateQuanlity: [{ required: true, message: '数量不能为空' }, { validator: tableValid.validNumberPrice }],
        calculateUnitPrice: [{ required: true, message: '单价不能为空' }, { validator: tableValid.validNumberPrice }],
        categoryCode: [
          { required: true, message: '类别编码不能为空', trigger: 'blur' },
          { validator: tableValid.validateCategoryCode }
        ]
      }
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    refresh(isFirstPage = true) {
      this.total = 50
      if (isFirstPage) {
        this.currentPage = 1
      }
      Api.getTabList({
        meteringUnitId: this.meteringUnitId,
        itemCode: this.listId,
        costId: this.costId,
        type: 3
      }).then(res => {
        this.tableData = res.data.records
      })
    },
    handleAdd() {
      this.$refs.xTable.insertAt([{}], -1)
    },
    changeNumber({ row }, e) {
      row.calculateQuanlity = e.target.value
    },
    changePrice({ row }, e) {
      row.calculateUnitPrice = e.target.value
    },
    inputNumber({ row }, e) {
      row.calculateQuanlity = e.target.value
    },
    inputPrice({ row }, e) {
      row.calculateUnitPrice = e.target.value
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    async saveRowEvent(row) {
      const errMap = await this.$refs.xTable.validate(row).catch(errMap => errMap)
      if (errMap) {
        return false
      }
      if (row.id) {
        Api.updateGlj({
          ...row,
          calculateCombinedPrice: row.calculateQuanlity * row.calculateUnitPrice,
          meteringUnitId: this.meteringUnitId,
          itemCode: this.listId,
          costId: this.costId,
          type: 3
        }).then(res => {
          this.$refs.xTable.clearActived()
          this.$message.success('保存成功')
          this.$emit('GLJTabSave')
        })
      } else {
        Api.addGlj({
          ...row,
          calculateCombinedPrice: row.calculateQuanlity * row.calculateUnitPrice,
          meteringUnitId: this.meteringUnitId,
          itemCode: this.listId,
          costId: this.costId,
          type: 3
        }).then(res => {
          row.id = res.data
          this.$refs.xTable.clearActived()
          this.$message.success('保存成功')
          this.$emit('GLJTabSave')
        })
      }
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    handleDelete(row) {
      if (row.id) {
        Api.deleteGLJById(row.id).then(res => {
          if (res.code === 200) {
            this.tableData = this.tableData.filter(item => item._XID !== row._XID)
            this.$message.success('删除成功')
            this.$emit('GLJTabSave')
          }
        })
      } else {
        this.tableData = this.tableData.filter(item => item._XID !== row._XID)
        this.$message.success('删除成功')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  padding: 5px;
}
</style>
