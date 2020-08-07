<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: a74606ed9a55070d37c4e26d36532f523e607f32
@代码提交修改日期: 2020-03-07
@任务类型: 修改代码，合同项目经费核算 添加项目经费核算模态框
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: ca8df5134063d9d19758518a0c1648f511635333
@代码提交修改日期: 2020-03-07
@任务类型: 修改代码，合同项目经费核算 基本信息新增接口对接；配置预算项目明细信息
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 9be3e5c65eebd73fa421dd7692c70588a8ed0e99
@代码提交修改日期: 2020-03-09
@任务类型: 修改代码，合同项目经费核算 对接 项目经费核算列表接口，查询核算下的项目经费明细接口，项目经费明细新增(编辑)接口，添加项目经费核算明细详情页
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: b65fe7ac4a5ae22a6bbb5b31ac646558ce4ee2b7
@代码提交修改日期: 2020-03-10
@任务类型: 修改代码，合同项目经费核算 对接 项目经费核算编辑接口，删除接口，提交审核接口
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: d45705ffa3957e93557422bc2fb6adc1cccfbc24
@代码提交修改日期: 2020-03-11
@任务类型: 修改代码，合同项目经费核算 添加根据id查询合同项目经费核算详情接口，合同项目经费核算状态回显处理
@补加代码注释日期: 2020-04-11
-->
<template>
  <el-dialog :title="`${fundRecord.id ? '编辑' : '新增'}项目经费核算`" :visible="visible" @close="handleCancel">
    <el-form ref="form" :model="form" :rules="formRules" label-positon="left" label-width="120px">
      <el-form-item label="核算名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="核算日期" prop="accountDate">
        <el-date-picker
          v-model="form.accountDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="请选择"
          end-placeholder="请选择"
          :default-time="['00:00:00', '23:59:59']"
          style="width: 80%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="2"
          placeholder="请输入备注"
          style="width: 80%;"
        ></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <template v-if="fundRecord.id">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleNext">下一步</el-button>
      </template>
      <template v-else>
        <el-button type="primary" @click="handleSaveNext">下一步</el-button>
      </template>
      <el-button @click="handleCancel">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/api/cost/contractProjectsFunding'
export default {
  name: 'ModalEditFund',
  props: {
    visible: Boolean,
    fundRecord: Object
  },
  data() {
    return {
      creatorName: this.$store.getters.name,
      createTime: new Date(),
      form: {
        name: '',
        accountDate: '',
        remark: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入项目经费核算名称' }],
        accountDate: [{ required: true, message: '请选择核算日期' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.fundRecord.id) {
          this.form.name = this.fundRecord.name
          this.form.accountDate = [
            moment(this.fundRecord.accountingStartDate),
            moment(this.fundRecord.accountingEndDate)
          ]
          this.form.remark = this.fundRecord.remark
        }
      }
    }
  },
  methods: {
    handleCancel() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let accountingStartDate = moment(this.form.accountDate[0]).format('YYYY-MM-DD HH:mm:ss')
          let accountingEndDate = moment(this.form.accountDate[1]).format('YYYY-MM-DD HH:mm:ss')

          Api.editCostExpenditureAccounting({
            id: this.fundRecord.id,
            projectId: localStorage.getItem('projectId'),
            name: this.form.name,
            accountingStartDate,
            accountingEndDate,
            remark: this.form.remark
          }).then(res => {
            this.$message.success('基本信息保存成功')
            this.$refs.form.resetFields()
            this.$emit('update:visible', false)
            this.$emit('refreshList')
          })
        }
      })
    },
    handleNext() {
      this.$emit('update:visible', false)
      window.setTimeout(() => {
        this.$router.push({ name: `FundListEdit`, params: { expenditureId: this.fundRecord.id, isEdit: true } })
      })
    },
    handleSaveNext() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let accountingStartDate = moment(this.form.accountDate[0]).format('YYYY-MM-DD HH:mm:ss')
          let accountingEndDate = moment(this.form.accountDate[1]).format('YYYY-MM-DD HH:mm:ss')

          Api.addCostExpenditureAccounting({
            projectId: localStorage.getItem('projectId'),
            name: this.form.name,
            accountingStartDate,
            accountingEndDate,
            remark: this.form.remark
          }).then(res => {
            this.$message.success('基本信息保存成功')
            this.$refs.form.resetFields()
            this.$emit('update:visible', false)
            window.setTimeout(() => {
              this.$router.push({ name: `FundListAdd`, params: { expenditureId: res.data } })
            }, 500)
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
