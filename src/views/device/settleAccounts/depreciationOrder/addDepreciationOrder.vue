<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 03bc9435863f3f2d1377b33ddda1abbfdaa297e7
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，物资折旧单 列表接口对接(80%)、新增接口对接(60%)、新增界面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: b3a4aa7c259c85548859d00bdc08c147853936bc
@代码提交修改日期: 2020-03-12
@任务类型: 修改代码，物资折旧单 选择采购单和采购明细模态框组件开发，列表接口对接、新增接口对接、删除接口对接
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: b5e5a2177d49291f9e7b2997ee96dc6975731b83
@代码提交修改日期: 2020-03-12
@任务类型: 修改代码，物资折旧单 对接物资折旧单编辑接口、保存提交功能、详情查询接口、详情页样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: fd2ac15e720739e8275db8793f093db346dad53c
@代码提交修改日期: 2020-03-12
@任务类型: 修改代码，物资折旧单 累计折旧额业务调整(由于服务器换地方，该功能未进行测试)
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: d906c78dc9f7a6512b3656bf00f286ceab78df59
@代码提交修改日期: 2020-03-13
@任务类型: 修改代码，物资折旧单 累计折旧额业务功能调整(测试通过)
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="form-a">
      <el-form ref="form" :model="form" :rules="formRules" label-positon="left" label-width="180px">
        <el-form-item label="折旧物资编号">
          <el-input :value="materialCode" style="width: 400px;" placeholder="请选择物资" readonly></el-input>&nbsp;
          <a v-if="form.id === ''" @click="showModalDepreciationMaterial">选择物资</a>
        </el-form-item>
        <el-form-item label="折旧物资名称">
          <el-input :value="materialName" style="width: 400px;" placeholder="请选择物资" readonly></el-input>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input :value="specification" style="width: 400px;" placeholder="请选择物资" readonly></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input-number
            v-model="form.amount"
            style="width: 400px;"
            placeholder="请输入数量"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="计量单位" prop="calculateUnit">
          <el-input v-model="form.calculateUnit" style="width: 400px;" placeholder="请选择物资" readonly></el-input>
        </el-form-item>
        <el-form-item label="折旧年度" prop="depreciationYear">
          <el-date-picker
            v-model="form.depreciationYear"
            type="year"
            placeholder="请选择"
            value-format="yyyy"
            style="width: 400px;"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="折旧月份" prop="depreciationMonth">
          <el-date-picker
            v-model="form.depreciationMonth"
            type="month"
            placeholder="请选择"
            value-format="MM"
            style="width: 400px;"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="年折旧率" prop="yearlyDepreciation">
          <el-input-number
            v-model="form.yearlyDepreciation"
            :precision="2"
            :step="0.1"
            style="width: 400px;"
            placeholder="请输入年折旧率"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="月折旧额" prop="monthDepreciation">
          <el-input-number
            v-model="form.monthDepreciation"
            :precision="2"
            :step="0.1"
            style="width: 400px;"
            placeholder="请输入月折旧额"
            controls-position="right"
            @keyup.native="monthDepreciationKeyup"
            @change="monthDepreciationChange"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="折旧方式" prop="depreciationWay">
          <el-select v-model="form.depreciationWay" style="width: 400px;">
            <el-option label="年限法" value="1"></el-option>
            <el-option label="工作量法" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="累计折旧金额(元)" prop="depreciationAmount">
          <el-input
            v-model="form.depreciationAmount"
            style="width: 400px;"
            placeholder="请选择物资"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item label="上传">
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

    <div class="detail-c">
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

    <ModalDepreciationMaterial
      :visible.sync="visible"
      @optionSelectRecord="optionSelectRecordDepreciationMaterial"
    ></ModalDepreciationMaterial>
  </div>
</template>

