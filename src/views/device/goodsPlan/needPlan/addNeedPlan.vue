<!--
@任务名称: 1355/开发环境input事件类型没有报错，但是线上环境报错
@开发人员: 董渊海
@修改日期: 2020-03-31
@任务类型: 修改代码，将input事件类型修改为change，修改比例(1%)

@bug名称: 1349/物资设备计划-需用计划&租赁计划-编辑页面-选择总物资计划-确定点了没反应；【保存】和【保存并提交】按钮也是点了没反应
@开发人员: 董渊海
@修改日期: 2020-03-31
@任务类型: 修改代码，修复上述操作无反应问题，修改比例(1%)

@bug名称: 1649/物资与设备管理->物资设备计划->需用计划：编辑页面，删除附件保存后，在查看页面删除的附件还在
@开发人员: 董渊海
@修改日期: 2020-04-16
@任务类型: 修改代码，修复该bug，修改比例(2%)
-->
<template>
  <div class="right-panel">
    <div class="form-a">
      <el-form ref="form" :model="form" :rules="formRules" label-positon="left" label-width="180px">
        <el-form-item v-if="form.id ? true : false" label="需用计划编号">
          <el-input :value="form.planCode" disabled style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="需用计划名称" prop="name">
          <el-input v-model="form.name" style="width: 400px;" placeholder="请输入需用计划名称"></el-input>
        </el-form-item>
        <el-form-item label="计量周期" prop="calculatePeriod">
          <el-date-picker
            v-model="form.calculatePeriod"
            type="month"
            style="width: 400px;"
            placeholder="请选择计量周期"
          ></el-date-picker>
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
      <div class="form-b-head">需用明细</div>
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
            field="materialAmount"
            title="需用数量"
            :edit-render="{ name: 'input', attrs: { type: 'number' }, events: { change: materialAmountChangeEvent } }"
          ></vxe-table-column>
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
import Api from '@/api/device/goodsPlan/needPlan'
import FileApi from '@/api/file'
export default {
  name: 'AddNeedPlan',
  components: { ModalTotalMaterial },
  data() {
    return {
      fileList: [],
      form: {
        id: '',
        name: '',
        calculatePeriod: '',
        fileId: '',
        remark: '',
        projectId: localStorage.getItem('projectId'),
        type: '1' //代表需用计划
      },
      formRules: {
        name: [{ required: true, message: '请输入需用计划名称' }],
        calculatePeriod: [{ required: true, message: '请选择计量周期' }]
      },
      tableData: [],

      visibleTotalMaterial: false,
      materialSource: ''
    }
  },
  mounted() {
    this.form.id = this.$route.params.id ? this.$route.params.id : ''
    if (this.form.id) {
      Api.getNeedPlanDetail(this.form.id).then(res => {
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
    materialAmountChangeEvent({ row }, e) {
      row.materialAmount = e.target.value
    },
    saveRowEvent(row) {
      let materialAmount = row.materialAmount + ''

      if (
        materialAmount === '0' ||
        materialAmount === '' ||
        materialAmount.indexOf('0') === 0 ||
        //materialAmount.indexOf('.') !== -1 || //bug号：1599、修改人：董渊海、修改时间：2020-04-15
        materialAmount.indexOf('-') !== -1
      ) {
        this.$message.error('需用数量不合法')
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
      this.materialSource = '1'
    },
    disposeSelectRecord(record) {
      //record.materialAmount = record.materialAmount ? record.materialAmount : 1
      let obj = {
        materialId: record.id,
        materialCode: record.materialCode,
        materialName: record.materialName,
        specification: record.specification,
        unit: record.unit,
        materialAmount: record.materialAmount,
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
        this.$message.error(`请保存 需用明细 第${indexActive}行记录，再做该操作`)
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

      //校验需用数量是否合法
      let indexAmount = null
      for (let i = 0; i < this.tableData.length; i++) {
        let materialAmount = this.tableData[i].materialAmount + ''
        if (
          materialAmount === '0' ||
          materialAmount === '' ||
          materialAmount.indexOf('0') === 0 ||
          //materialAmount.indexOf('.') !== -1 || //bug号：1599、修改人：董渊海、修改时间：2020-04-15
          materialAmount.indexOf('-') !== -1
        ) {
          indexAmount = i + 1
          break
        }
      }
      if (indexAmount) {
        this.$message.error(`需用明细 第${indexAmount}行记录的需用数量不合法`)
        return
      }

      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.calculatePeriod = moment(this.form.calculatePeriod).format('YYYY-MM')
          let list = []
          this.tableData.map(item => {
            list.push({
              materialId: item.materialId,
              materialAmount: item.materialAmount,
              remark: item.remark
            })
          })
          this.form.list = list
          //console.log(this.form)
          if (isSubmit) {
            //是否提交
            this.form.status = 1
          }
          if (this.form.id) {
            Api.editNeedPlan(this.form).then(res => {
              this.$message.success('编辑成功')
              this.$router.push({ name: 'NeedPlan' })
            })
          } else {
            Api.addNeedPlan(this.form).then(res => {
              this.$message.success('新增成功')
              this.$router.push({ name: 'NeedPlan' })
            })
          }
        }
      })
    },
    handleSaveSubmit() {
      this.handleSave(1)
    },
    handleCancel() {
      this.$router.push({ name: 'NeedPlan' })
    },
    setFileId(fileIds) {
      //console.log(fileIds)
      this.form.fileId = fileIds.join(',')
    }
  }
}
</script>

<style scoped lang="less"></style>
