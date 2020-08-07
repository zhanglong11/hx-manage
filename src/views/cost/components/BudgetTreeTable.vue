<template>
  <div class="right-panel">
    <div class="detail-a">
      <vxe-table
        ref="xTable"
        border
        resizable
        keep-source
        show-overflow
        :data="tableData"
        :tree-config="{ children: 'children', expandAll: true }"
        :edit-config="{ trigger: 'manual', mode: 'row', autoClear: true }"
        auto-resize
      >
        <vxe-table-column field="serial" tree-node title="序号"></vxe-table-column>
        <!-- <vxe-table-column field="code" title="项目编号"></vxe-table-column>-->
        <vxe-table-column field="name" title="项目名称"></vxe-table-column>
        <vxe-table-column field="unit" title="单位"></vxe-table-column>
        <vxe-table-column field="fullMoney" title="上次测算金额(元)"></vxe-table-column>
        <vxe-table-column
          field="money"
          title="本次测算金额(元)"
          :edit-render="{ name: 'input', attrs: { type: 'number' }, events: { change: changeMoney } }"
        ></vxe-table-column>
        <vxe-table-column
          field="remark"
          title="备注"
          :edit-render="{ name: 'input', attrs: { type: 'text' }, events: { change: changeRemark } }"
        ></vxe-table-column>
        <vxe-table-column v-if="isEdit" title="操作" width="120">
          <template v-slot="{ row }">
            <template v-if="!row.children">
              <template v-if="$refs.xTable.isActiveByRow(row)">
                <a @click="saveRowEvent(row)">保存</a>
              </template>
              <template v-else>
                <a @click="editRowEvent(row)">编辑</a>
              </template>
            </template>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
    <!-- <div class="detail-c">
      <el-button @click="handleBack">返回列表</el-button>
      <el-button @click="handleSave">保存</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>-->
  </div>
</template>

