<template>
  <el-dialog destroy-on-close title="问题整改" width="500px" :visible="visible" @close="close">
    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
      <el-form-item label="整改人">
        <span>{{ $store.state.user.name }}</span>
      </el-form-item>
      <el-form-item label="整改日期" prop="rectifyTime">
        <el-date-picker
          v-model="form.rectifyTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="整改结果" prop="rectifyResult">
        <el-input v-model="form.rectifyResult" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
      </el-form-item>
      <el-form-item label="整改附件" prop="rectifyFileId">
        <Upload v-model="form.rectifyFileId" multiple accept=".jpg,.png,.webp,.gif" is-only-button></Upload>
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
      form: {
        rectifyTime: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      rules: {
        rectifyResult: [{ required: true, message: '必填' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.form.rectifyTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
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
        .post('rectify/submitRectify', {
          inspectRectifyId: this.row.currentRectifyReviewId,
          ...this.form
        })
        .then(res => {
          this.$message.success('整改成功')
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
