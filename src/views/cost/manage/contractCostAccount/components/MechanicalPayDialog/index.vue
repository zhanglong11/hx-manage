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
    :title="payType === 'week' ? '周材租赁/折旧明细' : '设备租赁/折旧明细'"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="物资租赁单" name="rent" lazy>
        <EditTable v-model="rentData" :tableColumn="rentColumn" :isAdd="false" :isRemove="false" />
      </el-tab-pane>
      <el-tab-pane label="物资折旧单" name="depreciation" lazy>
        <EditTable v-model="depreciationData" :tableColumn="depreciationColumn" :isAdd="false" :isRemove="false" />
      </el-tab-pane>
    </el-tabs>
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
  name: 'MechanicalPayDialog',
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
      depreciationData: [],
      rentEditIndex: null,
      depreciationEditIndex: null,
      rentColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'rentSettlementBillCode',
          title: '物资租赁结算单编号',
          minWidth: 140
        },
        {
          field: 'materialCode',
          title: '租赁单编号',
          minWidth: 100
        },
        {
          field: 'contractCode',
          title: '合同编号',
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
          field: 'rentAmount',
          title: '数量',
          minWidth: 100
        },
        {
          field: 'startTime',
          title: '结算开始时间',
          minWidth: 100
        },
        {
          field: 'endTime',
          title: '结算结束时间',
          minWidth: 100
        },
        {
          field: 'rentDay',
          title: '结算时间（天）',
          minWidth: 140
        },
        {
          field: 'currentSettledAmount',
          title: '租金（元）',
          minWidth: 100
        },
        {
          field: 'remainingAmount',
          title: '分解剩余租金',
          minWidth: 100
        },
        {
          field: 'decomposeAmount',
          minWidth: 140,
          title: '分解租金（元）',
          slots: {
            default: ({ row, rowIndex }) => [
              rowIndex === this.rentEditIndex ? (
                <InputNumber v-model={row.decomposeAmount} />
              ) : (
                <span>{row.decomposeAmount}</span>
              )
            ]
          }
        },
        {
          field: 'handle',
          title: '操作',
          width: 160,
          slots: {
            default: ({ row, rowIndex }) => {
              return [
                !this.isDetail ? (
                  rowIndex === this.rentEditIndex ? (
                    <el-button type="text" onClick={() => this.saveRow(row, true)}>
                      保存
                    </el-button>
                  ) : (
                    <el-button type="text" onClick={() => (this.rentEditIndex = rowIndex)}>
                      编辑
                    </el-button>
                  )
                ) : null
              ]
            }
          }
        }
      ],
      depreciationColumn: [
        { type: 'seq', title: '序号', width: 80 },
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
          title: '规格型号',
          minWidth: 100
        },
        {
          field: 'unit',
          title: '计量单位',
          minWidth: 100
        },
        {
          field: 'amount',
          title: '数量',
          minWidth: 100
        },
        {
          field: 'depreciationYear',
          title: '折旧年度',
          minWidth: 140
        },
        {
          field: 'depreciationMonth',
          title: '折旧月度',
          minWidth: 100
        },
        {
          field: 'monthDepreciation',
          title: '月折旧额（元）',
          minWidth: 140
        },
        {
          field: 'remainingAmount',
          title: '分解剩余折旧额',
          minWidth: 140
        },
        {
          field: 'decomposeAmount',
          minWidth: 140,
          title: '分解折旧额（元）',
          slots: {
            default: ({ row, rowIndex }) => [
              rowIndex === this.depreciationEditIndex ? (
                <InputNumber v-model={row.decomposeAmount} />
              ) : (
                <span>{row.decomposeAmount}</span>
              )
            ]
          }
        },
        {
          field: 'handle',
          title: '操作',
          width: 160,
          slots: {
            default: ({ row, rowIndex }) => {
              return [
                rowIndex === this.depreciationEditIndex ? (
                  <el-button type="text" onClick={() => this.saveRow(row, null)}>
                    保存
                  </el-button>
                ) : (
                  <el-button type="text" onClick={() => (this.depreciationEditIndex = rowIndex)}>
                    编辑
                  </el-button>
                )
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
      console.log(this.payType)
    }
  },
  methods: {
    async refresh() {
      let resRent = await api.rentPayList({
        categoryCode: this.payCode,
        costAccountingId: this.costId,
        inventoryCode: this.inventoryId,
        meteringUnitId: this.curTreeId
      })
      let resDepreciation = await api.depreciationPayList({
        categoryCode: this.payCode,
        costAccountingId: this.costId,
        inventoryCode: this.inventoryId,
        meteringUnitId: this.curTreeId
      })
      this.rentData = resRent.data
      this.depreciationData = resDepreciation.data
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    async saveRow(row, isRent) {
      if (!row.decomposeAmount) {
        this.$message.error('数值不能小于0')
        return
      }
      let type = null
      if (this.payType === 'mechanical') {
        type = isRent ? 5 : 6
      } else {
        type = isRent ? 3 : 4
      }
      const res = await api.saveRow({
        categoryCode: this.payCode,
        costAccountingId: this.costId,
        inventoryCode: this.inventoryId,
        meteringUnitId: this.curTreeId,
        payId: row.id,
        type,
        accountingAmount: row.decomposeAmount
      })
      this.$message.success('操作成功')
      this.rentEditIndex = null
      this.depreciationEditIndex = null
    },
    async submit() {
      if (this.rentEditIndex !== null || this.depreciationEditIndex !== null) {
        this.$message.error('请结束编辑')
        return
      }
      let total = 0
      ;[...this.rentData, ...this.depreciationData].map(r => {
        total += r.decomposeAmount
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
