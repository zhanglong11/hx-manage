<template>
  <div class="indexWrapper">
    <el-form ref="form" :model="form" :rules="formRule" label-positon="left" label-width="180px">
      <el-form-item label="采购单编号" prop="purchaseBillCode">
        <el-input v-model="form.purchaseBillCode" :readonly="true" style="width: 400px;" placeholder="请选择"></el-input
        >&nbsp;
        <a @click="showModalPurchaseOrder">选择采购单</a>
      </el-form-item>
      <el-form-item label="供应商名称" prop="supplierName">
        <el-input v-model="form.supplierName" disabled style="width: 400px;" placeholder="请选择"></el-input>
      </el-form-item>
      <el-form-item label="验收人" prop="inspect">
        <SelectUser v-model="form.inspect" :multiple="false" style="width: 400px;" placeholder="请选择"></SelectUser>
      </el-form-item>
      <el-form-item label="验收日期" prop="inspectTime">
        <el-date-picker
          v-model="form.inspectTime"
          style="width: 400px;"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="上传">
        <FileUploadWithImg
          v-model="fileList"
          :fileRecover="fileUrlList"
          :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png']"
        ></FileUploadWithImg>
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

    <div style="padding-top: 10px;">
      <div style="padding-bottom: 10px;">入库明细</div>
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
          field="materialAmount"
          title="数量"
          :edit-render="{
            name: 'input',
            attrs: { type: 'number' }
          }"
        ></vxe-table-column>
        <vxe-table-column
          field="unitPrice"
          title="单价(元)"
          :edit-render="{
            name: 'input',
            attrs: { type: 'number' }
          }"
        ></vxe-table-column>
        <vxe-table-column
          field="totalPrice"
          title="合价(元)"
          :edit-render="{
            name: 'input',
            attrs: { type: 'number', disabled: true }
          }"
        >
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
        <vxe-table-column title="操作">
          <template v-slot="{ row, $rowIndex }">
            <template v-if="$refs.xTable.isActiveByRow(row)">
              <a @click="saveRowEvent(row, $rowIndex)">保存</a>
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

    <div style="text-align: right; padding-top: 10px;" class="footerButton">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <!--
            /**
       任务名称：2706/入库单修改
       开发人员：崔洛宜
       日期：2020-03-25
       任务类型：修改逻辑结构
       **/
      -->
      <!--  <el-button type="primary" @click="handleSubmit">保存并提交</el-button>-->
    </div>

    <ModalPurchaseOrder
      :visible.sync="visiblePurchaseOrder"
      @disposeSelectRow="disposeSelectPurchaseOrder"
    ></ModalPurchaseOrder>
  </div>
</template>

