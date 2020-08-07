<!--
@任务名称: 1355/开发环境input事件类型没有报错，但是线上环境报错
@开发人员: 董渊海
@修改日期: 2020-03-31
@任务类型: 修改代码，将input事件类型修改为change，修改比例(1%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 59853e620c5d96d0dab46c54c6bd564896eec168
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，完成 租赁单列表查询接口对接(80%)，新增租赁单界面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 30d0953c4a78d9a7fe4e41d80840a6e8643bfc98
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，选择租赁计划模态框调整，选择合同模态框添加合同类型参数控制
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 19e660f1b658104f720580f3167a2b2bb04ae1e3
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，租赁单 新增租赁单时，查询租赁合同明细与租赁计划明细的交集(40%)
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: e04dcf4a7120d82136af418984d5c7ad6cd64082
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，完成 租赁单 新增租赁单时，查询租赁合同明细与租赁计划明细的交集业务；新增租赁单接口对接；租赁单列表功能；编辑租赁单接口对接；保存提交功能；删除租赁单接口对接；详情接口对接；详情界面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 901c4352adfa5e8f697bbdb5d6ba5894fe4838eb
@代码提交修改日期: 2020-03-07
@任务类型: 修改代码，租赁单需求变动 去掉租赁单金额、合价、合计，添加实际开始时间和实际结束时间(接口未对接)
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: edaef18d4be0b375e110fd81486e140300f62f44
@代码提交修改日期: 2020-03-09
@任务类型: 修改代码，租赁单和租赁单审核模块，对接实际开始时间字段和实际结束时间字段
@补加代码注释日期: 2020-04-11

@bug名称: 1658/物资与设备管理->物资设备计划->租赁单：编辑页面，删除上传的附件保存成功后，在详情页，删除的附件还在
@开发人员: 董渊海
@修改日期: 2020-04-16
@任务类型: 修改代码，修复该bug，修改比例(2%)
-->
<template>
  <div class="right-panel">
    <div class="form-a">
      <el-form ref="form" :model="form" :rules="formRules" label-positon="left" label-width="180px">
        <el-form-item v-if="form.id ? true : false" label="租赁单编号">
          <el-input :value="form.dispatchCode" disabled style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="租赁计划" prop="planCode">
          <el-input v-model="form.planCode" :readonly="true" style="width: 400px;" placeholder="请选择"></el-input
          >&nbsp;
          <a @click="showModalLeasePlan">选择租赁计划</a>
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-input
            v-model="form.supplierName"
            :disabled="true"
            style="width: 400px;"
            placeholder="关联合同中的乙方"
          ></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractCode">
          <el-input v-model="form.contractCode" :readonly="true" style="width: 400px;" placeholder="请选择"></el-input
          >&nbsp;
          <a @click="showModalContract">选择合同</a>
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
      <div class="form-b-head">租赁明细</div>
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
          <vxe-table-column
            field="dispatchAmount"
            title="租赁数量"
            :edit-render="{ name: 'input', attrs: { type: 'number' }, events: { change: dispatchAmountChangeEvent } }"
          ></vxe-table-column>
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
            field="startTime"
            title="实际开始时间"
            :edit-render="{
              name: 'ElDatePicker',
              props: { type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss' }
            }"
            width="204"
          ></vxe-table-column>
          <vxe-table-column
            field="endTime"
            title="实际结束时间"
            :edit-render="{
              name: 'ElDatePicker',
              props: { type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss' }
            }"
            width="204"
          ></vxe-table-column>
          <vxe-table-column
            field="remark"
            title="备注"
            :edit-render="{ name: 'textarea', attrs: { type: 'text' } }"
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

    <ModalLeasePlan :visible.sync="visibleLeasePlan" @optionSelectRecord="optionSelectRecordLeasePlan"></ModalLeasePlan>
    <ModalContract
      :visible.sync="visibleContract"
      :contractType="contractType"
      @optionSelectRecord="optionSelectRecordContract"
    ></ModalContract>
  </div>
</template>

<script>
import ModalLeasePlan from './modalLeasePlan'
import ModalContract from '../components/modalContract'
import Api from '@/api/device/goodsPlan/leaseOrder'
import FileApi from '@/api/file'
export default {
  name: 'AddLeaseOrder',
  components: { ModalLeasePlan, ModalContract },
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
        fileId: '',
        remark: '',
        supplierId: '',
        supplierName: '',
        projectId: localStorage.getItem('projectId'),
        list: [],
        type: '2' //代表租赁单
      },
      formRules: {
        planCode: [{ required: true, message: '请选择租赁计划' }],
        contractCode: [{ required: true, message: '请选择合同' }]
      },
      tableData: [],

      visibleLeasePlan: false,
      visibleContract: false,
      contractType: ''
    }
  },
  mounted() {
    this.form.id = this.$route.params.id ? this.$route.params.id : ''
    if (this.form.id) {
      Api.getLeaseOrderDetail(this.form.id).then(res => {
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
    showModalLeasePlan() {
      this.visibleLeasePlan = true
    },
    showModalContract() {
      this.visibleContract = true
      this.contractType = '4'
    },
    optionSelectRecordLeasePlan(record) {
      this.form.planId = record.id
      this.form.planCode = record.planCode
      this.getLeaseDetailList()
    },
    optionSelectRecordContract(record) {
      this.form.supplierName = record.secondParty
      this.form.contractCode = record.code
      this.form.contractId = record.id
      this.getLeaseDetailList()
    },
    getLeaseDetailList() {
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
          let leaseRes = res[0].data
          let contractRes = res[1].data
          let shareDetail = []
          if (leaseRes && contractRes) {
            let leaseDetail = leaseRes
            let contractDetail = contractRes.records
            if (leaseDetail.length && contractDetail.length) {
              for (let i = 0; i < leaseDetail.length; i++) {
                for (let j = 0; j < contractDetail.length; j++) {
                  if (leaseDetail[i].materialId === contractDetail[j].materialId) {
                    shareDetail.push({
                      materialId: leaseDetail[i].materialId,
                      materialCode: leaseDetail[i].materialCode,
                      materialName: leaseDetail[i].materialName,
                      specification: leaseDetail[i].specification,
                      unit: leaseDetail[i].unit,
                      dispatchAmount: 0,
                      unitPrice: contractDetail[j].unitPrice,
                      materialType: leaseDetail[i].materialType,
                      materialKind: leaseDetail[i].materialKind,
                      remark: leaseDetail[i].remark,
                      startTime: '',
                      endTime: '',
                      validAmount:
                        leaseDetail[i].materialAmount >= contractDetail[j].quantity
                          ? contractDetail[j].quantity
                          : leaseDetail[i].materialAmount
                    })
                  }
                }
              }
            }
          }
          this.tableData = shareDetail
          if (shareDetail.length === 0) {
            this.$message.info('无租赁明细，请前往“租赁合同”进行“清单关联”操作。')
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
      let startTime = row.startTime
      let endTime = row.endTime

      if (
        dispatchAmount === '0' ||
        dispatchAmount === '' ||
        dispatchAmount.indexOf('0') === 0 ||
        dispatchAmount.indexOf('.') !== -1 ||
        dispatchAmount.indexOf('-') !== -1
      ) {
        this.$message.error('租赁数量不合法')
        return
      }

      if (parseFloat(dispatchAmount) > row.validAmount) {
        this.$message.error('租赁数量不能超过最大租赁数量')
        return
      }

      if (startTime === '' || startTime === null) {
        this.$message.error('请选择实际开始时间')
        return
      }

      if (endTime === '' || endTime === null) {
        this.$message.error('请选择实际结束时间')
        return
      }

      startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
      endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss')
      let st = new Date(startTime).getTime()
      let et = new Date(endTime).getTime()
      if (st >= et) {
        this.$message.error('实际开始时间必须大于实际结束时间')
        return
      }

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

    validSaveStatus() {
      let indexActive = null
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.$refs.xTable.isActiveByRow(this.tableData[i])) {
          indexActive = i + 1
          break
        }
      }
      if (indexActive) {
        this.$message.error(`请保存 租赁明细 第${indexActive}行记录，再做该操作`)
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

      //校验租赁数量是否合法、明细时间是否合法
      let indexAmount = null
      let indexStartTime = null
      let indexEndTime = null
      let indexTime = null
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
        this.$message.error(`租赁明细 第${indexAmount}行记录的租赁数量不合法`)
        return
      }
      if (indexStartTime) {
        this.$message.error(`租赁明细 第${indexStartTime}行记录的实际开始时间不合法`)
        return
      }
      if (indexEndTime) {
        this.$message.error(`租赁明细 第${indexEndTime}行记录的实际结束时间不合法`)
        return
      }
      if (indexTime) {
        this.$message.error(`租赁明细 第${indexTime}行记录的实际结束时间必须大于实际开始时间`)
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
              //totalPrice: parseFloat(item.dispatchAmount) * parseFloat(item.unitPrice),
              unitPrice: item.unitPrice,
              startTime: moment(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
              endTime: moment(item.endTime).format('YYYY-MM-DD HH:mm:ss')
            })
          })
          this.form.list = list
          //console.log(this.form)
          if (isSubmit) {
            //是否提交
            this.form.status = 1
          }
          if (this.form.id) {
            Api.editLeaseOrder(this.form).then(res => {
              this.$message.success('编辑成功')
              this.$router.push({ name: 'LeaseOrder' })
            })
          } else {
            Api.addLeaseOrder(this.form).then(res => {
              this.$message.success('新增成功')
              this.$router.push({ name: 'LeaseOrder' })
            })
          }
        }
      })
    },
    handleSaveSubmit() {
      this.handleSave(1)
    },
    handleCancel() {
      this.$router.push({ name: 'LeaseOrder' })
    },
    setFileId(fileIds) {
      //console.log(fileIds)
      this.form.fileId = fileIds.join(',')
    }
  }
}
</script>

<style scoped lang="less"></style>
