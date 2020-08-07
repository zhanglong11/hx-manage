<template>
  <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
    <el-form-item label="验收结果" prop="acceptanceResult">
      <el-radio-group v-model="form.acceptanceResult" class="inputStyle">
        <el-radio :label="1">合格</el-radio>
        <el-radio :label="0">不合格</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="总体意见" prop="acceptanceOpinion">
      <el-input
        v-model="form.acceptanceOpinion"
        :autosize="{ minRows: 3, maxRows: 5 }"
        type="textarea"
        placeholder="请输入总体意见"
        class="inputStyle"
      />
    </el-form-item>
    <el-form-item label="验收日期" prop="actualAcceptanceTime">
      <el-date-picker
        v-model="form.actualAcceptanceTime"
        placeholder="请选择验收日期"
        value-format="yyyy-MM-dd 00:00:00"
        class="inputStyle"
      />
    </el-form-item>
    <el-form-item v-if="form.acceptanceResult === 0" label="问题记录" prop="issueDesctiption">
      <el-input
        v-model="form.issueDesctiption"
        :autosize="{ minRows: 3, maxRows: 5 }"
        type="textarea"
        placeholder="请输入问题记录"
        class="inputStyle"
      />
    </el-form-item>
    <el-form-item label="验收结果附件">
      <FileUploadWithImg
        v-model="form.fileList"
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
  name: 'InspectForm',
  components: { FileUploadWithImg },
  props: {},
  data() {
    return {
      form: { fileList: [] },
      fileUrlList: [],
      rules: {
        acceptanceResult: [{ required: true, message: '验收结果必选' }],
        issueDesctiption: [{ required: true, message: '必填' }],
        actualAcceptanceTime: [{ required: true, message: '验收日期必选', trigger: 'change' }]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    async validForm() {
      let res = await this.$refs.form.validate().catch(e => false)
      return res ? { ...this.form, resultFileId: this.form.fileList.join(',') } : false
    }
  }
}
</script>

<style scoped lang="less">
.inputStyle {
  width: 800px;
}
</style>
