<template>
  <div style="padding: 10px;">
    <el-form ref="form" label-width="80px" inline :model="form" :rules="rules">
      <el-form-item label="表单名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="submit">{{ id ? '保存' : '创建' }}</el-button>
      </el-form-item>
    </el-form>
    <fm-making-form
      ref="makingForm"
      class="form-making"
      style="height: calc(100vh - 70px);"
      preview
      generate-code
      generate-json
    >
    </fm-making-form>
  </div>
</template>

<script>
export default {
  name: 'Edit',
  data() {
    return {
      form: {
        name: '',
        categoryId: '2'
      },
      rules: {
        name: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  created() {
    if (this.id) this.refresh()
  },
  methods: {
    refresh() {
      /**
       任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
       开发人员：李建敏
       日期：2020-3月-17日
       任务类型：2、复制修改代码 （1行）
       **/
      this.axios.workflow.get('custom/form/get/' + this.id).then(res => {
        this.form = _.pick(res.data, ['name', 'categoryId', 'id'])
        this.$refs.makingForm.setJSON(res.data.template)
      })
    },
    async submit() {
      await this.$refs.form.validate()
      let template = this.$refs.makingForm.getJSON()
      let data = { ...this.form, template: JSON.stringify(template) }
      if (this.id) {
        /**
         任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
         开发人员：李建敏
         日期：2020-3月-17日
         任务类型：2、复制修改代码 （1行）
         **/
        await this.axios.workflow.post('custom/form/update', data).then(res => {
          this.$message.success('保存成功')
        })
      } else {
        /**
         任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
         开发人员：李建敏
         日期：2020-3月-17日
         任务类型：2、复制修改代码 （1行）
         **/
        await this.axios.workflow.post('custom/form/add', data).then(res => {
          this.$message.success('添加成功')
        })
      }
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less"></style>
<style>
.form-making footer.el-footer {
  display: none;
}
</style>
