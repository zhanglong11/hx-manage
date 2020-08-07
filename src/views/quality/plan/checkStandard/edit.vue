<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="规范编号" prop="specificationNumber">
          <el-input v-model="form.specificationNumber" />
        </el-form-item>
        <el-form-item label="规范名称" prop="specificationName">
          <el-input v-model="form.specificationName" />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <SelectList v-model="form.category" :hasAllOption="false" type="standardTypeList" />
        </el-form-item>
        <el-form-item label="内容" prop="contentFileIds">
          <FileEdit v-model="form.contentFileIds" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/quality/plan/checkStandard'
export default {
  name: 'Edit',
  data() {
    return {
      form: {
        specificationNumber: null,
        specificationName: null,
        category: null
        //bug 1318, 张龙，解决文件上传问题
        // contentFileIds: '123',
      },
      rules: {
        specificationNumber: [{ required: true, message: '必填' }],
        specificationName: [{ required: true, message: '必填' }],
        category: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.params.id, {})
      this.form = res.data
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.$route.params.id ? await api.update({ ...this.form }) : await api.add({ ...this.form })
          this.$message.success('保存成功')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less">
.edit-section {
  width: 400px;
}
.btn-box {
  margin-top: 10px;
  text-align: left;
}
</style>
