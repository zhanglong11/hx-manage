<!--
@bug名称: 1236/界面开始加载的时候，树表格内容比较长，右侧没有滚动栏
@开发人员: 董渊海
@修改日期: 2020-03-20
@任务类型: 修改代码，树表格添加auto-resize属性，修改比例(1%)

@任务名称: 1355/开发环境input事件类型没有报错，但是线上环境报错
@开发人员: 董渊海
@修改日期: 2020-03-31
@任务类型: 修改代码，将input事件类型修改为change，修改比例(2%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: ca8df5134063d9d19758518a0c1648f511635333
@代码提交修改日期: 2020-03-07
@任务类型: 修改代码，合同项目经费核算 基本信息新增接口对接；配置预算项目明细信息
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 9be3e5c65eebd73fa421dd7692c70588a8ed0e99
@代码提交修改日期: 2020-03-09
@任务类型: 修改代码，合同项目经费核算 对接 项目经费核算列表接口，查询核算下的项目经费明细接口，项目经费明细新增(编辑)接口，添加项目经费核算明细详情页
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: b65fe7ac4a5ae22a6bbb5b31ac646558ce4ee2b7
@代码提交修改日期: 2020-03-10
@任务类型: 修改代码，合同项目经费核算 对接 项目经费核算编辑接口，删除接口，提交审核接口
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="detail-a">
      <div style="text-align: right; padding-bottom: 16px;">
        <span style="color: #999999;">项目经费核算状态：</span>
        <span style="color: #333333;">草稿</span>
      </div>
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
        <vxe-table-column field="money" title="测算金额(元)"></vxe-table-column>
        <vxe-table-column
          field="fullMoney"
          title="本期实际金额(元)"
          :edit-render="{ name: 'input', attrs: { type: 'number' }, events: { change: changeFullMoney } }"
        ></vxe-table-column>
        <vxe-table-column
          field="remark"
          title="备注"
          :edit-render="{ name: 'input', attrs: { type: 'text' }, events: { change: changeRemark } }"
        ></vxe-table-column>
        <vxe-table-column title="操作" width="120">
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

    <div class="detail-c">
      <el-button @click="handleBack">返回列表</el-button>
      <el-button @click="handleSave">保存</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/cost/contractProjectsFunding'
import projectFundList from '@/lib/projectFundList'
import _ from 'lodash'
export default {
  name: 'FundListEdit',
  data() {
    return {
      tableData: [],
      leafNodes: []
    }
  },
  mounted() {
    this.tableData = _.cloneDeep(projectFundList)
    this.initTableData(this.tableData)
    //console.log(this.leafNodes)

    //预算项目明细信息回显
    let expenditureId = this.$route.params.expenditureId
    Api.getExpenditureDetailByExpenditureId(expenditureId).then(res => {
      //console.log(res)
      let data = res.data
      if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
          let node = this.getNodeInfo(data[i].itemCode, this.tableData)
          node.fullMoney = data[i].currentMoney
          node.remark = data[i].currentRemark
          node.money = data[i].lastMoney
        }
      }
    })
    /* Api.getNewCostExpenditureDetailByExpenditureId().then(res => {
      //console.log(res)
      let data = res.data
      if (data && data.length) {
        this.costId = data[0].costId
        for (let i = 0; i < data.length; i++) {
          let node = this.getNodeInfo(data[i].itemCode, this.tableData)
          node.money = data[i].calculateMoney
        }
      }
    })*/
    //新建个编辑获取测算金额的接口不一样
    /*if (this.$route.params.isEdit) {
      Api.getCostExpenditureDetailByExpenditureId(expenditureId).then(res => {
        //console.log(res)
        let data = res.data
        if (data && data.length) {
          this.costId = data[0].costId
          for (let i = 0; i < data.length; i++) {
            let node = this.getNodeInfo(data[i].itemCode, this.tableData)
            node.money = data[i].calculateMoney
          }
        }
      })
    } else {
      Api.getNewCostExpenditureDetailByExpenditureId().then(res => {
        //console.log(res)
        let data = res.data
        if (data && data.length) {
          this.costId = data[0].costId
          for (let i = 0; i < data.length; i++) {
            let node = this.getNodeInfo(data[i].itemCode, this.tableData)
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
    changeFullMoney({ row }, e) {
      row.fullMoney = e.target.value
    },
    changeRemark({ row }, e) {
      row.remark = e.target.value
    },
    async saveRowEvent(row) {
      let fullMoney = row.fullMoney + ''
      if (
        fullMoney === '0' ||
        fullMoney === '' ||
        fullMoney.indexOf('0') === 0 ||
        fullMoney.indexOf('.') !== -1 ||
        fullMoney.indexOf('-') !== -1
      ) {
        this.$message.error('本期实际金额不合法')
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
          targetId: this.$route.params.expenditureId,
          itemCode: item.code,
          itemName: item.name,
          currentMoney: item.fullMoney,
          currentRemark: item.remark,
          type: 2
        }
      })
      await Api.saveCostExpenditureAccounting(arr)
      await Api.submitCostExpenditureAccounting(this.$route.params.expenditureId, arr)
      this.$message.success('提交成功')
      this.$router.push({ name: 'ContractProjectsFunding' })
    },
    handleBack() {
      this.$router.push({ name: 'ContractProjectsFunding' })
    },
    //保存
    async handleSave() {
      let list = this.$refs.xTable.getUpdateRecords()
      console.log(list)
      let arr = list.map(item => {
        return {
          targetId: this.$route.params.expenditureId,
          itemCode: item.code,
          itemName: item.name,
          currentMoney: item.fullMoney,
          currentRemark: item.remark,
          type: 2
        }
      })
      /*Api.cancelCostExpenditureAccounting(this.$route.params.expenditureId, arr).then(res => {
        this.$message.success('提交成功')
        this.$router.push({ name: 'ContractProjectsFunding' })
      })*/
      await Api.saveCostExpenditureAccounting(arr)
      this.$message.success('保存成功')
      this.$router.push({ name: 'ContractProjectsFunding' })
    }
  }
}
</script>

<style scoped lang="less"></style>
