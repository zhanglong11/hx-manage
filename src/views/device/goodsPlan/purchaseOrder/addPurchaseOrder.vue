<!--
@任务名称: 1361/根据原型修改文本框中的提示信息
@开发人员: 董渊海
@修改日期: 2020-03-30
@任务类型: 修改代码，修改比例(2%)

@任务名称: 1355/开发环境input事件类型没有报错，但是线上环境报错
@开发人员: 董渊海
@修改日期: 2020-03-31
@任务类型: 修改代码，将input事件类型修改为change，修改比例(1%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 9c09ed88507aa76c22849531fc13a576eff74928
@代码提交修改日期: 2020-03-02
@任务类型: 修改代码，采购单 新增采购单时，查询采购合同明细与需用计划明细的交集(40%)
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 407f019814c6559c61ea3dd09445a4750bdf3f24
@代码提交修改日期: 2020-03-03
@任务类型: 修改代码，完成 采购单 列表接口对接；新增采购单时，查询采购合同明细与需用计划明细交集业务；新增采购单接口对接
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 9c7fdc0460e9936822107c8ae3bae5082caa11f9
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，完成 采购单 删除接口对接，添加可编辑表格保存状态校验，添加采购数量校验
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 78d89f3e215273723bb7636f4191214b7c384704
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，完成 采购单 编辑接口对接，保存提交功能，详情接口对接，采购单详情界面样式调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 30d0953c4a78d9a7fe4e41d80840a6e8643bfc98
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，选择租赁计划模态框调整，选择合同模态框添加合同类型参数控制
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="form-a">
      <el-form ref="form" :model="form" :rules="formRules" label-positon="left" label-width="180px">
        <el-form-item v-if="form.id ? true : false" label="采购单编号">
          <el-input :value="form.dispatchCode" disabled style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="需用计划" prop="planCode">
          <el-input v-model="form.planCode" :readonly="true" style="width: 400px;" placeholder="请选择"></el-input
          >&nbsp;
          <a @click="showModalNeedPlan">选择需用计划</a>
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-input
            v-model="form.supplierName"
            :disabled="true"
            style="width: 400px;"
            placeholder="关联采购合同中的供应商名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractCode">
          <el-input v-model="form.contractCode" :readonly="true" style="width: 400px;" placeholder="请选择"></el-input
          >&nbsp;
          <a @click="showModalContract">选择合同</a>
        </el-form-item>
        <el-form-item label="采购单金额(元)">
          <el-input
            v-model="form.purchaseAmount"
            :disabled="true"
            style="width: 400px;"
            placeholder="关联采购明细中的合计"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <FileUpload :fileRecover="fileList" @input="setFileId"></FileUpload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            style="width: 400px;"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="form-b">
      <div class="form-b-head">采购明细</div>
      <div class="form-b-table">
        <vxe-table
          ref="xTable"
          border
          resizable
          show-overflow
          keep-source
          :data="tableData"
          :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
          show-footer
          :footer-method="footerMethod"
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
          <vxe-table-column field="materialName" title="名称"></vxe-table-column>
          <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column
            field="dispatchAmount"
            title="采购数量"
            :edit-render="{ name: 'input', attrs: { type: 'number' }, events: { change: dispatchAmountChangeEvent } }"
          ></vxe-table-column>
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
          <vxe-table-column
            field="remark"
            title="备注"
            :edit-render="{ name: 'textarea', attrs: { type: 'text' } }"
          ></vxe-table-column>
          <vxe-table-column title="操作" width="120">
            <template v-slot="{ row }">
              <template v-if="$refs.xTable.isActiveByRow(row)">
                <a @click="saveRowEvent(row)">保存</a>
                <a @click="cancelRowEvent(row)">取消</a>
              </template>
              <template v-else>
                <a @click="editRowEvent(row)">编辑</a>
                <a @click="deleteRowEvent(row)">删除</a>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </div>

    <div class="form-c">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        :disabled="tableData.length === 0"
        @click="
          () => {
            handleSave(0)
          }
        "
        >保存</el-button
      >
      <el-button type="primary" :disabled="tableData.length === 0" @click="handleSaveSubmit">保存并提交</el-button>
    </div>

    <ModalNeedPlan :visible.sync="visibleNeedPlan" @optionSelectRecord="optionSelectRecordNeedPlan"></ModalNeedPlan>
    <ModalContract
      :visible.sync="visibleContract"
      :contractType="contractType"
      @optionSelectRecord="optionSelectRecordContract"
    ></ModalContract>
  </div>
</template>

<script>
import ModalNeedPlan from './modalNeedPlan'
import ModalContract from '../components/modalContract'
import Api from '@/api/device/goodsPlan/purchaseOrder'
import FileApi from '@/api/file'
export default {
  name: 'AddPurchaseOrder',
  components: { ModalNeedPlan, ModalContract },
  data() {
    return {
      fileList: [],
      form: {
        id: '',
        dispatchCode: '',
        planId: '',
        contractId: '',
        planCode: '',
        contractCode: '',
        purchaseAmount: '',
        fileId: null,
        remark: '',
        supplierId: '',
        supplierName: '',
        projectId: localStorage.getItem('projectId'),
        list: [],
        type: '1' //代表采购单
      },
      formRules: {
        planCode: [{ required: true, message: '请选择需用计划' }],
        contractCode: [{ required: true, message: '请选择合同' }]
      },
      tableData: [],

      visibleNeedPlan: false,
      visibleContract: false,
      contractType: ''
    }
  },
  mounted() {
    this.form.id = this.$route.params.id ? this.$route.params.id : ''
    if (this.form.id) {
      Api.getPurchaseOrderDetail(this.form.id).then(res => {
        let data = res.data
        if (data) {
          this.form = data
          this.tableData = this.form.list === null ? [] : this.form.list
          if (this.form.fileId) {
            let fileIds = this.form.fileId.split(',')
            FileApi.getFileList(fileIds).then(res => {
              if (res.data) {
                this.fileList = res.data
              }
            })
          }
        }
      })
    }
  },
  methods: {
    showModalNeedPlan() {
      this.visibleNeedPlan = true
    },
    showModalContract() {
      this.visibleContract = true
      this.contractType = '2'
    },
    optionSelectRecordNeedPlan(record) {
      //this.form.name = record.name
      this.form.planId = record.id
      this.form.planCode = record.planCode
      this.getPurchaseDetailList()
    },
    optionSelectRecordContract(record) {
      this.form.supplierName = record.secondParty
      this.form.contractCode = record.code
      this.form.contractId = record.id
      this.getPurchaseDetailList()
    },
    getPurchaseDetailList() {
      if (this.form.planId && this.form.contractId) {
        let getPlanDetailList = new Promise((resolve, reject) => {
          Api.getPlanDetailList(this.form.planId).then(res => {
            resolve(res)
          })
        })
        let getContractDetailList = new Promise((resolve, reject) => {
          Api.getContractDetailList({
            contractId: this.form.contractId,
            isBindMaterial: 1
          }).then(res => {
            resolve(res)
          })
        })

        Promise.all([getPlanDetailList, getContractDetailList]).then(res => {
          let needRes = res[0].data
          let contractRes = res[1].data
          let shareDetail = []
          if (needRes && contractRes) {
            let needDetail = needRes
            let contractDetail = contractRes.records
            if (needDetail.length && contractDetail.length) {
              for (let i = 0; i < needDetail.length; i++) {
                for (let j = 0; j < contractDetail.length; j++) {
                  if (needDetail[i].materialId === contractDetail[j].materialId) {
                    shareDetail.push({
                      materialId: needDetail[i].materialId,
                      materialCode: needDetail[i].materialCode,
                      materialName: needDetail[i].materialName,
                      specification: needDetail[i].specification,
                      unit: needDetail[i].unit,
                      dispatchAmount: 0,
                      unitPrice: contractDetail[j].unitPrice,
                      totalPrice: 0,
                      materialType: needDetail[i].materialType,
                      materialKind: needDetail[i].materialKind,
                      remark: needDetail[i].remark,
                      validAmount:
                        needDetail[i].materialAmount >= contractDetail[j].quantity
                          ? contractDetail[j].quantity
                          : needDetail[i].materialAmount
                    })
                  }
                }
              }
            }
          }
          this.tableData = shareDetail
          if (shareDetail.length === 0) {
            this.$message.info('无采购明细，请前往“采购合同”进行“清单关联”操作。')
          }
          //console.log(this.tableData)
        })
      }
    },

    dispatchAmountChangeEvent({ row }, e) {
      row.dispatchAmount = e.target.value
    },
    saveRowEvent(row) {
      let dispatchAmount = row.dispatchAmount + ''

      if (
        dispatchAmount === '0' ||
        dispatchAmount === '' ||
        dispatchAmount.indexOf('0') === 0 ||
        dispatchAmount.indexOf('.') !== -1 ||
        dispatchAmount.indexOf('-') !== -1
      ) {
        this.$message.error('采购数量不合法')
        return
      }

      if (parseFloat(dispatchAmount) > row.validAmount) {
        this.$message.error('采购数量不能超过最大采购数量')
        return
      }

      this.$refs.xTable.clearActived().then(() => {
        //console.log(row)
        row.totalPrice = parseFloat(row.dispatchAmount) * parseFloat(row.unitPrice)
        this.$refs.xTable.updateFooter()

        let totalPrice = 0
        this.tableData.map(item => {
          totalPrice += item.totalPrice
        })
        this.form.purchaseAmount = totalPrice
      })
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    editRowEvent(row) {
      //校验保存状态是否关闭
      if (this.validSaveStatus()) {
        return
      }
      this.$refs.xTable.setActiveRow(row)
    },
    deleteRowEvent(row) {
      //this.$refs.xTable.remove(row)
      //console.log(row)
      let index = null
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].materialId === row.materialId) {
          index = i
          break
        }
      }
      if (index !== null) {
        this.tableData.splice(index, 1)
        let totalPrice = 0
        this.tableData.map(item => {
          totalPrice += item.totalPrice
        })
        this.form.purchaseAmount = totalPrice
      }
    },
    footerMethod({ columns, data }) {
      let result = [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['totalPrice'].includes(column.property)) {
            return this.XEUtils.sum(data, column.property)
          }
          return null
        })
      ]
      return result
    },

    validSaveStatus() {
      let indexActive = null
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.$refs.xTable.isActiveByRow(this.tableData[i])) {
          indexActive = i + 1
          break
        }
      }
      if (indexActive) {
        this.$message.error(`请保存 采购明细 第${indexActive}行记录，再做该操作`)
        return true
      } else {
        return false
      }
    },
    handleSave(isSubmit) {
      //校验保存状态是否关闭
      if (this.validSaveStatus()) {
        return
      }

      //校验采购数量是否合法
      let indexAmount = null
      for (let i = 0; i < this.tableData.length; i++) {
        let dispatchAmount = this.tableData[i].dispatchAmount + ''
        if (
          dispatchAmount === '0' ||
          dispatchAmount === '' ||
          dispatchAmount.indexOf('0') === 0 ||
          dispatchAmount.indexOf('.') !== -1 ||
          dispatchAmount.indexOf('-') !== -1
        ) {
          indexAmount = i + 1
          break
        }
      }
      if (indexAmount) {
        this.$message.error(`采购明细 第${indexAmount}行记录的采购数量不合法`)
        return
      }

      this.$refs.form.validate(valid => {
        if (valid) {
          let list = []
          this.tableData.map((item, i) => {
            list.push({
              dispatchAmount: item.dispatchAmount,
              materialId: item.materialId,
              remark: item.remark,
              totalPrice: parseFloat(item.dispatchAmount) * parseFloat(item.unitPrice),
              unitPrice: item.unitPrice
            })
            //this.form.purchaseAmount = this.form.purchaseAmount + list[i].totalPrice
          })
          this.form.list = list
          //console.log(this.form)
          if (isSubmit) {
            //是否提交
            this.form.status = 1
          }
          if (this.form.id) {
            Api.editPurchaseOrder(this.form).then(res => {
              this.$message.success('编辑成功')
              this.$router.push({ name: 'PurchaseOrder' })
            })
          } else {
            Api.addPurchaseOrder(this.form).then(res => {
              this.$message.success('新增成功')
              this.$router.push({ name: 'PurchaseOrder' })
            })
          }
        }
      })
    },
    handleSaveSubmit() {
      this.handleSave(1)
    },
    handleCancel() {
      this.$router.push({ name: 'PurchaseOrder' })
    },
    setFileId(fileIds) {
      //console.log(fileIds)
      this.form.fileId = fileIds.join(',') ? fileIds.join(',') : null
    }
  }
}
</script>

<style scoped lang="less"></style>
