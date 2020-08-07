<!--
@任务名称: 1363/租赁计划-新增和编辑页面-租赁数量显示不全
@开发人员: 董渊海
@修改日期: 2020-03-30
@任务类型: 修改代码，修改比例(1%)

@任务名称: 1355/开发环境input事件类型没有报错，但是线上环境报错
@开发人员: 董渊海
@修改日期: 2020-03-31
@任务类型: 修改代码，将input事件类型修改为change，修改比例(5%)

@bug名称: 1349/物资设备计划-需用计划&租赁计划-编辑页面-选择总物资计划-确定点了没反应；【保存】和【保存并提交】按钮也是点了没反应
@开发人员: 董渊海
@修改日期: 2020-03-31
@任务类型: 修改代码，修复上述操作无反应问题，修改比例(1%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 17b336f4058bf4489a328ddcf5cec6d254a6aee7
@代码提交修改日期: 2020-03-02
@任务类型: 修改代码，完成 租赁计划 列表接口对接，新增接口对接，新增租赁计划界面样式调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: a74da7dc7e71c59157a162834f366036a32ebc99
@代码提交修改日期: 2020-03-03
@任务类型: 修改代码，新增租赁计划 添加时间校验细节
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: bd20b60ac90cb91079ad631ed6cfc6f771b0f08b
@代码提交修改日期: 2020-03-03
@任务类型: 修改代码，完成 租赁计划 编辑接口对接，详情接口对接，删除接口对接，详情页样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: fdc336ee5e7a943ee462904447d7c1e363a7218e
@代码提交修改日期: 2020-03-03
@任务类型: 修改代码，租赁明细 添加租赁天数计算
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: dc31821aaea172ad4d3f0b9ce3764ac7212999d5
@代码提交修改日期: 2020-03-07
@任务类型: 修改代码，租赁计划需求变动 去掉开始时间组件、结束时间组件
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="form-a">
      <el-form ref="form" :model="form" :rules="formRules" label-positon="left" label-width="180px">
        <el-form-item v-if="form.id ? true : false" label="租赁计划编号">
          <el-input :value="form.planCode" disabled style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="租赁计划名称" prop="name">
          <el-input v-model="form.name" style="width: 400px;" placeholder="请输入租赁计划名称"></el-input>
        </el-form-item>
        <!--<el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            style="width: 400px"
            type="datetime"
            default-time="00:00:00"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            style="width: 400px"
            type="datetime"
            default-time="23:59:59"
          ></el-date-picker>
        </el-form-item>-->
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
          <vxe-table-column field="unit" title="单位" width="50"></vxe-table-column>
          <vxe-table-column
            field="materialAmount"
            title="租赁数量"
            :edit-render="{ name: 'input', attrs: { type: 'number' }, events: { change: materialAmountChangeEvent } }"
          ></vxe-table-column>
          <vxe-table-column
            field="enterTime"
            title="计划进场时间"
            :edit-render="{
              name: 'ElDatePicker',
              props: { type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss' },
              events: { change: enterTimeChangeEvent }
            }"
            width="204"
          ></vxe-table-column>
          <vxe-table-column
            field="exitTime"
            title="计划退场时间"
            :edit-render="{
              name: 'ElDatePicker',
              props: { type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss' },
              events: { change: exitTimeChangeEvent }
            }"
            width="204"
          ></vxe-table-column>
          <vxe-table-column field="leaseDay" title="租赁天数"></vxe-table-column>
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
            width="100"
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
          <el-button class="btn-add" @click="showModalTotalMaterial">添加</el-button>
        </div>
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

    <ModalTotalMaterial
      :visible.sync="visibleTotalMaterial"
      :materialSource="materialSource"
      :validList="tableData"
      @disposeSelectRecord="disposeSelectRecord"
    ></ModalTotalMaterial>
  </div>
</template>

<script>
import ModalTotalMaterial from '@/views/device/goodsPlan/components/modalTotalMaterial'
import Api from '@/api/device/goodsPlan/leasePlan'
import FileApi from '@/api/file'
export default {
  name: 'AddLeasePlan',
  components: { ModalTotalMaterial },
  data() {
    return {
      fileList: [],
      form: {
        id: '',
        name: '',
        //startTime: '',
        //endTime: '',
        fileId: null,
        remark: '',
        projectId: localStorage.getItem('projectId'),
        type: '2' //代表租赁计划
      },
      formRules: {
        name: [{ required: true, message: '请输入需用计划名称' }]
        /*startTime: [{ required: true, message: '请选择开始时间' }],
        endTime: [{ required: true, message: '请选择结束时间' }]*/
      },
      tableData: [],

      visibleTotalMaterial: false,
      materialSource: ''
    }
  },
  mounted() {
    this.form.id = this.$route.params.id ? this.$route.params.id : ''
    if (this.form.id) {
      Api.getLeasePlanDetail(this.form.id).then(res => {
        let data = res.data
        if (data) {
          this.form = data
          this.tableData = this.form.list === null ? [] : this.form.list

          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].leaseDay = this.getLeaseDay(this.tableData[i].enterTime, this.tableData[i].exitTime)
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
    getLeaseDay(s, e) {
      let st = new Date(s).getTime()
      let et = new Date(e).getTime()

      let val = Math.abs(st - et)
      let days = Math.floor(val / (24 * 3600 * 1000))
      return days
    },
    materialAmountChangeEvent({ row }, e) {
      row.materialAmount = e.target.value
    },
    enterTimeChangeEvent({ row }, e) {
      if (e && row.exitTime) {
        row.leaseDay = this.getLeaseDay(e, row.exitTime)
      }
    },
    exitTimeChangeEvent({ row }, e) {
      if (e && row.enterTime) {
        row.leaseDay = this.getLeaseDay(row.enterTime, e)
      }
    },
    saveRowEvent(row) {
      let materialAmount = row.materialAmount + ''
      let enterTime = row.enterTime
      let exitTime = row.exitTime

      if (
        materialAmount === '0' ||
        materialAmount === '' ||
        materialAmount.indexOf('0') === 0 ||
        //materialAmount.indexOf('.') !== -1 || //bug号：1613、修改人：董渊海、修改时间：2020-04-15
        materialAmount.indexOf('-') !== -1
      ) {
        this.$message.error('租赁数量不合法')
        return
      }

      if (enterTime === '' || enterTime === null) {
        this.$message.error('请选择进场时间')
        return
      }

      if (exitTime === '' || exitTime === null) {
        this.$message.error('请选择退场时间')
        return
      }

      enterTime = moment(enterTime).format('YYYY-MM-DD HH:mm:ss')
      exitTime = moment(exitTime).format('YYYY-MM-DD HH:mm:ss')
      let it = new Date(enterTime).getTime()
      let ot = new Date(exitTime).getTime()
      if (it >= ot) {
        this.$message.error('退场时间必须大于进场时间')
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

    showModalTotalMaterial() {
      this.visibleTotalMaterial = true
      this.materialSource = '2'
    },
    disposeSelectRecord(record) {
      //console.log(record)
      let obj = {
        materialId: record.id,
        materialCode: record.materialCode,
        materialName: record.materialName,
        specification: record.specification,
        unit: record.unit,
        materialAmount: record.materialAmount,
        enterTime: '',
        exitTime: '',
        leaseDay: '0',
        materialType: record.materialType,
        materialKind: record.materialKind,
        remark: record.remark
      }
      this.tableData.push(obj)
      this.$refs.xTable.setActiveRow(obj)
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

      this.$refs.form.validate(valid => {
        if (valid) {
          /*this.form.startTime = moment(this.form.startTime).format('YYYY-MM-DD HH:mm:ss')
          this.form.endTime = moment(this.form.endTime).format('YYYY-MM-DD HH:mm:ss')*/

          //开始、结束时间校验
          /*let st = new Date(this.form.startTime).getTime()
          let et = new Date(this.form.endTime).getTime()
          if (st >= et) {
            this.$message.error('开始时间必须小于结束时间')
            return
          }*/

          //校验租赁数量是否合法、明细时间是否合法
          let indexAmount = null
          let indexInnerTime = null
          let indexOuterTime = null
          let indexTime1 = null
          let indexTime2 = null
          for (let i = 0; i < this.tableData.length; i++) {
            let materialAmount = this.tableData[i].materialAmount + ''
            if (
              materialAmount === '0' ||
              materialAmount === '' ||
              materialAmount.indexOf('0') === 0 ||
              //materialAmount.indexOf('.') !== -1 || //bug号：1613、修改人：董渊海、修改时间：2020-04-15
              materialAmount.indexOf('-') !== -1
            ) {
              indexAmount = i + 1
              break
            }

            let enterTime = this.tableData[i].enterTime
            let exitTime = this.tableData[i].exitTime
            if (enterTime === '') {
              indexInnerTime = i + 1
              break
            }
            if (exitTime === '') {
              indexOuterTime = i + 1
              break
            }

            let it = new Date(enterTime).getTime()
            let ot = new Date(exitTime).getTime()
            if (it >= ot) {
              indexTime1 = i + 1
              break
            }

            //开始时间<进场时间<结束时间
            /*if (it <= st || it >= et) {
              indexTime2 = i + 1
              break
            }*/
          }
          if (indexAmount) {
            this.$message.error(`租赁明细 第${indexAmount}行记录的租赁数量不合法`)
            return
          }
          if (indexInnerTime) {
            this.$message.error(`租赁明细 第${indexInnerTime}行记录的进场时间不合法`)
            return
          }
          if (indexOuterTime) {
            this.$message.error(`租赁明细 第${indexOuterTime}行记录的退场时间不合法`)
            return
          }
          if (indexTime1) {
            this.$message.error(`租赁明细 第${indexTime1}行记录的退场时间必须大于进场时间`)
            return
          }
          /*if (indexTime2) {
            this.$message.error(`租赁明细 第${indexTime2}行记录的进场时间必须大于开始时间，小于结束时间`)
            return
          }*/

          let list = []
          this.tableData.map(item => {
            list.push({
              materialId: item.materialId,
              materialAmount: item.materialAmount,
              enterTime: moment(item.enterTime).format('YYYY-MM-DD HH:mm:ss'),
              exitTime: moment(item.exitTime).format('YYYY-MM-DD HH:mm:ss'),
              remark: item.remark
            })
          })
          this.form.list = list
          if (isSubmit) {
            //是否提交
            this.form.status = 1
          }
          if (this.form.id) {
            Api.editLeasePlan(this.form).then(res => {
              this.$message.success('编辑成功')
              this.$router.push({ name: 'LeasePlan' })
            })
          } else {
            Api.addLeasePlan(this.form).then(res => {
              this.$message.success('新增成功')
              this.$router.push({ name: 'LeasePlan' })
            })
          }
        }
      })
    },
    handleSaveSubmit() {
      this.handleSave(1)
    },
    handleCancel() {
      this.$router.push({ name: 'LeasePlan' })
    },
    setFileId(fileIds) {
      //console.log(fileIds)
      this.form.fileId = fileIds.join(',') ? fileIds.join(',') : null
    }
  }
}
</script>

<style scoped lang="less"></style>
