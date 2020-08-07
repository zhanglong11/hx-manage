<!--
* @任务编号: 2824 || 成本核算页面开发
* @开发人员:张龙
* @日期:2020-03-06
* @任务类型:全新代码
-->
<template>
  <el-dialog
    width="1100px"
    :modal="true"
    top="10vh"
    title="劳务合同计量支付明细"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <VXTable ref="table" :max-height="450" :columns="rentColumn" :tableData="rentData" :pageShow="false" />
    <footer v-if="isDetail" slot="footer">
      <el-button @click="$emit('update:visible', false)">确定</el-button>
    </footer>
    <footer v-else slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import api from '@/api/cost/costAccount'
export default {
  name: 'PersonPayDialog',
  props: {
    visible: {},
    payId: {},
    payCode: {},
    payType: {},
    costId: {},
    inventoryId: {},
    curTreeId: {},
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageQuery: {},
      activeName: 'rent',
      rentData: [],
      editIndex: null,
      validRules: {
        name: [{ required: true, message: '必填' }],
        remark: [{ required: true, message: '必填' }]
      },
      paymentStageList: [
        { label: '工程进度款', value: 1 },
        { label: '预付款', value: 2 },
        { label: '最终付款', value: 3 },
        { label: '退还保证金', value: 4 }
      ],
      // 表格表头
      rentColumn: [
        // { type: 'radio', width: 50 },
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'contractCode',
          title: '合同编号',
          minWidth: 140
        },
        {
          field: 'code',
          title: '付款单编号',
          minWidth: 100
        },
        {
          field: 'payer',
          title: '付款方',
          minWidth: 100
        },
        {
          field: 'payee',
          title: '收款方',
          minWidth: 100
        },
        {
          field: 'name',
          title: '付款单名称',
          minWidth: 100
        },
        {
          field: 'paymentStage',
          title: '支付阶段',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(this.paymentStageList, { value: row.paymentStage }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'totalAmount',
          title: '申报金额合计',
          minWidth: 140
        },
        {
          field: 'decomposeAmount',
          title: '已分解金额',
          minWidth: 140
        },
        {
          field: 'number',
          title: '分解金额（元）',
          slots: {
            // default: ({ row, rowIndex }) => [<InputNumber v-model={row.number} />]
            default: ({ row, rowIndex }) => [
              rowIndex === this.editIndex ? <InputNumber v-model={row.number} /> : <span>{row.number}</span>
            ]
          },
          minWidth: 160
        },
        {
          field: 'handle',
          title: '操作',
          width: 160,
          slots: {
            default: ({ row, rowIndex }) => {
              return [
                !this.isDetail ? (
                  rowIndex === this.editIndex ? (
                    <el-button type="text" onClick={() => this.saveRow(row)}>
                      保存
                    </el-button>
                  ) : (
                    <el-button type="text" onClick={() => (this.editIndex = rowIndex)}>
                      编辑
                    </el-button>
                  )
                ) : null
              ]
            }
          }
        }
      ]
    }
  },
  watch: {
    payCode(v) {
      if (v) {
        this.refresh()
      }
    }
  },
  created() {
    if (this.payCode) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await api.personPayList({
        categoryCode: this.payCode,
        costAccountingId: this.costId,
        inventoryCode: this.inventoryId,
        meteringUnitId: this.curTreeId
      })
      this.rentData = res.data
      // let resDepreciation = await api.depreciationList(this.payCode)
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    async saveRow(row) {
      if (!row.number) {
        this.$message.error('请输入本次核算数量')
        return
      }
      const res = await api.saveRow({
        categoryCode: this.payCode,
        costAccountingId: this.costId,
        inventoryCode: this.inventoryId,
        meteringUnitId: this.curTreeId,
        payId: row.id,
        type: 1,
        accountingAmount: row.number
      })
      this.$message.success('操作成功')
      this.editIndex = null
    },
    async submit() {
      if (this.editIndex !== null) {
        this.$message.error('请结束编辑')
        return
      }
      let total = 0
      this.rentData.map(r => {
        total += r.number ? r.number : 0
      })
      let res = await api.saveList({
        id: this.payId,
        categoryCode: this.payCode,
        itemCode: this.inventoryId,
        costId: this.costId,
        meteringUnitId: this.curTreeId,
        realCombinedPrice: total
      })
      await this.$parent.getQuantity()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped></style>
