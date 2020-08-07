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
    <EditTable
      v-model="tableData"
      :tableColumn="tableColumn"
      :validRules="validRules"
      :isAdd="false"
      :isRemove="false"
    />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button @click="$emit('update:visible', false)">上一步</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import api from '@/api/safe/plan/dangerous'
export default {
  name: 'SelectDangerousDialog',
  props: {
    visible: {}
  },
  data() {
    return {
      pageQuery: {},
      request: api.list,
      tableData: [],
      validRules: {
        name: [{ required: true, message: '必填' }],
        remark: [{ required: true, message: '必填' }]
      },
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'dangerSource',
          title: '合同编号',
          minWidth: 100
        },
        {
          field: 'name',
          title: '付款单编号',
          minWidth: 100
        },
        {
          field: 'count',
          title: '付款方',
          minWidth: 100
        },
        {
          field: 'count',
          title: '收款方',
          minWidth: 100
        },
        {
          field: 'precautionaryMeasure',
          title: '付款单名称',
          minWidth: 100
        },
        {
          field: 'principalLeader',
          title: '支付阶段',
          minWidth: 100
        },
        {
          field: 'principal',
          title: '审批金额（元）',
          minWidth: 140
        },
        {
          field: 'principalContact',
          title: '实际支付时间',
          minWidth: 140
        },
        {
          field: 'remark',
          title: '已支付金额（元）',
          minWidth: 160
        }
      ]
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    submit() {
      this.$emit('update:visible', false)
      this.$parent.hidePayDetail()
    }
  }
}
</script>

<style scoped></style>