<script>
import ModalPurchaseOrder from '../components/modalPurchaseOrder'
import FileUploadWithImg from '@/components/FileUploadWithImg'
import Api from '@/api/device/material/instoreOrder'
import FileApi from '@/api/file'
export default {
  name: 'AddInstoreOrder',
  components: { ModalPurchaseOrder, FileUploadWithImg },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      form: {
        purchaseBillCode: '',
        purchaseBillId: '',
        supplierName: '',
        inspect: null,
        inspectTime: '',
        remark: ''
      },
      formRule: {
        /**
         任务名称：BUG#1376 物资与设备管理-材料管理-入库单&领料单&出库单&耗料清点-新增-必填项要加上必填标识
         开发人员：崔洛宜
         日期：2020-03-30
         BUG类型：测试人员发现的研发自测未通过引起的BUG
         **/
        purchaseBillCode: [{ required: true, message: '请选择采购单', trigger: 'change' }],
        inspect: [{ required: true, message: '请选择验收人', trigger: 'change' }],
        inspectTime: [{ required: true, message: '请选择验收日期', trigger: 'change' }]
      },
      fileList: [],
      fileUrlList: [],
      visiblePurchaseOrder: false,
      /**
       任务名称：2706/入库单修改
       开发人员：崔洛宜
       日期：2020-03-25
       任务类型：修改逻辑结构
       **/
      /*tableData: [
        {
          id: 1,
          code: '01011234',
          name: '螺纹钢1',
          modelNumber: 'φ16',
          unit: 'kg',
          supplier: '山西建邦',
          count: 3000,
          price: 4.5,
          totalPrice: 13500,
          rough: 12,
          tare: 1.5
        },
        {
          id: 2,
          code: '01011234',
          name: '螺纹钢2',
          modelNumber: 'φ16',
          unit: 'kg',
          supplier: '山西建邦',
          count: 3000,
          price: 4.5,
          totalPrice: 13500,
          rough: 12,
          tare: 1.5
        }
      ],*/
      tableData: []
    }
  },
  /**
   任务名称：2706/入库单修改
   开发人员：崔洛宜
   日期：2020-03-25
   任务类型：修改逻辑结构
   **/
  /* watch: {
    'form.purchaseBillId'(val) {
      this.getTableData(val)
    }
  },*/
  created() {
    let { id, isEdit } = this.$route.params
    this.id = id
    this.isEdit = isEdit
    if (isEdit) {
      Api.getDetailById(id).then(res => {
        if (res.code === 200) {
          this.form = res.data
          /**
           任务名称：BUG#1366 物资与设备管理-材料管理-过磅单-编辑-确定点了没反应
           开发人员：崔洛宜
           日期：2020-03-30
           BUG类型：测试人员发现的研发自测未通过引起的BUG
           **/
          /*this.tableData = res.data.list*/
          this.tableData = res.data.list ? res.data.list : []
          this.form.inspect = {
            id: res.data.inspector,
            label: res.data.inspectorName
          }
          this.fileList = res.data.fileId.split(',')
          if (this.fileList.length > 0) {
            FileApi.getFileList(this.fileList).then(res => {
              if (res.data) {
                this.fileUrlList = res.data
              }
            })
          }
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    }
  },
  methods: {
    /**
     任务名称：2706/入库单修改
     开发人员：崔洛宜
     日期：2020-03-25
     任务类型：修改逻辑结构
     **/
    getTableData(purchaseId) {
      Api.getPurchaseOrderById(purchaseId).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map(item => {
            return {
              ...item,
              materialAmount: item.dispatchAmount
            }
          })
          this.$refs.xTable.setActiveRow(this.tableData[0])
        }
      })
    },
    showModalPurchaseOrder() {
      this.visiblePurchaseOrder = true
    },
    disposeSelectPurchaseOrder(selectRow) {
      this.form.purchaseBillCode = selectRow.dispatchCode
      this.form.purchaseBillId = selectRow.id
      this.form.supplierName = selectRow.supplierName
      this.getTableData(selectRow.id)
    },
    /*saveRowEvent(row) {
      this.$refs.xTable.clearActived().then(() => {
        console.log(row)
      })
    },*/
    /**
     任务名称：2706/入库单修改
     开发人员：崔洛宜
     日期：2020-03-25
     任务类型：修改逻辑结构
     **/
    validSaveStatus() {
      let indexActive = null
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.$refs.xTable.isActiveByRow(this.tableData[i])) {
          indexActive = i + 1
          break
        }
      }
      if (indexActive) {
        this.$message.error(`请保存 入库明细 第${indexActive}行记录，再做该操作`)
        return true
      } else {
        return false
      }
    },
    /**
     任务名称：2706/入库单修改
     开发人员：崔洛宜
     日期：2020-03-25
     任务类型：修改逻辑结构
     **/
    saveRowEvent(row, $rowIndex) {
      this.$refs.xTable.clearActived()
      let materialAmount = row.materialAmount + ''
      if (
        materialAmount === 'undefined' ||
        materialAmount === '0' ||
        materialAmount === '' ||
        materialAmount.indexOf('0') === 0 ||
        materialAmount.indexOf('-') !== -1
      ) {
        this.$message.error('数量不合法')
        this.$refs.xTable.setActiveRow(row)
        return
      }
      if (materialAmount > row.dispatchAmount) {
        this.$message.error('数量不能多于采购数量')
        this.$refs.xTable.setActiveRow(row)
        return
      }

      let unitPrice = row.unitPrice + ''
      if (unitPrice === '0' || unitPrice === '' || unitPrice.indexOf('0') === 0 || unitPrice.indexOf('-') !== -1) {
        this.$message.error('单价不合法')
        this.$refs.xTable.setActiveRow(row)
        return
      }
      row.totalPrice = parseFloat(row.materialAmount) * parseFloat(row.unitPrice)
      this.$refs.xTable.updateFooter()
      this.$refs.xTable.setActiveRow(this.tableData[++$rowIndex])
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    /* editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },*/
    editRowEvent(row) {
      //校验保存状态是否关闭
      if (this.validSaveStatus()) {
        return
      }
      this.$refs.xTable.setActiveRow(row)
    },
    deleteRowEvent(row) {
      this.$refs.xTable.remove(row)
      this.$refs.xTable.updateFooter()
    },
    /**
     任务名称：2706/入库单修改
     开发人员：崔洛宜
     日期：2020-03-25
     任务类型：修改逻辑结构
     **/
    /*countNet(row) {
      return this.XEUtils.toNumber(row.rough) - this.XEUtils.toNumber(row.tare)
    },
    totalPrice(row) {
      return this.XEUtils.toNumber(row.count) * this.XEUtils.toNumber(row.price)
    },*/
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
    onCancel() {
      this.$router.back()
    },
    handleSave() {
      if (!this.form.purchaseBillId) {
        this.$message.error('请先选择一个采购单')
        return
      }
      if (this.validSaveStatus()) {
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          let list = [...this.tableData].map(item => {
            return {
              materialId: item.materialId,
              materialAmount: item.materialAmount,
              totalPrice: item.totalPrice,
              unitPrice: item.unitPrice,
              remark: item.remark,
              type: 1
            }
          })
          if (this.isEdit) {
            Api.updateOrder({
              ...this.form,
              inspectorName: this.form.inspect.name,
              inspector: this.form.inspect.id,
              fileId: this.fileList.join(','),
              list: list,
              projectId: this.projectId,
              status: 0
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          } else {
            Api.addOrder({
              ...this.form,
              projectId: this.projectId,
              inspectorName: this.form.inspect.name,
              inspector: this.form.inspect.id,
              list: list,
              fileId: this.fileList.join(','),
              status: 0
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          }
        } else {
          console.log('请正确填写')
          return false
        }
      })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            Api.updateOrder({
              ...this.form,
              projectId: this.projectId,
              inspectorName: this.form.inspect.name,
              inspector: this.form.inspect.id,
              fileId: this.fileList.join(','),
              status: 1
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          } else {
            Api.addOrder({
              ...this.form,
              projectId: this.projectId,
              inspectorName: this.form.inspect.name,
              inspector: this.form.inspect.id,
              fileId: this.fileList.join(','),
              status: 1
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          }
        } else {
          console.log('请正确填写')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
