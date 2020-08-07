<template>
  <el-dialog destroy-on-close title="检查下达" width="500px" :visible="visible" @close="close">
    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
      <el-form-item label="整改期限" prop="rectifyDeadline">
        <el-date-picker
          v-model="form.rectifyDeadline"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="整改要求" prop="rectifyContent">
        <el-input v-model="form.rectifyContent" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">下达</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'ReleaseDialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: {},
      rules: {
        rectifyDeadline: [{ required: true, message: '必填' }],
        rectifyContent: [{ required: true, message: '必填' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
      } else {
        this.form = _.cloneDeep(this.initForm)
      }
    }
  },
  created() {
    this.initForm = _.cloneDeep(this.form)
  },
  mounted() {},
  methods: {
    refresh() {},
    async submit() {
      await this.$refs.form.validate()
      this.axios.safety
        .post('rectify/release', {
          ..._.pick(this.row, ['inspectPlanId', 'inspectTaskId']),
          ...this.form
        })
        .then(res => {
          this.$message.success('下达成功')
          this.$parent.refresh()
          this.close()
        })
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
