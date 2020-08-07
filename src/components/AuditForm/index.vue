<template>
  <div>
    <el-card class="wrap">
      <div slot="header" class="card-header">
        <span>审核</span>
      </div>
      <el-form ref="form" :disabled="disabled" class="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="审核意见" prop="result">
          <el-radio-group v-model="form.auditStatus">
            <el-radio :label="0">同意</el-radio>
            <el-radio :label="1">不同意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
        <el-form-item label="附件" prop="file">
          <FileEdit v-model="form.fileIds" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AuditForm',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: {
        auditStatus: [{ required: true, message: '请选择审核结果' }]
      }
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新列表
    refresh() {},
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$message.success('操作成功')
          this.$parent.$router.go(-1)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  margin-top: 10px;
  .form {
    width: 500px;
  }
}
</style>
