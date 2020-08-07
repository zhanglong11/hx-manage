<template>
  <el-dialog destroy-on-close title="整改复查" width="500px" :visible="visible" @close="close">
    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
      <el-form-item label="复查人">
        <span>{{ $store.state.user.name }}</span>
      </el-form-item>
      <el-form-item label="复查日期" prop="reviewTime">
        <el-date-picker
          v-model="form.reviewTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="是否合格" prop="reviewResult">
        <el-radio-group v-model="form.reviewResult">
          <el-radio :label="1">合格</el-radio>
          <el-radio :label="0">不合格</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="复查意见" prop="reviewOpinion">
        <el-input v-model="form.reviewOpinion" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
      </el-form-item>
      <el-form-item label="附件" prop="reviewFileId">
        <Upload v-model="form.reviewFileId" accept=".jpg,.png,.webp,.gif" multiple is-only-button></Upload>
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
  name: 'ReviewDialog',
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
        reviewTime: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      rules: {
        reviewTime: [{ required: true, message: '必填' }],
        reviewResult: [{ required: true, message: '必填' }],
        reviewOpinion: [{ required: true, message: '必填' }]
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
        .post('rectify/submitReview', {
          inspectRectifyId: this.row.currentRectifyReviewId,
          ...this.form
        })
        .then(res => {
          this.$message.success('提交成功')
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
