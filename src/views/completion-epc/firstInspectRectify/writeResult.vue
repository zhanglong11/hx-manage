<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>填写整改结果</strong>
          <el-button style="float: right; padding: 3px 0;" type="text" />
        </div>
        <div>
          <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-row>
                  <el-form-item label="验收名称" prop="name" required>
                    <el-input v-model="form.name" disabled placeholder="请输入验收名称" class="inputStyle" />
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-row>
                  <el-form-item label="问题描述" required prop="issueDesctiption">
                    <el-input
                      v-model="form.issueDesctiption"
                      disabled
                      placeholder="请输入问题描述"
                      class="inputStyle"
                    />
                  </el-form-item>
                </el-row>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="整改结果" prop="rectifyResult">
                <el-input
                  v-model="form.rectifyResult"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                  type="textarea"
                  placeholder="请输入整改结果"
                  style="width: 800px;"
                />
              </el-form-item>
              <el-form-item label="整改日期" prop="rectifyTime">
                <el-date-picker
                  v-model="form.rectifyTime"
                  placeholder="请选择整改日期"
                  value-format="yyyy-MM-dd 00:00:00"
                  class="inputStyle"
                />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="整改附件">
                <FileUploadWithImg
                  v-model="fileList"
                  style="width: 600px;"
                  :fileRecover="fileUrlList"
                  :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png', 'mp4']"
                ></FileUploadWithImg>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </el-card>
    </div>
    <div class="footer-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(false)">保存</el-button>
      <!--<el-button type="primary" @click="submit(false)">保存并提交</el-button>-->
    </div>
  </div>
</template>

<script>
import Api from '../api/rectify.js'
import FileApi from '@/api/file'
import FileUploadWithImg from '@/components/FileUploadWithImg'
export default {
  name: 'WriteResult',
  components: { FileUploadWithImg },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      id: this.$route.params.id || '',
      form: {},
      fileList: [],
      fileUrlList: [],
      rules: {
        rectifyResult: [{ required: true, message: '请输入整改结果', trigger: 'blur' }]
      },
      btnLoading: false
    }
  },
  computed: {},
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  mounted() {},
  methods: {
    async getDetail() {
      const res = await Api.getDetail(this.id)
      this.form = { ...res.data }
      this.fileList = res.data.fileIds.split(',')
      if (this.fileList.length > 0) {
        FileApi.getFileList(this.fileList).then(res => {
          if (res.data) {
            this.fileUrlList = res.data
          }
        })
      }
    },
    async submit(isSubmit) {
      await this.$refs.form.validate()
      const params = {
        ...this.form,
        rectifyFileId: this.fileList.join(','),
        projectId: localStorage.getItem('projectId')
      }
      await Api.writeResult(params)
      this.$message.success('保存成功')
      this.$router.back()
    },
    cancel() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
@import '../style.less';
</style>
