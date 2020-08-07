<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>新建招标公告</strong>
          <el-button style="float: right; padding: 3px 0;" type="text" />
        </div>
        <div>
          <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-row>
                  <el-form-item label="招标公告名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入招标公告名称" class="inputStyle" />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="招标类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择招标类型" class="inputStyle">
                      <el-option
                        v-for="item of tenderTypeList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="公告发布日期" prop="publishDate">
                    <el-date-picker
                      v-model="form.publishDate"
                      placeholder="请选择公告发布日期"
                      value-format="yyyy-MM-dd 00:00:00"
                      class="inputStyle"
                    />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="开标地点" prop="address">
                    <el-input v-model="form.address" placeholder="请输入开标地点" class="inputStyle" />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="上传">
                    <FileUploadWithImg
                      v-model="fileList"
                      class="inputStyle"
                      :fileRecover="fileUrlList"
                      :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png', 'mp4']"
                    ></FileUploadWithImg>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-row>
                  <el-form-item label="招标公告编码" prop="code">
                    <el-input v-model="form.code" placeholder="请输入招标公告编码" class="inputStyle" />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="招标方式" prop="mode">
                    <el-select v-model="form.mode" placeholder="请选择招标方式" class="inputStyle">
                      <el-option
                        v-for="item of tenderModeList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="投标截止日期" prop="endDate">
                    <el-date-picker
                      v-model="form.endDate"
                      placeholder="请选择投标截止日期"
                      value-format="yyyy-MM-dd 00:00:00"
                      class="inputStyle"
                    />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" class="inputStyle" />
                  </el-form-item>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
    </div>
    <div class="footer-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(false)">保存</el-button>
      <el-button type="primary" @click="submit(true)">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../api'
import FileApi from '@/api/file'
import FileUploadWithImg from '@/components/FileUploadWithImg'
export default {
  name: 'AddTender',
  components: { FileUploadWithImg },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      id: '',
      form: {},
      fileList: [],
      fileUrlList: [],
      rules: {
        name: [{ required: true, message: '请输入招标公告名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择招标类型', trigger: 'change' }],
        publishDate: [{ required: true, message: '请选择公告发布日期', trigger: 'change' }],
        code: [{ required: true, message: '请输入招标公告编码', trigger: 'blur' }],
        mode: [{ required: true, message: '请选择招标方式', trigger: 'change' }],
        endDate: [{ required: true, message: '请选择投标截止日期', trigger: 'change' }]
      },
      btnLoading: false
    }
  },
  computed: {
    tenderTypeList() {
      return this.$getArgList('tenderType')
    },
    tenderModeList() {
      return this.$getArgList('tenderMode')
    }
  },
  created() {
    const id = this.$route.params.id || ''
    this.id = id
    if (this.id) {
      this.getDetail()
    }
  },
  mounted() {},
  methods: {
    async getDetail() {
      const res = await Api.getTenderDetail(this.id)
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
      const params = { ...this.form, fileIds: this.fileList.join(','), projectId: localStorage.getItem('projectId') }
      isSubmit ? await Api.submitTender(params) : await Api.addTender(params)
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
