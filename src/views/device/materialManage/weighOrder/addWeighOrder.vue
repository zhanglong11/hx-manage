<!--
@bug名称: 1020/过磅单调整
@开发人员: 董渊海
@修改日期: 2020-03-24
@任务类型: 修改代码，修改过磅单业务功能，新增(编辑)过磅单界面样式调整，修改比例(60%)

@bug名称: 1020/过磅单调整
@开发人员: 董渊海
@修改日期: 2020-03-24
@任务类型: 修改代码，去掉物资重量，去掉保存提交按钮，添加路由跳转，修改比例(5%)

@bug名称: 1020/过磅单调整
@开发人员: 董渊海
@修改日期: 2020-03-24
@任务类型: 修改代码，明细表添加毛重、净重、车牌号校验，修改比例(45%)
-->
<template>
  <div class="right-panel indexWrapper">
    <div class="form-a">
      <el-form ref="form" :model="form" :rules="formRule" label-positon="left" label-width="180px">
        <el-form-item label="采购单" prop="purchaseCode">
          <el-input v-model="form.purchaseCode" readonly style="width: 400px;" placeholder="请选择"></el-input>&nbsp;
          <a @click="showModalPurchaseOrder">选择采购单</a>
        </el-form-item>
        <el-form-item label="检斤人员" prop="inspectorName">
          <el-input v-model="form.inspectorName" readonly style="width: 400px;" placeholder="请选择"></el-input>&nbsp;
          <a @click="showModalPerson">选择人员</a>
        </el-form-item>
        <el-form-item label="检斤日期" prop="inspectTime">
          <el-date-picker
            v-model="form.inspectTime"
            type="datetime"
            style="width: 400px;"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <!--<el-form-item label="物资重量" prop="totalWeight">
          <el-input v-model.number="form.totalWeight" style="width: 400px" placeholder="请输入物资重量"></el-input>
        </el-form-item>-->
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
    </div>

    <div class="form-b">
      <div class="form-b-head">过磅明细</div>
      <div class="form-b-table">
        <vxe-table
          ref="xTable"
          border
          resizable
          show-overflow
          keep-source
          :data="tableData"
          :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
          <vxe-table-column field="materialName" title="名称"></vxe-table-column>
          <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="supplierName" title="供应商名称"></vxe-table-column>
          <vxe-table-column
            field="roughWeight"
            title="毛重"
            :edit-render="{
              name: 'input',
              attrs: { type: 'number' },
              events: { change: changeRoughWeight, input: inputRoughWeight }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="tareWeight"
            title="皮重"
            :edit-render="{
              name: 'input',
              attrs: { type: 'number' },
              events: { change: changeTareWeight, input: inputTareWeight }
            }"
          ></vxe-table-column>
          <vxe-table-column field="netWeight" title="净重"></vxe-table-column>
          <vxe-table-column
            field="carNum"
            title="车牌号"
            :edit-render="{
              name: 'input',
              attrs: { type: 'text' },
              events: { change: changeCarNum, input: inputCarNum }
            }"
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
        <!--
          /**
           任务名称：1256/新建采购单的问题
           开发人员：崔洛宜
           日期：2020-03-23
           BUG类型：自测bug
           **/
        -->
        <!--<div class="addWrapper" @click="handleAdd"><i class="el-icon-plus"></i>添加</div>-->
        <div class="form-b-table-foot">
          <el-button class="btn-add" @click="handleAdd">添加</el-button>
        </div>
      </div>
    </div>

    <div class="form-c footerButton">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <!--<el-button type="primary" @click="handleSubmit">保存并提交</el-button>-->
    </div>

    <ModalPurchaseOrder
      v-if="visiblePurchaseOrder"
      :visible.sync="visiblePurchaseOrder"
      @disposeSelectRow="disposeSelectPurchaseOrder"
    ></ModalPurchaseOrder>
    <ModalPerson :visible.sync="visiblePerson" @disposeSelectRow="disposeSelectperson"></ModalPerson>
    <ModalOrderList
      v-if="visibleOrderList"
      :purchaseId="form.purchaseId"
      :visible.sync="visibleOrderList"
      :validList="tableData"
      @disposeSelectRow="disposeSelectOrderList"
    ></ModalOrderList>
  </div>
</template>

