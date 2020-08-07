<template>
  <div class="is-Footer">
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="规范编号" prop="specificationNumber">
          <el-input v-model="form.specificationNumber" class="inputStyle" />
        </el-form-item>
        <el-form-item label="规范名称" prop="specificationName">
          <el-input v-model="form.specificationName" class="inputStyle" />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-select v-model="form.category" class="inputStyle">
            <el-option v-for="item in standardList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="contentFileIds">
          <FileEdit v-model="form.contentFileIds" class="inputStyle" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" class="inputStyle" />
        </el-form-item>
      </el-form>
    </section>
    <div class="footer-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import standardList from '../../lib/standardList'
import Api from '../../api/index'
export default {
  name: 'Edit',
  data() {
    return {
      standardList,
      id: '',
      form: {
        specificationNumber: null,
        specificationName: null,
        category: null
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
      this.id = this.$route.params.id
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await Api.standard.detail(this.id, {})
      this.form = res.data
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.id ? await Api.standard.update({ ...this.form }) : await Api.standard.add({ ...this.form })
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
@import '../../style.less';
</style>
