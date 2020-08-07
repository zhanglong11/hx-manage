<template>
  <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
    <el-form-item label="复验结果" prop="reviewResult">
      <el-radio-group v-model="form.reviewResult" class="inputStyle">
        <el-radio :label="1">合格</el-radio>
        <el-radio :label="0">不合格</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="总体意见" prop="reviewOpinion">
      <el-input
        v-model="form.reviewOpinion"
        :autosize="{ minRows: 3, maxRows: 5 }"
        type="textarea"
        placeholder="请输入总体意见"
        class="inputStyle"
      />
    </el-form-item>
    <el-form-item label="复验日期" prop="reviewTime">
      <el-date-picker
        v-model="form.reviewTime"
        placeholder="请选择复验日期"
        value-format="yyyy-MM-dd 00:00:00"
        class="inputStyle"
      />
    </el-form-item>
    <el-form-item label="复验附件">
      <FileUploadWithImg
        v-model="fileList"
        class="inputStyle"
        :fileRecover="fileUrlList"
        :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png', 'mp4']"
      ></FileUploadWithImg>
    </el-form-item>
  </el-form>
</template>

<script>
import FileUploadWithImg from '@/components/FileUploadWithImg'
export default {
  name: 'RectifyForm',
  components: { FileUploadWithImg },
  props: {},
  data() {
    return {
      form: {},
      fileUrlList: [],
      fileList: [],
      rules: {
        reviewResult: [{ required: true, message: '复验结果必选' }],
        reviewTime: [{ required: true, message: '复验日期必选', trigger: 'change' }]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    async validForm() {
      let res = await this.$refs.form.validate().catch(e => false)
      return res ? { ...this.form, reviewFileId: this.fileList.join(',') } : false
    }
  }
}
</script>

<style scoped lang="less">
.inputStyle {
  width: 800px;
}
</style>