<script>
import Api from '@/api/cost/contractTargetCostBudget'
import projectFundList from '@/lib/projectFundList'
import _ from 'lodash'
export default {
  name: 'BudgetTreeTable',
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tableData: [],
      leafNodes: [],
      calculateId: ''
    }
  },
  mounted() {
    this.tableData = _.cloneDeep(projectFundList)
    this.initTableData(this.tableData)

    //预算项目明细信息回显
    this.calculateId = this.$route.query.id || this.$route.params.id
    if (this.calculateId) {
      Api.getCostExpenditureDetailByCalculateId(this.calculateId).then(res => {
        //console.log(res)
        let data = res.data
        if (data && data.length) {
          for (let i = 0; i < data.length; i++) {
            let node = this.getNodeInfo(data[i].itemCode, this.tableData)
            node.fullMoney = data[i].lastMoney
            node.fullMoney = data[i].lastMoney
            node.money = data[i].currentMoney
            node.remark = data[i].currentRemark
          }
        }
      })
    } else {
      Api.getNewCostExpenditureDetailByCalculateId().then(res => {
        //console.log(res)
        let data = res.data
        if (data && data.length) {
          this.costId = data[0].costId
          for (let i = 0; i < data.length; i++) {
            let node = this.getNodeInfo(data[i].itemCode, this.tableData)
            node.fullMoney = data[i].lastMoney
            node.fullMoney = data[i].lastMoney
            node.money = data[i].currentMoney
            node.remark = data[i].currentRemark
          }
        }
      })
    }
    //获取上次测算金额
    /* Api.getNewCostExpenditureDetailByCalculateId().then(res => {
      //console.log(res)
      let data = res.data
      if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
          let node = this.getNodeInfo(data[i].itemCode, this.tableData)
          node.fullMoney = data[i].calculateMoney
        }
      }
    })*/
    //获取本次测算金额
    /* Api.getCostExpenditureDetailByCalculateId(this.calculateId).then(res => {
      //console.log(res)
      let data = res.data
      if (data && data.length) {
        this.costId = data[0].costId
        for (let i = 0; i < data.length; i++) {
          let node = this.getNodeInfo(data[i].itemCode, this.tableData)
          node.money = data[i].calculateMoney
          node.remark = data[i].calculateRemark
        }
      }
    })*/
    //新建个编辑获取测算金额的接口不一样(/修改新建)
    /* if (this.$route.query.isEdit) {
      Api.getCostExpenditureDetailByCalculateId(this.calculateId).then(res => {
        //console.log(res)
        let data = res.data
        if (data && data.length) {
          this.costId = data[0].costId
          for (let i = 0; i < data.length; i++) {
            let node = this.getNodeInfo(data[i].itemCode, this.tableData)
            node.money = data[i].calculateMoney
            node.remark = data[i].accountingRemark
          }
        }
      })
    } else {
      Api.getNewCostExpenditureDetailByCalculateId().then(res => {
        //console.log(res)
        let data = res.data
        if (data && data.length) {
          for (let i = 0; i < data.length; i++) {
            let node = this.getNodeInfo(data[i].itemCode, this.tableData)
            node.remark = data[i].accountingRemark
            node.money = data[i].calculateMoney
          }
        }
      })
    }*/
  },
  methods: {
    initTableData(data, tier) {
      for (let i = 0; i < data.length; i++) {
        data[i].serial = tier ? tier + '.' + (i + 1) : i + 1
        if (data[i].children && data[i].children.length) {
          this.initTableData(data[i].children, data[i].serial)
        } else {
          this.leafNodes.push(data[i])
        }
      }
    },
    changeMoney({ row }, e) {
      row.money = e.target.value
    },
    changeRemark({ row }, e) {
      row.remark = e.target.value
    },
    async saveRowEvent(row) {
      let money = row.money + ''
      if (
        money === '0' ||
        money === '' ||
        money.indexOf('0') === 0 ||
        money.indexOf('.') !== -1 ||
        money.indexOf('-') !== -1
      ) {
        this.$message.error('测算金额不合法')
        return
      }
      await this.$refs.xTable.clearActived()
      /*Api.addExpenditure({
        id: '',
        expenditureId: this.$route.params.expenditureId,
        itemCode: row.code,
        itemName: row.name,
        accountingMoney: row.fullMoney,
        accountingRemark: row.remark,
        projectId: localStorage.getItem('projectId')
      }).then(res => {
        //console.log(res)
        this.$message.success('保存成功')
        this.$refs.xTable.clearActived().then(() => {})
      })*/
    },
    editRowEvent(row) {
      //校验保存状态是否关闭
      if (this.validSaveStatus()) {
        return
      }
      this.$refs.xTable.setActiveRow(row)
    },
    validSaveStatus() {
      let indexActive = null
      for (let i = 0; i < this.leafNodes.length; i++) {
        if (this.$refs.xTable.isActiveByRow(this.leafNodes[i])) {
          indexActive = this.leafNodes[i].serial
          break
        }
      }
      if (indexActive) {
        this.$message.error(`请保存 第${indexActive}行记录，再做该操作`)
        return true
      } else {
        return false
      }
    },
    getNodeInfo(code, data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].code === code) {
          return data[i]
        }
        if (data[i].children && data[i].children.length) {
          let result = this.getNodeInfo(code, data[i].children)
          if (result) {
            return result
          }
        }
      }
    },
    async handleSubmit() {
      let list = this.$refs.xTable.getUpdateRecords()
      /*Api.submitCostExpenditureAccounting(this.$route.params.expenditureId).then(res => {
        this.$message.success('提交成功')
        this.$router.push({ name: 'ContractProjectsFunding' })
      })*/
      let arr = list.map(item => {
        return {
          targetId: this.calculateId,
          itemCode: item.code,
          itemName: item.name,
          currentMoney: item.money,
          currentRemark: item.remark,
          type: 1
        }
      })
      await Api.saveCostExpenditureCalculate(arr)
      /*this.$message.success('提交成功')
      this.$router.push({ name: 'ContractTargetCostBudgetChangeList' })*/
    },
    //保存
    async handleSave() {
      let list = this.$refs.xTable.getUpdateRecords()
      let arr = list.map(item => {
        return {
          targetId: this.calculateId,
          itemCode: item.code,
          itemName: item.name,
          currentMoney: item.money,
          currentRemark: item.remark,
          type: 1
        }
      })
      if (!arr.length) return
      await Api.saveCostExpenditureCalculate(arr)
      /*this.$message.success('保存成功')
      this.$router.push({ name: 'ContractTargetCostBudgetChangeList' })*/
    }
  }
}
</script>

<style scoped lang="less">
@import '../style.less';
</style>
