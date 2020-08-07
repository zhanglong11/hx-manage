<template>
  <div class="margin-bottom-100">
    <Title title="新增分包商进场" />
    <!-- 基本信息 -->
    <section>
      <el-card class="box-card">
        <div slot="header" class="card-header">{{ id ? form.supplierName : '分包商基本信息' }}</div>
        <el-form ref="form" class="base-info-card" label-width="120px" :model="form" :rules="rules">
          <el-row>
            <el-col :span="9">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input v-model="form.supplierName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label-width="20px">
                <el-button type="text" @click="chooseProvider">选择供应商</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="进场日期" prop="enterTime">
                <el-date-picker
                  v-model="form.enterTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="计划退场日期" prop="estimatedLeaveTime">
                <el-date-picker
                  v-model="form.estimatedLeaveTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="进场所在地" prop="location">
                <el-input v-model="form.location"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="机械设备数量" prop="equipmentNum">
                <el-input-number
                  v-model="form.equipmentNum"
                  :min="0"
                  label="机械设备数量"
                  :controls="false"
                  :precision="0"
                  style="width: 100%;"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="劳务人员数量" prop="employeeNum">
                <el-input-number
                  v-model="form.employeeNum"
                  :min="0"
                  label="机械设备数量"
                  :controls="false"
                  :precision="0"
                  style="width: 100%;"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人" prop="principal">
                <el-input v-model="form.principal" class="none"></el-input>
                <SelectUser
                  :id.sync="form.principal"
                  :value="form.principal ? { id: form.principal, label: form.principalName } : null"
                  :name.sync="form.principalName"
                  :multiple="false"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="附件" prop="fileId">
                <el-input v-model="form.fileId" style="display: none;"></el-input>
                <US :ids="form.fileId" :multiple="true" @input="fileChange" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </section>
    <div class="btn-box-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="saveDraft('draft')">保存为草稿</el-button>
      <el-button type="primary" class="btn-box-footer-button" @click="saveDraft('submit')">提交</el-button>
    </div>
    <ChooseProvider ref="chooseProvider" :type="1" @chooseSure="chooseSure" />
  </div>
</template>

<script>
import ChooseProvider from '../components/ChooseProvider'
import api from '@/api/provider/enter.js'
export default {
  name: 'SubContractorEnterEdit', //编辑新增共用
  components: {
    ChooseProvider
  },
  data() {
    return {
      id: this.$route.query.id,
      form: {
        projectId: localStorage.getItem('projectId'),
        fileId: ''
      },
      rules: {
        supplierName: [
          {
            required: true,
            message: '供应商名称必填'
          }
        ],
        enterTime: [
          {
            required: true,
            message: '进场时间必填'
          }
        ],
        estimatedLeaveTime: [
          {
            required: true,
            message: '计划退场时间必填'
          }
        ],
        location: [
          {
            required: true,
            message: '进场所在地必填'
          }
        ],
        equipmentNum: [
          {
            required: true,
            message: '机械设备数量必填'
          }
        ],
        employeeNum: [
          {
            required: true,
            message: '劳务人员数量必填'
          }
        ],
        principal: [
          {
            required: true,
            message: '负责人必选'
          }
        ],
        fileId: [
          {
            required: true,
            message: '附件必传'
          }
        ]
      }
    }
  },
  created() {
    if (this.id) {
      this.getDetails()
    }
  },
  methods: {
    async getDetails() {
      let res = await api.getDetails(this.id)
      if (res) {
        this.form = res.data
      }
    },
    chooseSure(e) {
      this.form.supplierId = e.id
      this.$set(this.form, 'supplierName', e.name)
    },
    fileChange(e, f) {
      if (e.length === 0) return (this.form.fileId = '')
      this.form.fileId = e.map(item => item.id).join(',')
    },
    // 选择供应商
    chooseProvider() {
      this.$refs.chooseProvider.show()
    },
    cancel() {
      this.$router.push({ name: 'SubContractorEnter' })
    },
    saveDraft(flag) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (flag === 'draft') {
            //保存草稿
            this.saveDraftSure()
          } else {
            this.save()
          }
        }
      })
    },
    resetFields() {
      this.$refs.form.resetFields()
    },
    async saveDraftSure() {
      let res = await api.saveSubContractorEnter(this.form)
      this.successCallBack()
    },
    async save() {
      let res = await api.submitSubContractorEnter(this.form)
      this.successCallBack()
    },
    successCallBack() {
      this.resetFields()
      this.$message.success('保存成功')
      this.cancel()
    }
  }
}
</script>

<style lang="less" scoped></style>
