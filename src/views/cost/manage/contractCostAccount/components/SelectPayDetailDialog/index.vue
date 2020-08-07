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
    :title="payType === 'material' ? '耗料清点明细' : '设备租赁/折旧明细'"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <EditTable
      v-if="payType === 'material'"
      v-model="materialData"
      :tableColumn="materialColumn"
      :validRules="validRules"
      :isAdd="false"
      :isRemove="false"
    />
    <el-tabs v-else v-model="activeName">
      <el-tab-pane label="物资租赁单" name="rent" lazy>
        <EditTable
          v-model="rentData"
          :tableColumn="rentColumn"
          :validRules="validRules"
          :isAdd="false"
          :isRemove="false"
        />
      </el-tab-pane>
      <el-tab-pane label="物资折旧单" name="depreciation" lazy>
        <EditTable
          v-model="depreciationData"
          :tableColumn="depreciationColumn"
          :validRules="validRules"
          :isAdd="false"
          :isRemove="false"
        />
      </el-tab-pane>
    </el-tabs>
    <footer slot="footer">
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
    curTreeId: {}
  },
  data() {
    return {
      pageQuery: {},
      activeName: 'rent',
      //耗材数据
      materialData: [],
      rentData: [],
      depreciationData: [],
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
          field: 'number',
          title: '分解量',
          slots: {
            default: ({ row }) => [<InputNumber v-model={row.number} />]
          },
          minWidth: 100
        },
        {
          field: 'remainingAmount',
          title: '分解合价（元）',
          slots: {
            default: ({ row }) => [<span>{isNaN(row.unitPrice * row.number) ? 0 : row.unitPrice * row.number}</span>]
          },
          minWidth: 140
        }
      ],
      rentColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'rentSettlementBillCode',
          title: '物资租赁结算单编号',
          minWidth: 140
        },
        //无数据
        {
          field: 'materialCode',
          title: '租赁单编号',
          minWidth: 100
        },
        //无数据
        {
          field: 'count',
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
        //无数据
        {
          field: 'remark',
          title: '类别',
          minWidth: 100
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
          field: 'remark',
          fixed: 'right',
          minWidth: 140,
          title: '分解租金（元）',
          slots: {
            default: ({ row }) => [<InputNumber v-model={row.number} />]
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
          field: 'contractAmount',
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
          field: 'currentDepreciationAmount',
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
          fixed: 'right',
          minWidth: 140,
          title: '分解折旧额（元）',
          slots: {
            default: ({ row }) => [<InputNumber v-model={row.decomposeAmount} />]
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
      let resRent = await api.rentList({
        categoryCode: this.payCode,
        costAccountingId: this.costId,
        inventoryCode: this.inventoryId,
        meteringUnitId: this.curTreeId
      })
      let resDepreciation = await api.depreciationList({
        categoryCode: this.payCode,
        costAccountingId: this.costId,
        inventoryCode: this.inventoryId,
        meteringUnitId: this.curTreeId
      })
      // this.rentData = resRent.data
      // this.depreciationData = resDepreciation.data
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    async submit() {
      if (this.payType === 'material') {
        let total = 0
        let number = 0
        this.materialData.map(r => {
          number += r.number
          total += r.number * r.unitPrice
        })
        let res = await api.saveList({
          id: this.payId,
          realQuanlity: number,
          realCombinedPrice: total,
          realUnitPrice: total / number
        })
      } else {
        let rentTotal = 0
        let depreciationTotal = 0
        this.rentData.map(r => {
          rentTotal += r.number
        })
        this.depreciationData.map(r => {
          depreciationTotal += r.number
        })
      }
      await this.$parent.getQuantity()
      this.$emit('update:visible', false)

      // this.$parent.showStep()
      // this.$parent.$emit('update:payStepVisible', true)
      // this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped></style>
