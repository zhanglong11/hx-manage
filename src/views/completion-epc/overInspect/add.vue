<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>{{ id ? '新建' : '编辑' }}竣工验收</strong>
          <el-button style="float: right; padding: 3px 0;" type="text" />
        </div>
        <div>
          <el-form ref="form" :model="form" :rules="rules" class="form" label-width="140px">
            <el-row>
              <el-col :span="8">
                <el-row>
                  <el-form-item label="验收名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入验收名称" class="inputStyle" />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="组织单位" prop="organizer">
                    <el-input v-model="form.organizer" placeholder="请输入组织单位" class="inputStyle" />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="负责人" prop="principalId">
                    <SelectUser
                      :id.sync="form.principalId"
                      class="inputStyle"
                      :multiple="false"
                      :value="form.principalId ? { id: form.principalId, label: form.principalName } : null"
                      :name.sync="form.principalName"
                      appendToBody
                    />
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-row>
                  <el-form-item label="验收范围" prop="acceptanceScope">
                    <el-input
                      v-model="form.acceptanceScope"
                      :disabled="id"
                      placeholder="请输入验收范围"
                      class="inputStyle"
                    />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="计划验收日期" prop="planAcceptanceTime">
                    <el-date-picker
                      v-model="form.planAcceptanceTime"
                      placeholder="请选择计划验收日期"
                      value-format="yyyy-MM-dd 00:00:00"
                      class="inputStyle"
                    />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="参加单位" prop="participant">
                    <el-input v-model="form.participant" placeholder="请输入参加单位" class="inputStyle" />
                  </el-form-item>
                </el-row>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="form.remark"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                  type="textarea"
                  placeholder="请输入备注"
                  style="width: 800px;"
                />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="竣工验收申请附件">
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
      <el-button type="primary" @click="submit(true)">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../api/inspect.js'
import FileApi from '@/api/file'
import FileUploadWithImg from '@/components/FileUploadWithImg'
export default {
  name: 'AddOverInspect',
  components: { FileUploadWithImg },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      id: this.$route.params.id || '',
      form: {},
      info: {},
      fileList: [],
      fileUrlList: [],
      rules: {
        name: [{ required: true, message: '请输入验收名称', trigger: 'blur' }],
        organizer: [{ required: true, message: '请输入组织单位', trigger: 'blur' }],
        principalId: [{ required: true, message: '请选择负责人', trigger: 'change' }],
        acceptanceScope: [{ required: true, message: '请输入验收范围', trigger: 'blur' }],
        planAcceptanceTime: [{ required: true, message: '请选择计划验收日期', trigger: 'change' }],
        participant: [{ required: true, message: '请输入参加单位', trigger: 'blur' }]
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
      this.info = { ...res.data }
      this.fileList = res.data.acceptanceFileId.split(',')
      if (this.fileList.length > 0) {
        FileApi.getFileList(this.fileList).then(res => {
          if (res.data) {
            this.fileUrlList = res.data
          }
        })
      }
    },
    async submit(isSubmit) {
      const optType = isSubmit ? 2 : 1
      await this.$refs.form.validate()
      const params = {
        ...this.form,
        type: 2,
        acceptanceFileId: this.fileList.join(','),
        projectId: localStorage.getItem('projectId')
      }
      //走工作流
      //await Api.add({ ...params, optType: isSubmit ? 2 : 1 })
      this.id ? await Api.update({ ...params, optType }) : await Api.add({ ...params, optType })
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
