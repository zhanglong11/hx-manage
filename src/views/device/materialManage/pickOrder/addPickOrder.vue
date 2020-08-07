<template>
  <div class="indexWrapper">
    <el-form ref="form" :model="form" :rules="formRule" label-positon="left" label-width="180px">
      <el-form-item label="领料单位" prop="receiveOrganName">
        <el-input v-model="form.receiveOrganName" disabled style="width: 400px;" placeholder="请选择"></el-input>&nbsp;
      </el-form-item>
      <el-form-item label="领料人" prop="receiver">
        <SelectUserWithDep
          v-model="form.receiver"
          :multiple="false"
          style="width: 400px;"
          placeholder="请选择"
        ></SelectUserWithDep>
      </el-form-item>
      <el-form-item label="领料日期" prop="receiveTime">
        <el-date-picker
          v-model="form.receiveTime"
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
      <ul style="display: flex; justify-content: space-between;">
        <li>领料明细</li>
        <li>
          <el-button type="primary" style="margin-bottom: 10px;" @click="showModalInventory">选择库存物资</el-button>
        </li>
      </ul>
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
        <!--
            /**
             任务名称：2709/取样单修改
             开发人员：崔洛宜
             日期：2020-03-25
             任务类型：修改逻辑
             **/
        -->
        <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
        <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
        <vxe-table-column field="materialName" title="名称"></vxe-table-column>
        <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
        <vxe-table-column field="unit" title="单位"></vxe-table-column>
        <vxe-table-column
          field="materialAmount"
          title="数量"
          :edit-render="{
            name: '$input',
            props: { type: 'number' }
          }"
        ></vxe-table-column>
        <!--<vxe-table-column
          field="unitPrice"
          title="单价(元)"
          :edit-render="{
            name: '$input',
            props: { type: 'number' }
          }"
        />-->
        <vxe-table-column field="unitPrice" title="单价(元)" />
        <vxe-table-column field="totalPrice" title="合价(元)">
          <template v-slot="{ row }">
            {{ row.materialAmount && row.unitPrice ? row.materialAmount * row.unitPrice : 0 }}</template
          >
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
        <vxe-table-column title="操作" width="120">
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
    <ModalMaterial
      v-if="visiblePickOrder"
      :visible.sync="visiblePickOrder"
      @disposeSelectRow="disposeSelectPickOrder"
    ></ModalMaterial>
    <div style="text-align: right; padding-top: 10px;" class="footerButton">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <!--
          /**
       任务名称：2709/取样单修改
       开发人员：崔洛宜
       日期：2020-03-25
       任务类型：修改逻辑
       **/
      -->
      <!--
          /**
       任务名称：2729 领料单审核修改
       开发人员：崔洛宜
       日期：2020-03-25
       任务类型：修改逻辑
       **/
      -->
      <!--<el-button type="primary" @click="handleSubmit">保存并提交</el-button>-->
      <el-button type="primary" @click="handleSubmit">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
