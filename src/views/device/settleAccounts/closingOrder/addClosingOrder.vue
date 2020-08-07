<!--
@任务名称: 1355/开发环境input事件类型没有报错，但是线上环境报错
@开发人员: 董渊海
@修改日期: 2020-03-31
@任务类型: 修改代码，将input事件类型修改为change，修改比例(5%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 543ebac50c423a475a1b21b616f09b34e8269555
@代码提交修改日期: 2020-03-10
@任务类型: 修改代码，物资租赁结算单 租赁单模态框接口调整，新增物资租赁结算单接口对接，新增物资租赁结算单界面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 5d3e1ae10ea970563d7ad1aa289138e63b348e46
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资租赁结算单 新增接口参数调整，添加结算金额、结算时间校验
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: ae534b410c148fda9e347871bf82ada349aaf3ea
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资租赁结算单 编辑接口对接，结算单列表接口对接，详情接口对接，并重新调整租赁结算单详情页样式
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 707075396d45ffaf3e980f32348af96fed37f273
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资租赁结算单 删除接口对接，审核列表接口对接，审核提交接口对接，添加审核详情页，审核页和详情页样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: aa271a58ba0d70ae4dd055a7770cd976e170e3e4
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资租赁结算单 编辑时，结算明细id处理为租赁明细id；发起人查看详情页时，添加审核结果模块
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="form-a">
      <el-form ref="form" :model="form" :rules="formRules" label-positon="left" label-width="180px">
        <el-form-item label="租赁单编号" prop="rentBillCode">
          <el-input v-model="form.rentBillCode" :readonly="true" style="width: 400px;" placeholder="请选择"></el-input
          >&nbsp;
          <a @click="showModalLeaseOrder">选择租赁单</a>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractCode">
          <el-input v-model="form.contractCode" :readonly="true" style="width: 400px;" placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="结算金额" prop="settlementAmount">
          <el-input v-model="form.settlementAmount" :readonly="true" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="上传" prop="files">
          <FileUpload :fileRecover="fileList" @input="setFileId" />
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
      <div class="form-b-head">结算明细</div>
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
          <vxe-table-column field="rentAmount" title="数量"></vxe-table-column>
          <vxe-table-column
            field="startTime"
            title="结算开始时间"
            :edit-render="{
              name: 'ElDatePicker',
              props: { type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss' },
              events: { change: startTimeChangeEvent }
            }"
            width="204"
          ></vxe-table-column>
          <vxe-table-column
            field="endTime"
            title="结算结束时间"
            :edit-render="{
              name: 'ElDatePicker',
              props: { type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss' },
              events: { change: endTimeChangeEvent }
            }"
            width="204"
          ></vxe-table-column>
          <vxe-table-column field="days" title="结算天数"></vxe-table-column>
          <vxe-table-column field="unitPrice" title="合同单价(元)"></vxe-table-column>
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
            field="currentSettledAmount"
            title="结算金额(元)"
            :edit-render="{ name: 'input', attrs: { type: 'number' }, events: { change: changeCurrentSettledAmount } }"
            width="80"
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
        @click="
          () => {
            handleSave(0)
          }
        "
        >保存</el-button
      >
      <el-button type="primary" @click="handleSaveSubmit">保存并提交</el-button>
    </div>

    <ModalLeaseOrder
      :visible.sync="visibleLeaseOrder"
      @optionSelectRecord="optionSelectRecordLeaseOrder"
    ></ModalLeaseOrder>
  </div>
</template>

<script>
import ModalLeaseOrder from './modalLeaseOrder'
import Api from '@/api/device/settleAccounts/closingOrder'
import FileApi from '@/api/file'
export default {
  name: 'AddClosingOrder',
  components: { ModalLeaseOrder },
  data() {
    return {
      fileList: [],
      form: {
        id: '',
        projectId: localStorage.getItem('projectId'),
        rentBillCode: '',
        contractCode: '',
        settlementAmount: 0,
        remark: '',
        list: [],
        fileId: null
      },
      formRules: {
        rentBillCode: [{ required: true, message: '请选择租赁单编号' }],
        contractCode: [{ required: true, message: '请选择合同编号' }]
      },
      visibleLeaseOrder: false,
      tableData: []
    }
  },
  mounted() {
    this.form.id = this.$route.params.id ? this.$route.params.id : ''
    if (this.form.id) {
      Api.getClosingOrderDetailById(this.form.id).then(res => {
        let data = res.data
        if (data) {
          this.form = data
          this.tableData = this.form.list

          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].id = this.tableData[i].rentSettlementDetailId //编辑时，这里的id不再是结算明细id，而是租赁明细id；保存时，无论新增还是编辑，id总是租赁明细id
            this.tableData[i].days = this.getLeaseDay(this.tableData[i].startTime, this.tableData[i].endTime)
          }

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
    changeCurrentSettledAmount({ row }, e) {
      row.currentSettledAmount = e.target.value
    },
    startTimeChangeEvent({ row }, e) {
      if (e && row.endTime) {
        row.days = this.getLeaseDay(e, row.endTime)
        this.$refs.xTable.syncData()
      }
    },
    endTimeChangeEvent({ row }, e) {
      if (e && row.startTime) {
        row.days = this.getLeaseDay(row.startTime, e)
        this.$refs.xTable.syncData()
      }
    },
    saveRowEvent(row) {
      let currentSettledAmount = parseFloat(row.currentSettledAmount) + ''
      let startTime = row.startTime
      let endTime = row.endTime

      if (
        currentSettledAmount === 'NaN' ||
        currentSettledAmount === '0' ||
        currentSettledAmount === '' ||
        currentSettledAmount.indexOf('-') !== -1
      ) {
        this.$message.error('结算金额不合法')
        return
      }

      if (startTime === '' || startTime === null) {
        this.$message.error('请选择结算开始时间')
        return
      }

      if (endTime === '' || endTime === null) {
        this.$message.error('请选择结算结束时间')
        return
      }

      startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
      endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss')
      let st = new Date(startTime).getTime()
      let et = new Date(endTime).getTime()
      if (st >= et) {
        this.$message.error('结算结束时间必须大于结算开始时间')
        return
      }

      this.$refs.xTable.clearActived().then(() => {
        //console.log(row)
        row.currentSettledAmount = currentSettledAmount
        this.$refs.xTable.syncData()

        //this.$refs.xTable.updateFooter()

        let total = 0
        this.tableData.map(item => {
          total += parseFloat(item.currentSettledAmount)
        })
        this.form.settlementAmount = total
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
      }
    },
    getLeaseDay(s, e) {
      let st = new Date(s).getTime()
      let et = new Date(e).getTime()

      let val = Math.abs(st - et)
      let days = Math.floor(val / (24 * 3600 * 1000))
      return days
    },

    showModalLeaseOrder() {
      this.visibleLeaseOrder = true
    },
    optionSelectRecordLeaseOrder(record) {
      this.form.rentBillCode = record.dispatchCode
      this.form.contractCode = record.contractCode
      //结算明细回显
      Api.getLeaseOrderDetail(record.id).then(res => {
        let data = res.data
        if (data) {
          this.tableData = data.list
          this.tableData.map(item => {
            item.currentSettledAmount = '0'
            item.days = this.getLeaseDay(item.startTime, item.endTime)
            item.rentAmount = item.dispatchAmount //数量
          })
          this.form.settlementAmount = 0
        }
      })
    },
    footerMethod({ columns, data }) {
      let result = [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['currentSettledAmount'].includes(column.property)) {
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
        this.$message.error(`请保存 结算明细 第${indexActive}行记录，再做该操作`)
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

      this.$refs.form.validate(valid => {
        if (valid) {
          //校验结算金额是否合法、明细时间是否合法
          let indexAmount = null
          let indexStartTime = null
          let indexEndTime = null
          let indexTime = null
          for (let i = 0; i < this.tableData.length; i++) {
            let currentSettledAmount = this.tableData[i].currentSettledAmount + ''
            if (
              currentSettledAmount === 'NaN' ||
              currentSettledAmount === '0' ||
              currentSettledAmount === '' ||
              currentSettledAmount.indexOf('-') !== -1
            ) {
              indexAmount = i + 1
              break
            }

            let startTime = this.tableData[i].startTime
            let endTime = this.tableData[i].endTime
            if (startTime === '') {
              indexStartTime = i + 1
              break
            }
            if (endTime === '') {
              indexEndTime = i + 1
              break
            }

            let st = new Date(startTime).getTime()
            let et = new Date(endTime).getTime()
            if (st >= et) {
              indexTime = i + 1
              break
            }
          }
          if (indexAmount) {
            this.$message.error(`结算明细 第${indexAmount}行记录的结算金额不合法`)
            return
          }
          if (indexStartTime) {
            this.$message.error(`结算明细 第${indexStartTime}行记录的结算开始时间不合法`)
            return
          }
          if (indexEndTime) {
            this.$message.error(`结算明细 第${indexEndTime}行记录的结算结束时间不合法`)
            return
          }
          if (indexTime) {
            this.$message.error(`结算明细 第${indexTime}行记录的结算结束时间必须大于结算开始时间`)
            return
          }

          let list = []
          this.tableData.map(item => {
            list.push({
              rentSettlementDetailId: item.id, //item.id为租赁明细id
              materialId: item.materialId,
              currentSettledAmount: item.currentSettledAmount,
              startTime: moment(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
              endTime: moment(item.endTime).format('YYYY-MM-DD HH:mm:ss')
            })
          })
          this.form.list = list

          if (isSubmit) {
            //是否提交
            this.form.status = 1
          }
          if (this.form.id) {
            Api.editClosingOrder(this.form).then(res => {
              this.$message.success('编辑成功')
              this.$router.push({ name: 'ClosingOrder' })
            })
          } else {
            Api.addClosingOrder(this.form).then(res => {
              this.$message.success('保存成功')
              this.$router.push({ name: 'ClosingOrder' })
            })
          }
        }
      })
    },
    handleSaveSubmit() {
      this.handleSave(1)
    },
    handleCancel() {
      this.$router.push({ name: 'ClosingOrder' })
    },
    setFileId(fileIds) {
      //console.log(fileIds)
      this.form.fileId = fileIds.join(',') ? fileIds.join(',') : null
    }
  }
}
</script>

<style scoped lang="less"></style>
