<template>
  <el-dialog destroy-on-close title="通知整改" width="500px" :visible="visible" @close="close">
    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
      <el-form-item label="整改人" prop="rectifyPrincipal">
        <SelectUser
          :id.sync="form.rectifyPrincipal"
          :multiple="false"
          :name.sync="form.rectifyPrincipalName"
          class="inputStyle"
        />
      </el-form-item>
      <el-form-item label="整改期限" prop="rectifyDeadline">
        <el-date-picker
          v-model="form.rectifyDeadline"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
          class="inputStyle"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="整改内容" prop="rectifyContent">
        <el-input
          v-model="form.rectifyContent"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6 }"
          class="inputStyle"
        ></el-input>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'RectifyDialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {},
      rules: {
        rectifyPrincipal: [{ required: true, message: '整改人必选' }],
        rectifyDeadline: [{ required: true, message: '整改期限必选' }],
        rectifyContent: [{ required: true, message: '整改内容必填' }]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    async submit() {
      await this.$refs.form.validate()
      this.$emit('submit', this.form)
    }
  }
}
</script>

<style scoped lang="less">
.inputStyle {
  width: 300px;
}
</style>
