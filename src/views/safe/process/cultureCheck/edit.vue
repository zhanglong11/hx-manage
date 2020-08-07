<!--
* @任务编号: 2824 || 首页接口对接
* @开发人员:张龙
* @日期:2020-03-11
* @任务类型:全新代码
-->
<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
        <el-form-item label="检查计划编号" prop="civilizationCheckNumber">
          <div style="display: flex;">
            <el-input v-model="form.civilizationCheckNumber" disabled />
            <el-button type="text" @click="showPeopleDialog">选择安全文明计划</el-button>
          </div>
        </el-form-item>
        <el-form-item label="关键部位" prop="placeName">
          <el-input v-model="form.placeName" />
        </el-form-item>
        <el-form-item label="验收要求" prop="requirements">
          <el-input v-model="form.requirements" />
        </el-form-item>
        <el-form-item label="检查单位" prop="checkCompany">
          <SelectDepart
            :id.sync="form.checkCompany"
            :multiple="false"
            :value="form.checkCompany ? { id: form.checkCompany, label: form.checkCompanyName } : null"
            :label.sync="form.checkCompanyName"
          />
        </el-form-item>
        <el-form-item label="受检单位" prop="checkedCompany">
          <SelectDepart
            :id.sync="form.checkedCompany"
            :multiple="false"
            :value="form.checkedCompany ? { id: form.checkedCompany, label: form.checkedCompanyName } : null"
            :label.sync="form.checkedCompanyName"
          />
        </el-form-item>
        <el-form-item label="受检方代表" prop="checkedRepresentative">
          <SelectUser
            :id.sync="form.checkedRepresentative"
            :value="
              form.checkedRepresentative
                ? { id: form.checkedRepresentative, label: form.checkedRepresentativeName }
                : null
            "
            :name.sync="form.checkedRepresentativeName"
            :multiple="false"
          />
        </el-form-item>
        <el-form-item label="上传" prop="files">
          <FileEdit v-model="form.files" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </section>
    <el-card style="overflow: auto;" shadow="never">
      <div slot="header" class="card-header">
        <span>检查情况</span>
      </div>
      <div class="edit-section">
        <el-form ref="resultForm" :model="resultForm" :rules="resultRules" label-width="120px">
          <el-form-item label="审核结果" prop="checkResult">
            <el-radio-group v-model="resultForm.checkResult">
              <el-radio :label="1">合格</el-radio>
              <el-radio :label="0">不合格</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="resultForm.checkResult === 0" label="问题描述" prop="describes">
            <el-input v-model="resultForm.describes" type="textarea" />
          </el-form-item>
          <el-form-item v-if="resultForm.checkResult === 0" label="问题等级" prop="levels">
            <SelectList v-model="resultForm.levels" :hasAllOption="false" type="questionLevel" />
          </el-form-item>
          <el-form-item v-if="resultForm.checkResult === 0" label="紧急程度" prop="urgency">
            <SelectList v-model="resultForm.urgency" :hasAllOption="false" type="urgencyDegree" />
          </el-form-item>
          <el-form-item label="检查人" prop="checkPerson">
            <SelectUser
              :id.sync="resultForm.checkPerson"
              :appendToBody="true"
              :value="resultForm.checkPerson ? { id: resultForm.checkPerson, label: resultForm.checkPersonName } : null"
              :name.sync="resultForm.checkPersonName"
              :multiple="false"
            />
          </el-form-item>
          <el-form-item v-if="resultForm.checkResult === 0" label="整改人" prop="rectificationer">
            <SelectUser
              :id.sync="resultForm.rectificationer"
              :appendToBody="true"
              :value="
                resultForm.rectificationer
                  ? { id: resultForm.rectificationer, label: resultForm.rectificationerName }
                  : null
              "
              :name.sync="resultForm.rectificationerName"
              :multiple="false"
            />
          </el-form-item>
          <el-form-item label="检查时间" prop="checkDate">
            <el-date-picker v-model="resultForm.checkDate" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%;" />
          </el-form-item>
          <el-form-item v-if="resultForm.checkResult === 0" label="整改时限" prop="rectificationTime ">
            <el-date-picker
              v-model="resultForm.rectificationTime"
              value-format="yyyy-MM-dd HH:MM:SS"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item v-if="resultForm.checkResult === 0" label="整改要求" prop="rectificationRequire">
            <el-input v-model="resultForm.rectificationRequire" type="textarea" />
          </el-form-item>
          <el-form-item label="现场照片" prop="files">
            <FileEdit v-model="resultForm.files" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="resultForm.remark" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(null)">保存</el-button>
      <el-button type="primary" @click="submit(true)">保存并提交</el-button>
    </div>
    <SelectCultureDialog :visible.sync="planVisible" @choose="choose" />
  </div>
</template>

<script>
import api from '@/api/safe/process/cultureCheck'
import SelectCultureDialog from './components/SelectCultureDialog'
export default {
  name: 'Edit',
  components: { SelectCultureDialog },
  data() {
    return {
      planVisible: false,
      form: {
        resultAddDTO: {}
      },
      resultForm: {
        checkResult: 1
      },
      rules: {
        safetyPlanId: [{ required: true, message: '必填' }],
        requirements: [{ required: true, message: '必填' }],
        replaceName: [{ required: true, message: '必填' }],
        checkCompany: [{ required: true, message: '必填' }],
        checkedCompany: [{ required: true, message: '必填' }],
        placeName: [{ required: true, message: '必填' }],
        checkedRepresentative: [{ required: true, message: '必填' }]
      },
      resultRules: {
        checkResult: [{ required: true, message: '必填' }],
        checkDate: [{ required: true, message: '必填' }],
        checkPerson: [{ required: true, message: '必填' }],
        describes: [{ required: true, message: '必填' }],
        levels: [{ required: true, message: '必填' }],
        urgency: [{ required: true, message: '必填' }],
        rectificationer: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.query.id, {})
      this.form = res.data
      this.resultForm = res.data.resultDTO
    },
    async submit(isAudit) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$refs.resultForm.validate(async valid => {
            delete this.form.resultDTO
            if (valid) {
              if (isAudit) {
                let res = this.$route.query.id
                  ? await api.updateAudit({ ...this.form, ...{ resultAddDTO: this.resultForm } })
                  : await api.submitAudit({ ...this.form, ...{ resultAddDTO: this.resultForm } })
              } else {
                let res = this.$route.query.id
                  ? await api.update({ ...this.form, ...{ resultAddDTO: this.resultForm } })
                  : await api.add({ ...this.form, ...{ resultAddDTO: this.resultForm } })
              }
              this.$message.success('保存成功')
              this.$router.go(-1)
            }
          })
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    showPeopleDialog() {
      this.planVisible = true
    },
    choose(row) {
      // this.form = {
      //   ...this.form,
      //   ...{
      //     checkNumber: row.civilizationNumber,
      //     safetyCivilizationId: row.id
      //   }
      // }
      this.form = {
        ...this.form,
        ...{
          civilizationCheckNumber: row.civilizationNumber,
          safetyCivilizationId: row.id
        }
      }
    }
  }
}
</script>

<style lang="less">
.edit-section {
  width: 400px;
}
</style>
