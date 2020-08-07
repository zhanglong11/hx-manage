<template>
  <div class="container">
    <!-- <div v-if="showBtn" style="margin-bottom: 20px"><el-button plain>导入</el-button></div>-->
    <vxe-table
      ref="xTable"
      border
      :data="tableData"
      auto-resize
      :edit-config="$route.query.isEdit ? { trigger: 'manual', mode: 'row', autoClear: false } : null"
      :edit-rules="validRules"
    >
      <!--
          /**
         任务名称：TASK#2831 3月11号注释
         开发人员：崔洛宜
         日期：2020-03-11
         任务类型：注释(修改列字段,添加edit-render)(22)
         **/
      -->
      <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
      <vxe-table-column
        field="quotaCode"
        title="定额编号"
        min-width="120"
        :edit-render="{ name: 'input', attrs: { type: 'text' }, events: { change: changeQuotaCode } }"
      />
      <vxe-table-column
        field="quotaName"
        title="定额名称"
        min-width="120"
        :edit-render="{ name: 'input', attrs: { type: 'text' }, events: { change: changeQuotaName } }"
      />
      <vxe-table-column title="类别" width="80">机</vxe-table-column>
      <vxe-table-column
        field="categoryCode"
        title="类别编码"
        width="150"
        :edit-render="{ name: 'input', attrs: { type: 'text' }, events: { change: changeCategoryCode } }"
      />
      <vxe-table-column
        field="categoryName"
        title="类别名称"
        width="150"
        :edit-render="{ name: 'input', attrs: { type: 'text' }, events: { change: changeCategoryName } }"
      />

      <vxe-table-column
        field="specificationsModels"
        title="规格型号"
        width="120"
        :edit-render="{ name: 'input', attrs: { type: 'text' }, events: { change: changeSpecificationsModels } }"
      />
      <vxe-table-column
        field="unit"
        title="单位"
        width="80"
        :edit-render="{ name: 'input', attrs: { type: 'text' }, events: { change: changeUnit } }"
      />
      <vxe-table-column
        field="budgetQuantity"
        title="数量"
        width="140"
        :edit-render="{ name: '$input', props: { type: 'number' } }"
      />
      <vxe-table-column
        field="budgetUnitPrice"
        title="单价(元)"
        width="140"
        :edit-render="{ name: '$input', props: { type: 'number' } }"
      />
      <vxe-table-column field="budgetCombinedPrice" title="合价(元)" width="120">
        <template v-slot="{ row }">
          <span>{{ (row.budgetUnitPrice * row.budgetQuantity) | toFixed2 }}</span>
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
    <div v-if="showBtn" class="addWrapper" @click="handleAdd"><i class="el-icon-plus"></i>添加</div>
  </div>
</template>
<script>
import Api from '@/api/cost/contractBudget'
import tableValid from '@/utils/tableValidate'
export default {
  name: 'MachineIndex',
  components: {},
  props: {
    showBtn: {
      type: Boolean,
      default: true
    },
    /**
     任务名称：TASK#2831 3月11号注释
     开发人员：崔洛宜
     日期：2020-03-11
     任务类型：注释(修改参数传递)(16)
     **/
    id: {
      type: [Number, String],
      default: ''
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
        budgetQuantity: [{ required: true, message: '数量不能为空' }, { validator: tableValid.validNumberPrice }],
        budgetUnitPrice: [{ required: true, message: '单价不能为空' }, { validator: tableValid.validNumberPrice }],
        categoryCode: [
          { required: true, message: '类别编码不能为空', trigger: 'blur' },
          { validator: tableValid.validateCategoryCode }
        ]
      }
    }
  },
  /**
   任务名称：TASK#2831 3月11号注释
   开发人员：崔洛宜
   日期：2020-03-11
   任务类型：注释(监测listid改变)(5)
   **/
  watch: {
    listId(val) {
      this.refresh()
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
      /**
       任务名称：TASK#2831 3月11号注释
       开发人员：崔洛宜
       日期：2020-03-11
       任务类型：注释(修改获取列表接口)(8)
       **/
      Api.getTabList({
        meteringUnitId: this.meteringUnitId,
        itemCode: this.listId,
        costId: this.costId,
        type: 3
      }).then(res => {
        this.tableData = res.data.records
      })
    },
    /**
     任务名称：TASK#2831 3月11号注释
     开发人员：崔洛宜
     日期：2020-03-11
     任务类型：注释(修改添加列表页,添加列的input方法监测)(27)
     **/
    /*handleAdd() {
     this.$refs.xTable.insertAt([{}], -1)
   },*/
    async handleAdd() {
      let activeRow = await this.$refs.xTable.getActiveRecord()
      if (activeRow) {
        this.$message.error('请先保存数据')
        return
      }
      let record = {}
      let { row: newRow } = await this.$refs.xTable.insertAt(record, -1)
      await this.$refs.xTable.setActiveRow(newRow)
    },
    changeQuotaCode({ row }, e) {
      row.quotaCode = e.target.value
    },
    changeQuotaName({ row }, e) {
      row.quotaName = e.target.value
    },
    changeCategoryName({ row }, e) {
      row.categoryName = e.target.value
    },
    changeCategoryCode({ row }, e) {
      row.categoryCode = e.target.value
    },
    changeSpecificationsModels({ row }, e) {
      row.specificationsModels = e.target.value
    },
    changeUnit({ row }, e) {
      row.unit = e.target.value
    },
    changeNumber({ row }, e) {
      row.budgetQuantity = e.target.value
    },
    changePrice({ row }, e) {
      row.budgetUnitPrice = e.target.value
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    /**
     任务名称：TASK#2831 3月11号注释
     开发人员：崔洛宜
     日期：2020-03-11
     任务类型：注释(修改提交列操作)(23)
     **/
    async saveRowEvent(row) {
      const errMap = await this.$refs.xTable.validate(row).catch(errMap => errMap)
      if (errMap) {
        return false
      }
      if (row.id) {
        Api.updateGlj({
          ...row,
          budgetCombinedPrice: row.budgetQuantity * row.budgetUnitPrice,
          meteringUnitId: this.meteringUnitId,
          itemCode: this.listId,
          costId: this.costId,
          type: 3
        }).then(res => {
          this.$message.success('保存成功')
          this.$refs.xTable.clearActived()
          this.$emit('GLJTabSave')
        })
      } else {
        Api.addGlj({
          ...row,
          budgetCombinedPrice: row.budgetQuantity * row.budgetUnitPrice,
          meteringUnitId: this.meteringUnitId,
          itemCode: this.listId,
          costId: this.costId,
          type: 3
        }).then(res => {
          row.id = res.data
          this.$message.success('保存成功')
          this.$refs.xTable.clearActived()
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
    /**
     任务名称：TASK#2831 3月11号注释
     开发人员：崔洛宜
     日期：2020-03-11
     任务类型：注释(添加删除列操作)(12)
     **/
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
.addWrapper {
  height: 40px;
  line-height: 40px;
  margin: 10px 50px;
  border: 1px #585858 dashed;
  text-align: center;
}
</style>
