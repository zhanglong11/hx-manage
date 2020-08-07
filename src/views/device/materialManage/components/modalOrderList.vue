<!--
@任务名称：1256/新建采购单的问题
@开发人员：崔洛宜
@日期：2020-03-23
@BUG类型：自测bug(新建页面)

@bug名称: 1020/过磅单调整
@开发人员: 董渊海
@修改日期: 2020-03-24
@任务类型: 修改代码，选择采购明细模态框功能框调整，修改比例(50%)

@bug名称: 1020/过磅单调整
@开发人员: 董渊海
@修改日期: 2020-03-24
@任务类型: 修改代码，当前选择记录与明细表记录重复校验，修改比例(20%)
-->
<template>
  <el-dialog
    width="1080px"
    title="采购明细"
    :visible="visible"
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
      :loading="loading"
      @radio-change="radioChangeEvent"
    >
      <vxe-table-column type="radio" width="50"></vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
      <vxe-table-column field="materialName" title="名称"></vxe-table-column>
      <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column field="dispatchAmount" title="采购数量"></vxe-table-column>
      <vxe-table-column field="unitPrice" title="合同单价(元)"></vxe-table-column>
      <vxe-table-column field="totalPrice" title="合价"></vxe-table-column>
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
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <!--<vxe-table-column field="supplierName" title="供应商名称"></vxe-table-column>-->
    </vxe-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="onOk">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/api/device/material/weighOrder'
export default {
  name: 'ModalOrderList',
  props: {
    visible: Boolean,
    purchaseId: {
      type: [Number, String],
      default: ''
    },
    validList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      selectRow: null,
      tableData: [],
      loading: false
    }
  },
  created() {
    this.loading = true
    Api.getPurchaseOrderById(this.purchaseId).then(res => {
      if (res.code === 200) {
        this.loading = false
        this.tableData = res.data.list
        this.tableData.map(item => {
          item.supplierName = res.data.supplierName
        })
      }
    })
  },
  methods: {
    radioChangeEvent({ row }) {
      this.selectRow = row
    },
    onOk() {
      if (this.selectRow) {
        /**
        任务名称：2697/过磅单修改
        开发人员：崔洛宜
        日期：2020-03-24
       任务类型：修改逻辑结构
      **/
        /*let flag = false
        //console.log(this.validList)
        for (let i = 0; i < this.validList.length; i++) {
          if (this.validList[i].purchaseDetailId === this.selectRow.id) {
            flag = true
            break
          }
        }*/
        // if (flag) {
        //   this.$message.error('当前选择记录与明细表记录重复')
        // } else {
        this.$emit('update:visible', false)
        this.$emit('disposeSelectRow', this.selectRow)
        //
      } else {
        this.$message.error('请选择一条记录，再做该操作')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
