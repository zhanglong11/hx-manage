<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="制度名称" prop="regimeName">
          <el-input v-model="form.regimeName" />
        </el-form-item>
        <el-form-item label="制度内容" prop="regimeContent">
          <el-input v-model="form.regimeContent" type="textarea" />
        </el-form-item>
        <el-form-item label="附件" prop="files">
          <FileEdit v-model="form.files" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(null)">保存</el-button>
      <el-button type="primary" @click="submit(1)">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/safe/organization/system'
export default {
  name: 'Edit',
  data() {
    return {
      form: {},
      rules: { regimeName: [{ required: true, message: '必填' }], regimeContent: [{ required: true, message: '必填' }] }
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
    async submit(isAudit) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.$route.params.id ? await api.update({ ...this.form }) : await api.add({ ...this.form })
          if (isAudit) {
            let audit = this.$route.params.id
              ? await api.submitAudit(this.$route.params.id)
              : await api.submitAudit(res.data)
          }
          this.$message.success('操作成功')
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

<style lang="less" scoped>
.edit-section {
  width: 400px;
}
</style>