<script>
import Api from '@/api/device/settleAccounts/depreciationOrder'
import FileApi from '@/api/file'
import ModalDepreciationMaterial from './modalDepreciationMaterial'
export default {
  name: 'AddDepreciationOrder',
  components: { ModalDepreciationMaterial },
  data() {
    return {
      materialId: '',
      materialCode: '',
      materialName: '',
      specification: '',
      fileList: [],
      form: {
        id: '',
        amount: undefined,
        calculateUnit: '',
        depreciationYear: '',
        depreciationMonth: '',
        yearlyDepreciation: undefined,
        monthDepreciation: undefined,
        depreciationWay: '',
        depreciationAmount: 0,
        remark: '',
        fileId: null
      },
      formRules: {
        amount: [{ required: true, message: '请输入数量' }],
        calculateUnit: [{ required: true, message: '请选择物资' }],
        depreciationYear: [{ required: true, message: '请选择折旧年度' }],
        depreciationMonth: [{ required: true, message: '请选择折旧月份' }],
        yearlyDepreciation: [{ required: true, message: '请选择输入年折旧率' }],
        monthDepreciation: [{ required: true, message: '请选择输入月折旧额' }],
        depreciationWay: [{ required: true, message: '请选择折旧方式' }]
      },
      visible: false,
      auditList: []
    }
  },
  mounted() {
    this.form.id = this.$route.params.id ? this.$route.params.id : ''
    if (this.form.id) {
      Api.getDepreciationOrderDetailById(this.form.id).then(res => {
        let data = res.data
        if (data) {
          this.form = data
          this.materialCode = data.materialCode
          this.materialName = data.materialName
          this.specification = data.specification
          this.form.depreciationYear = this.form.depreciationYear + ''
          let depreciationMonth = this.form.depreciationMonth + ''
          this.form.depreciationMonth = depreciationMonth.length === 1 ? '0' + depreciationMonth : depreciationMonth
          if (this.form.fileId) {
            let fileIds = this.form.fileId.split(',')
            FileApi.getFileList(fileIds).then(res => {
              if (res.data) {
                this.fileList = res.data
              }
            })
          }

          //根据物资编号且已通过的条件，来查询审核折旧记录
          Api.getDepreciationOrderList({
            projectId: localStorage.getItem('projectId'),
            content: data.materialCode,
            status: '2'
          }).then(res => {
            if (res.data && res.data.records && res.data.records.length) {
              this.auditList = res.data.records
            }
          })
        }
      })
    }
  },
  methods: {
    monthDepreciationKeyup(e) {
      let monthMoney = ''
      if (e.target.value !== '') {
        monthMoney = parseFloat(parseFloat(e.target.value).toFixed(2))
      }
      //console.log(monthMoney)
      this.countDepreciationAmount(monthMoney)
    },
    monthDepreciationChange(val) {
      //console.log(val)
      this.countDepreciationAmount(val)
    },
    countDepreciationAmount(val) {
      let total = 0
      this.auditList.map(item => {
        total += item.monthDepreciation
      })
      if (val === '') {
        val = 0
      }

      this.form.depreciationAmount = (val + total).toFixed(2)
    },
    showModalDepreciationMaterial() {
      this.visible = true
    },
    optionSelectRecordDepreciationMaterial(record) {
      //console.log(record)
      this.materialId = record.materialId
      this.materialCode = record.materialCode
      this.materialName = record.materialName
      this.specification = record.specification
      this.form.calculateUnit = record.unit

      //根据物资编号且已通过的条件，来查询审核折旧记录，计算累计折旧额
      Api.getDepreciationOrderList({
        projectId: localStorage.getItem('projectId'),
        content: record.materialCode,
        status: '2'
      }).then(res => {
        if (res.data && res.data.records) {
          if (res.data.records.length === 0) {
            this.form.depreciationAmount = 0
          } else {
            //该物资已审核通过的记录
            this.auditList = res.data.records

            let total = 0
            this.auditList.map(item => {
              total += item.monthDepreciation
            })
            this.form.depreciationAmount = total.toFixed(2)
          }
        }
      })
    },
    handleCancel() {
      this.$router.push({ name: 'DepreciationOrder' })
    },
    handleSave(isSubmit) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (isSubmit) {
            this.form.status = '1'
          }
          if (this.form.id) {
            Api.editDepreciationOrder({
              projectId: localStorage.getItem('projectId'),
              ...this.form
            }).then(res => {
              this.$message.success('编辑成功')
              this.$router.push({ name: 'DepreciationOrder' })
            })
          } else {
            Api.addDepreciationOrder({
              projectId: localStorage.getItem('projectId'),
              materialId: this.materialId,
              ...this.form
            }).then(res => {
              this.$message.success('新增成功')
              this.$router.push({ name: 'DepreciationOrder' })
            })
          }
        }
      })
    },
    handleSaveSubmit() {
      this.handleSave(1)
    },
    setFileId(fileIds) {
      //console.log(fileIds)
      this.form.fileId = fileIds.join(',') ? fileIds.join(',') : null
    }
  }
}
</script>

<style scoped lang="less"></style>