<script>
import ModalPurchaseOrder from '../components/modalPurchaseOrder'
import ModalPerson from '../components/modalPerson'
import ModalOrderList from '../components/modalOrderList'
import FileUploadWithImg from '@/components/FileUploadWithImg'
import Api from '@/api/device/material/weighOrder'
import FileApi from '@/api/file'
export default {
  name: 'AddWeighOrder',
  components: { ModalPurchaseOrder, ModalPerson, FileUploadWithImg, ModalOrderList },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      form: {
        purchaseCode: '',
        purchaseId: '',
        inspectorName: '',
        inspector: '',
        inspectTime: '',
        //carNum: '',
        //totalWeight: '',
        remark: ''
      },
      formRule: {
        purchaseCode: [{ required: true, message: '请选择采购单' }],
        inspectorName: [{ required: true, message: '请选择检斤人员' }],
        inspectTime: [{ required: true, message: '请选择检斤日期' }]
        /*totalWeight: [
          { required: true, message: '物资重量不能为空', trigger: 'blur' },
          { type: 'number', message: '物资重量必须为数字' }
        ]*/
      },
      fileList: [],
      fileUrlList: [],
      visiblePurchaseOrder: false,
      visiblePerson: false,
      visibleOrderList: false,
      tableData: []
    }
  },
  watch: {
    'form.purchaseId'(val) {
      //this.getTableData(val)
    }
  },
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
    showModalPurchaseOrder() {
      this.visiblePurchaseOrder = true
    },
    showModalPerson() {
      this.visiblePerson = true
    },
    disposeSelectPurchaseOrder(selectRow) {
      /**
       任务名称：1210/采购单数据不对
       开发人员：崔洛宜
       日期：2020-03-19
       BUG类型：
       **/
      this.form.purchaseCode = selectRow.dispatchCode
      this.form.purchaseId = selectRow.id
    },
    disposeSelectperson(selectRow) {
      /**
       任务名称：1256/新建采购单的问题
       开发人员：崔洛宜
       日期：2020-03-23
       BUG类型：自测bug
       **/
      this.form.inspectorName = selectRow.realName
      this.form.inspector = selectRow.id
    },
    /**
     任务名称：1256/新建采购单的问题
     开发人员：崔洛宜
     日期：2020-03-23
     BUG类型：自测bug
     **/
    disposeSelectOrderList(record) {
      //this.tableData = [...this.tableData, ...[record]]
      let obj = {
        purchaseDetailId: record.id,
        materialCode: record.materialCode,
        materialName: record.materialName,
        specification: record.specification,
        unit: record.unit,
        supplierName: record.supplierName,
        roughWeight: 0,
        tareWeight: 0,
        netWeight: 0,
        carNum: ''
      }
      this.tableData.push(obj)
      this.$refs.xTable.setActiveRow(obj)
    },
    /*getTableData(purchaseId) {
      /!**
       任务名称：1210/采购单数据不对
       开发人员：崔洛宜
       日期：2020-03-18
       BUG类型：
       **!/
      Api.getPurchaseOrderById(purchaseId).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
        }
      })
    },*/
    //毛重
    changeRoughWeight({ row }, e) {
      row.roughWeight = e.target.value
    },
    inputRoughWeight({ row }, e) {
      row.roughWeight = e.target.value
    },
    //皮重
    changeTareWeight({ row }, e) {
      row.tareWeight = e.target.value
    },
    inputTareWeight({ row }, e) {
      row.tareWeight = e.target.value
    },
    /**
     任务名称：1256/新建采购单的问题
     开发人员：崔洛宜
     日期：2020-03-23
     BUG类型：自测bug
     **/
    //车牌号修改
    changeCarNum({ row }, e) {
      row.carNum = e.target.value
    },
    inputCarNum({ row }, e) {
      row.carNum = e.target.value
    },
    saveRowEvent(row) {
      let roughWeight = row.roughWeight + ''
      if (
        roughWeight === '0' ||
        roughWeight === '' ||
        roughWeight.indexOf('0') === 0 ||
        roughWeight.indexOf('-') !== -1
      ) {
        this.$message.error('毛重不合法')
        return
      }

      let tareWeight = row.tareWeight + ''
      if (tareWeight === '0' || tareWeight === '' || tareWeight.indexOf('0') === 0 || tareWeight.indexOf('-') !== -1) {
        this.$message.error('皮重不合法')
        return
      }

      if (parseFloat(row.roughWeight) <= parseFloat(row.tareWeight)) {
        this.$message.error('毛重必须大于皮重')
        return
      }

      let carNum = row.carNum
      if (carNum === '') {
        this.$message.error('车牌号不能为空')
        return
      }

      row.netWeight = (parseFloat(row.roughWeight) - parseFloat(row.tareWeight)).toFixed(2)
      this.$refs.xTable.clearActived().then(() => {
        //console.log(row)
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
      let index = null
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].purchaseDetailId === row.purchaseDetailId) {
          index = i
          break
        }
      }
      if (index !== null) {
        this.tableData.splice(index, 1)
      }
    },
    /*countNet(row) {
      return this.XEUtils.toNumber(row.roughWeight) - this.XEUtils.toNumber(row.tareWeight)
    },*/
    onCancel() {
      this.$router.back()
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
        this.$message.error(`请保存 过磅明细 第${indexActive}行记录，再做该操作`)
        return true
      } else {
        return false
      }
    },
    handleSave() {
      //校验保存状态是否关闭
      if (this.validSaveStatus()) {
        return
      }

      //校验毛重、皮重、车牌号是否合法
      let indexRough = null
      let indexTare = null
      let indexRoughTare = null
      let indexCarNum = null
      for (let i = 0; i < this.tableData.length; i++) {
        let roughWeight = this.tableData[i].roughWeight + ''
        if (
          roughWeight === '0' ||
          roughWeight === '' ||
          roughWeight.indexOf('0') === 0 ||
          roughWeight.indexOf('-') !== -1
        ) {
          indexRough = i + 1
          break
        }

        let tareWeight = this.tableData[i].tareWeight + ''
        if (
          tareWeight === '0' ||
          tareWeight === '' ||
          tareWeight.indexOf('0') === 0 ||
          tareWeight.indexOf('-') !== -1
        ) {
          indexTare = i + 1
          break
        }

        if (parseFloat(roughWeight) <= parseFloat(tareWeight)) {
          indexRoughTare = i + 1
          break
        }

        if (this.tableData[i].carNum === '') {
          indexCarNum = i + 1
          break
        }
      }
      if (indexRough) {
        this.$message.error(`过磅明细 第${indexRough}行记录的毛重不合法`)
        return
      }
      if (indexTare) {
        this.$message.error(`过磅明细 第${indexTare}行记录的皮重不合法`)
        return
      }
      if (indexRoughTare) {
        this.$message.error(`过磅明细 第${indexRoughTare}行记录的毛重必须大于皮重`)
        return
      }
      if (indexCarNum) {
        this.$message.error(`过磅明细 第${indexCarNum}行记录的车牌号不能为空`)
        return
      }

      this.$refs.form.validate(valid => {
        /**
         任务名称：1210/采购单数据不对
         开发人员：崔洛宜
         日期：2020-03-19
         BUG类型：
         **/
        let list = [...this.tableData].map(item => {
          return {
            purchaseDetailId: item.purchaseDetailId,
            roughWeight: item.roughWeight,
            tareWeight: item.tareWeight,
            netWeight: item.netWeight,
            carNum: item.carNum
          }
        })
        if (valid) {
          if (this.isEdit) {
            Api.updateOrder({
              ...this.form,
              fileId: this.fileList.join(','),
              projectId: this.projectId,
              list: list,
              status: 0
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.push({ name: 'WeighOrder' })
              } else {
                this.$message.error('保存失败')
              }
            })
          } else {
            Api.addOrder({
              ...this.form,
              projectId: this.projectId,
              fileId: this.fileList.join(','),
              list: list,
              status: 0
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.push({ name: 'WeighOrder' })
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
        /**
         任务名称：1210/采购单数据不对
         开发人员：崔洛宜
         日期：2020-03-19
         BUG类型：
         **/
        let list = [...this.tableData].map(item => {
          return {
            purchaseDetailId: item.id,
            roughWeight: item.roughWeight,
            tareWeight: item.tareWeight,
            netWeight: item.roughWeight - 0 - (item.tareWeight - 0)
          }
        })
        if (valid) {
          if (this.isEdit) {
            Api.updateOrder({
              ...this.form,
              fileId: this.fileList.join(','),
              projectId: this.projectId,
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
    },
    /**
     任务名称：1256/新建采购单的问题
     开发人员：崔洛宜
     日期：2020-03-23
     BUG类型：自测bug
     **/
    handleAdd() {
      if (!this.form.purchaseId) {
        this.$message.error('请先选择一个采购单')
        return
      }
      this.visibleOrderList = true
    }
  }
}
</script>

<style scoped lang="less">
.addWrapper {
  height: 40px;
  line-height: 40px;
  margin: 10px 50px;
  border: 1px #585858 dashed;
  text-align: center;
}
</style>
