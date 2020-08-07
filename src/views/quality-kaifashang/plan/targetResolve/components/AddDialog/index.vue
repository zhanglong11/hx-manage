<template>
  <el-dialog
    width="600px"
    :modal="true"
    top="10vh"
    title="添加"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
      <el-form-item label="工程编码" prop="engineeringNumber">
        <el-input v-model="form.engineeringNumber" />
      </el-form-item>
      <el-form-item label="工程名称" prop="engineeringName">
        <el-input v-model="form.engineeringName" />
      </el-form-item>
      <el-form-item label="工程划分" prop="engineeringDivide">
        <el-select v-model="form.engineeringDivide" style="width: 100%;">
          <el-option
            v-for="item in engineeringDivideTypeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="点号" prop="pointNumber">
        <el-input v-model="form.pointNumber" />
      </el-form-item>
      <el-form-item label="控制点" prop="controlPoint">
        <el-input v-model="form.controlPoint" />
      </el-form-item>
      <el-form-item label="质量目标" prop="qualityTarget">
        <el-input v-model="form.qualityTarget" />
      </el-form-item>
      <el-form-item label="要求" prop="claim">
        <el-input v-model="form.claim" />
      </el-form-item>
      <el-form-item label="验收规范" prop="acceptanceSpecificationId">
        <el-select v-model="form.acceptanceSpecificationId" style="width: 100%;">
          <el-option
            v-for="item in acceptanceSpecificationList"
            :key="item.id"
            :value="item.id"
            :label="item.specificationName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="质量样板" prop="constructionTemplateId">
        <el-select v-model="form.constructionTemplateId" style="width: 100%;">
          <el-option
            v-for="item in constructionTemplateList"
            :key="item.id"
            :value="item.id"
            :label="item.templateName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="质量负责人" prop="qualityPrincipalId">
        <SelectUser
          :id.sync="form.qualityPrincipalId"
          :value="form.qualityPrincipalId ? { id: form.qualityPrincipalId, label: form.qualityPrincipalName } : null"
          :name.sync="form.qualityPrincipalName"
          :multiple="false"
        />
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '../../../../api'
import engineeringDivideTypeList from '@/views/quality-kaifashang/lib/engineeringDivideTypeList'
export default {
  name: 'AddDialog',
  props: {
    visible: {},
    pid: {
      default: 0
    },
    constructionTemplateList: {
      type: Array,
      default: () => []
    },
    acceptanceSpecificationList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      engineeringDivideTypeList,
      form: {},
      rules: {
        engineeringNumber: [{ required: true, message: '必填' }],
        engineeringName: [{ required: true, message: '必填' }],
        engineeringDivide: [{ required: true, message: '必填' }],
        pointNumber: [{ required: true, message: '必填' }],
        controlPoint: [{ required: true, message: '必填' }],
        claim: [{ required: true, message: '必填' }],
        qualityTarget: [{ required: true, message: '必填' }],
        acceptanceSpecificationId: [{ required: true, message: '必填' }],
        specificationName: [{ required: true, message: '必填' }],
        qualityPrincipalId: [{ required: true, message: '必填' }]
      }
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
      this.form = {}
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await Api.targetResolve.add({ ...this.form, ...{ pid: this.pid } })
          this.$message.success('保存成功')
          this.$emit('update:visible', false)
          this.form = {}
          this.$parent.refresh()
        }
      })
    }
  }
}
</script>

<style scoped></style>