import FileUploadWithImg from '@/components/FileUploadWithImg'
import ModalMaterial from '../components/modalMaterial'
import Api from '@/api/device/material/pickOrder'
import FileApi from '@/api/file'
export default {
  name: 'AddPickOrder',
  components: { FileUploadWithImg, ModalMaterial },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      form: {
        receiveOrganName: '',
        receiveOrganId: '',
        receiver: null,
        receiveTime: '',
        remark: ''
      },
      formRule: {
        /**
         任务名称：BUG#1376 物资与设备管理-材料管理-入库单&领料单&出库单&耗料清点-新增-必填项要加上必填标识
         开发人员：崔洛宜
         日期：2020-03-30
         BUG类型：测试人员发现的研发自测未通过引起的BUG
         **/
        receiver: [{ required: true, message: '请选择领料人', trigger: 'change' }],
        receiveTime: [{ required: true, message: '请选择领料日期', trigger: 'change' }]
      },
      fileList: [],
      fileUrlList: [],
      visiblePickOrder: false,
      /**
       任务名称：2709/取样单修改
       开发人员：崔洛宜
       日期：2020-03-25
       任务类型：修改逻辑
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
      ]*/
      tableData: []
    }
  },
  watch: {
    /**
    任务名称：2709/取样单修改
开发人员：崔洛宜
日期：2020-03-25
任务类型：修改逻辑
**/
    'form.receiver'(val) {
      if (val.id) {
        this.form.receiveOrganName = val.depName
        this.form.receiveOrganId = val.organId
      } else {
        this.form.receiveOrganName = ''
        this.form.receiveOrganId = ''
      }
    }
  },
  created() {
    let { id, isEdit } = this.$route.query
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
          this.form.receiver = {
            id: res.data.receiver,
            label: res.data.receiverName
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
    showModalInventory() {
      this.visiblePickOrder = true
    },
    /**
     任务名称：2709/取样单修改
     开发人员：崔洛宜
     日期：2020-03-25
     任务类型：修改逻辑
     **/
    disposeSelectPickOrder(selectRows) {
      this.tableData = selectRows
      this.$refs.xTable.setActiveRow(this.tableData[0])
    },
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

      /*let unitPrice = row.unitPrice + ''
      if (unitPrice === '0' || unitPrice === '' || unitPrice.indexOf('0') === 0 || unitPrice.indexOf('-') !== -1) {
        this.$message.error('单价不合法')
        this.$refs.xTable.setActiveRow(row)
        return
      }*/
      row.totalPrice = parseFloat(row.materialAmount) * parseFloat(row.unitPrice)
      this.$refs.xTable.updateFooter()
      this.$refs.xTable.setActiveRow(this.tableData[++$rowIndex])
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
        this.$message.error(`请保存 取料明细 第${indexActive}行记录，再做该操作`)
        return true
      } else {
        return false
      }
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    deleteRowEvent(row) {
      this.tableData = this.tableData.filter(item => item._XID !== row._XID)
      this.$refs.xTable.updateFooter()
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
    onCancel() {
      this.$router.back()
    },
    handleSave() {
      if (this.validSaveStatus()) {
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          let list = [...this.tableData].map(item => {
            return {
              materialId: item.materialId ? item.materialId : item.id,
              materialName: item.materialName,
              materialCode: item.materialCode,
              specification: item.specification,
              unit: item.unit,
              materialAmount: item.materialAmount,
              totalPrice: item.totalPrice,
              unitPrice: item.unitPrice,
              remark: item.remark,
              type: 2
            }
          })
          if (this.isEdit) {
            Api.updateOrder({
              ...this.form,
              receiverName: this.form.receiver.name,
              receiver: this.form.receiver.id,
              fileId: this.fileList.join(','),
              projectId: this.projectId,
              list: list,
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
              receiverName: this.form.receiver.name,
              receiver: this.form.receiver.id,
              fileId: this.fileList.join(','),
              list: list,
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
      /**
       任务名称：2729 领料单审核修改
       开发人员：崔洛宜
       日期：2020-03-25
       任务类型：修改逻辑
       **/
      if (this.validSaveStatus()) {
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          let list = [...this.tableData].map(item => {
            return {
              materialId: item.materialId ? item.materialId : item.id,
              materialName: item.materialName,
              materialCode: item.materialCode,
              specification: item.specification,
              unit: item.unit,
              materialAmount: item.materialAmount,
              totalPrice: item.totalPrice,
              unitPrice: item.unitPrice,
              remark: item.remark,
              type: 2
            }
          })
          if (this.isEdit) {
            Api.updateOrder({
              ...this.form,
              projectId: this.projectId,
              receiverName: this.form.receiver.name,
              receiver: this.form.receiver.id,
              fileId: this.fileList.join(','),
              list: list,
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
              receiverName: this.form.receiver.name,
              receiver: this.form.receiver.id,
              fileId: this.fileList.join(','),
              list: list,
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

<style scoped lang="less">
/deep/ .vxe-table--footer-wrapper {
  margin-top: -1px !important;
}
</style>
