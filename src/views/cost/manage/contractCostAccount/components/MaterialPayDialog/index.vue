<!--
* @任务编号: 2824 || 成本核算页面开发
* @开发人员:张龙
* @日期:2020-03-06
* @任务类型:全新代码
-->
<!--
* @任务编号: 2824 || 添加组件开发
* @开发人员:张龙
* @日期:2020-03-10
* @任务类型:全新代码
-->
<template>
  <el-dialog
    width="1100px"
    :modal="true"
    top="10vh"
    title="耗料清点明细"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <EditTable
      v-model="materialData"
      :tableColumn="materialColumn"
      :validRules="validRules"
      :isAdd="false"
      :isRemove="false"
    />
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
  name: 'SelectDangerousDialog',
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
      editIndex: null,
      //耗材数据
      materialData: [],
      validRules: {
        name: [{ required: true, message: '必填' }],
        remark: [{ required: true, message: '必填' }]
      },
      // 表格表头
      materialColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'consumeInventoryCode',
          title: '耗料清单编号',
          minWidth: 100
        },
        {
          field: 'inspectorName',
          title: '清点人',
          minWidth: 100
        },
        {
          field: 'inspectTime',
          title: '清点日期',
          minWidth: 100
        },
        {
          field: 'materialCode',
          title: '编码',
          minWidth: 100
        },
        {
          field: 'materialName',
          title: '名称',
          minWidth: 100
        },
        {
          field: 'specification',
          title: '规格及型号',
          minWidth: 100
        },
        {
          field: 'unit',
          title: '单位',
          minWidth: 100
        },
        {
          field: 'unitPrice',
          title: '实际单价（元）',
          minWidth: 140
        },
        {
          field: 'startTime',
          title: '合价（元）',
          minWidth: 100
        },
        {
          field: 'consumePosition',
          title: '使用部位',
          minWidth: 100
        },
        {
          field: 'consumeAmount',
          title: '本期次耗料数量',
          minWidth: 120
        },
        {
          field: 'remainingAmount',
          title: '分解剩余量',
          minWidth: 100
        },
        {
          field: 'decomposeAmount',
          title: '分解量',
          slots: {
            default: ({ row, rowIndex }) => [
              rowIndex === this.editIndex ? (
                // <InputNumber v-model={row.decomposeAmount} />
                <el-input-number v-model={row.decomposeAmount} controls={false} max={row.remainingAmount || 0} />
              ) : (
                <span>{row.decomposeAmount}</span>
              )
            ]
          },
          minWidth: 100
        },
        {
          field: 'remainingAmount',
          title: '分解合价（元）',
          slots: {
            default: ({ row }) => [
              <span>{isNaN(row.unitPrice * row.decomposeAmount) ? 0 : row.unitPrice * row.decomposeAmount}</span>
            ]
          },
          minWidth: 140
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
                    <el-button type="text" onClick={() => this.saveRow(row, true)}>
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
    },
    payType(v) {
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
      let res = await api.materialPayList({
        categoryCode: this.payCode,
        costAccountingId: this.costId,
        inventoryCode: this.inventoryId,
        meteringUnitId: this.curTreeId
      })
      this.materialData = res.data
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    async saveRow(row) {
      if (!row.decomposeAmount) {
        this.$message.error('分解量不能小于0')
        return
      }
      const res = await api.saveRow({
        categoryCode: this.payCode,
        costAccountingId: this.costId,
        inventoryCode: this.inventoryId,
        meteringUnitId: this.curTreeId,
        payId: row.id,
        type: 2,
        accountingAmount: row.decomposeAmount
      })
      this.editIndex = null
      this.$message.success('操作成功')
    },
    async submit() {
      if (this.editIndex !== null) {
        this.$message.error('请结束编辑')
        return
      }
      let total = 0
      this.materialData.map(r => {
        total += r.decomposeAmount ? r.decomposeAmount : 0
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
