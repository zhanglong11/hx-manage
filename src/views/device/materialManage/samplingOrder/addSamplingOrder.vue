<!--
@任务名称: 1021/取样单调整
@开发人员: 董渊海
@修改日期: 2020-03-24
@任务类型: 修改代码，新增(编辑)取样单界面样式调整，取样明细添加批号、生产时间、取样数量、检验项目、备注字段，修改比例(40%)

@bug名称: 1634/物资与设备管理-材料管理-编辑取样单：取样明细部分字段【取样数量】输入值后保存报错
@开发人员: 董渊海
@修改日期: 2020-04-15
@任务类型: 修改代码，修复该bug，修改比例(4%)
-->
<template>
  <div class="right-panel indexWrapper">
    <div class="form-a">
      <el-form ref="form" :model="form" :rules="formRule" label-positon="left" label-width="180px">
        <el-form-item label="取样人员" prop="inspectorName">
          <el-input v-model="form.inspectorName" :readonly="true" style="width: 400px;" placeholder="请选择"></el-input
          >&nbsp;
          <a @click="showModalPerson">选择人员</a>
        </el-form-item>
        <el-form-item label="取样时间" prop="inspectTime">
          <el-date-picker
            v-model="form.inspectTime"
            type="datetime"
            style="width: 400px;"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="采购单" prop="purchaseCode">
          <el-input v-model="form.purchaseCode" :readonly="true" style="width: 400px;" placeholder="请选择"></el-input
          >&nbsp;
          <a @click="showModalPurchaseOrder">选择采购单</a>
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
    </div>

    <div class="form-b">
      <div class="form-b-head">取样明细</div>
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
          <!--
        /**
         任务名称： 物资与设备管理-材料管理-取样单-新增-1.缺少一列【序号】2.【生产时间】改为【生产日期】，不需要时分秒
         开发人员：崔洛宜
         日期：2020-03-30
         BUG类型：测试人员发现的研发自测未通过引起的BUG
         **/
      -->
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
          <vxe-table-column field="materialName" title="名称"></vxe-table-column>
          <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="supplierName" title="供应商名称"></vxe-table-column>
          <vxe-table-column
            field="batchNum"
            title="批号"
            :edit-render="{
              name: 'input',
              attrs: { type: 'text' }
            }"
          ></vxe-table-column>
          <!--
       /**
        任务名称： 物资与设备管理-材料管理-取样单-新增-1.缺少一列【序号】2.【生产时间】改为【生产日期】，不需要时分秒
        开发人员：崔洛宜
        日期：2020-03-30
        BUG类型：测试人员发现的研发自测未通过引起的BUG
        **/
     -->
          <!--<vxe-table-column
            field="manufactureTime"
            title="生产时间"
            :edit-render="{
              name: 'ElDatePicker',
              props: { type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss' }
            }"
            width="204"
          ></vxe-table-column>-->
          <vxe-table-column
            field="manufactureTime"
            title="生产日期"
            :edit-render="{
              name: 'ElDatePicker',
              props: { type: 'datetime', format: 'yyyy-MM-dd' }
            }"
            width="204"
          ></vxe-table-column>
          <vxe-table-column
            field="samplingAmount"
            title="取样数量"
            :edit-render="{
              name: 'input',
              attrs: { type: 'number' },
              events: { change: samplingAmountChangeEvent }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="inspectContent"
            title="检验项目"
            :edit-render="{
              name: '$input',
              props: { type: 'text' }
            }"
          ></vxe-table-column>
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
      :visible.sync="visiblePurchaseOrder"
      @disposeSelectRow="disposeSelectPurchaseOrder"
    ></ModalPurchaseOrder>
    <ModalPerson :visible.sync="visiblePerson" @disposeSelectRow="disposeSelectperson"></ModalPerson>
    <!-- /**
       任务名称：2698/取样单修改
       开发人员：崔洛宜
       日期：2020-03-24
       任务类型：修改逻辑结构
       **/-->
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
import Api from '@/api/device/material/samplingOrder'
import FileApi from '@/api/file'
export default {
  name: 'AddSamplingOrder',
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
        remark: ''
      },
      formRule: {
        inspectorName: [{ required: true, message: '请选择取样人员' }],
        inspectTime: [{ required: true, message: '请选择取样时间' }],
        purchaseCode: [{ required: true, message: '请选择采购单' }]
      },
      fileList: [],
      fileUrlList: [],
      visiblePurchaseOrder: false,
      visiblePerson: false,
      visibleOrderList: false,
      tableData: []
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
           任务名称：2698/取样单修改
           开发人员：崔洛宜
           日期：2020-03-24
           任务类型：修改逻辑结构
           **/
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
    samplingAmountChangeEvent({ row }, e) {
      row.samplingAmount = e.target.value
    },
    showModalPurchaseOrder() {
      this.visiblePurchaseOrder = true
    },
    showModalPerson() {
      this.visiblePerson = true
    },
    /**
       任务名称：2698/取样单修改
       开发人员：崔洛宜
       日期：2020-03-24
       任务类型：修改逻辑结构
       **/
    handleAdd() {
      //显示采购明细模态框
      if (!this.form.purchaseId) {
        this.$message.error('请先选择一个采购单')
        return
      }
      this.visibleOrderList = true
    },
    disposeSelectPurchaseOrder(selectRow) {
      /**
       任务名称：2698/取样单修改
       开发人员：崔洛宜
       日期：2020-03-24
       任务类型：修改逻辑结构
       **/
      this.form.purchaseCode = selectRow.dispatchCode
      this.form.purchaseId = selectRow.id
    },
    disposeSelectperson(selectRow) {
      this.form.inspectorName = selectRow.realName
      this.form.inspector = selectRow.id
    },
    /**
     任务名称：2698/取样单修改
     开发人员：崔洛宜
     日期：2020-03-24
     任务类型：修改逻辑结构
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
        batchNum: '',
        manufactureTime: null,
        samplingAmount: 0,
        inspectContent: ''
      }
      this.tableData.push(obj)
      this.$refs.xTable.setActiveRow(obj)
    },
    /**
     任务名称：2698/取样单修改
     开发人员：崔洛宜
     日期：2020-03-24
     任务类型：修改逻辑结构
     **/
    saveRowEvent(row) {
      console.log(row)
      let batchNum = row.batchNum
      if (!batchNum) {
        this.$message.error('批次不能为空')
        return
      }
      let manufactureTime = row.manufactureTime
      if (!manufactureTime) {
        this.$message.error('生产日期不合法')
        return
      }
      let samplingAmount = row.samplingAmount + ''
      if (
        samplingAmount === '0' ||
        samplingAmount === '' ||
        samplingAmount.indexOf('0') === 0 ||
        samplingAmount.indexOf('-') !== -1
      ) {
        this.$message.error('取样数量不合法')
        return
      }
      let inspectContent = row.inspectContent
      if (!inspectContent) {
        this.$message.error('检验项目不能为空')
        return
      }
      this.$refs.xTable.clearActived().then(() => {
        //console.log(row)
      })
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
        this.$message.error(`请保存 取样明细 第${indexActive}行记录，再做该操作`)
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
      this.$refs.xTable.remove(row)
      this.$refs.xTable.updateFooter()
    },

    onCancel() {
      this.$router.back()
    },
    handleSave() {
      /**
       任务名称：2698/取样单修改
       开发人员：崔洛宜
       日期：2020-03-24
       任务类型：修改逻辑结构
       **/
      //校验保存状态是否关闭
      if (this.validSaveStatus()) {
        return
      }
      let list = [...this.tableData].map(item => {
        return {
          purchaseDetailId: item.purchaseDetailId,
          batchNum: item.batchNum,
          manufactureTime: moment(item.manufactureTime).format('YYYY-MM-DD HH:MM:SS'),
          samplingAmount: item.samplingAmount,
          inspectContent: item.inspectContent,
          remark: item.remark
        }
      })
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            Api.updateOrder({
              ...this.form,
              projectId: this.projectId,
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
