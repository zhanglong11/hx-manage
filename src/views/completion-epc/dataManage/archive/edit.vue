<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>基本信息</strong>
          <el-button style="float: right; padding: 3px 0;" type="text" />
        </div>
        <div>
          <el-row>
            <el-col :span="12">
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">申报文件名称</div>
                    <div class="lrCellValue">{{ info.name }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">负责人</div>
                    <div class="lrCellValue">{{ info.principalName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">执行人</div>
                    <div class="lrCellValue">{{ info.executorName }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">报审单位</div>
                  <div class="lrCellValue">{{ info.reportingUnit }}</div>
                </div>
              </el-row>
              <el-row v-if="!isEdit" class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">签署日期</div>
                  <div class="lrCellValue">{{ info.confirmTime }}</div>
                </div>
              </el-row>
              <el-row v-if="!isEdit" class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">备注</div>
                  <div class="lrCellValue">{{ info.remark }}</div>
                </div>
              </el-row>
              <el-form v-if="isEdit" ref="form" :model="form" :rules="rules" class="form" label-width="120px">
                <el-row class="rowLine">
                  <el-col :span="16">
                    <el-form-item label="签署日期" prop="confirmTime">
                      <el-date-picker
                        v-model="form.confirmTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        style="width: 100%;"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="rowLine">
                  <el-col :span="16">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="form.remark" type="textarea" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>附件信息</strong>
          <el-button v-if="isEdit" type="primary" style="margin-left: 10px;" @click="addFile">上传文件</el-button>
        </div>
        <VXTable ref="fileTable" :pageShow="false" :columns="fileColumn" :tableData="fileData" />
      </el-card>

      <el-card v-if="isAudit" class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>审批</strong>
        </div>
        <el-form ref="auditForm" :model="auditForm" :rules="auditRules" class="form" label-width="110px">
          <el-row class="row">
            <el-col :span="12">
              <el-form-item label="审批结果" prop="auditStatus" style="width: 50%;">
                <el-radio-group v-model="auditForm.auditStatus">
                  <el-radio :label="1">通过</el-radio>
                  <el-radio :label="0">驳回</el-radio>
                </el-radio-group>
              </el-form-item></el-col
            >
            <el-col :span="12">
              <el-form-item label="文件上传" prop="auditFileId" style="width: 50%;">
                <FileEdit v-model="auditForm.auditFileId" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="审批意见" prop="auditOpinion " style="width: 50%;">
            <el-input v-model="auditForm.auditOpinion" type="textarea" />
          </el-form-item>
        </el-form>
      </el-card>

      <el-card v-if="isDetail && info.auditStatus > 1" class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>审核详情</strong>
        </div>
        <p>
          {{ info.auditSubmitTime }} 发起人 <span style="color: red;">{{ info.executorName }}</span> 提交申请，已审批
          {{ auditTime(info.auditSubmitTime) }}
        </p>
        <div style="padding: 20px 10px;">
          <Step :info="stepInfo" />
        </div>
      </el-card>
    </div>
    <div class="footer-btn">
      <el-button @click="goBack">返回</el-button>
      <el-button v-if="isEdit" type="primary" @click="save(null)">保存</el-button>
      <el-button v-if="isEdit" type="primary" @click="save(true)">保存并提交</el-button>
      <el-button v-if="isAudit" type="primary" @click="submit">提交</el-button>
    </div>
    <UploadDialog v-if="uploadVisible" :visible.sync="uploadVisible" @getFile="getFile" />
  </div>
</template>

<script>
import Api from '../../api/executor'
import fileApi from '@/api/file'
import UploadDialog from '@/views/earlyManage-epc/executor/components/UploadDialog'
import api from '@/api/file'
import { saveAs } from 'file-saver'
import timestamp from '@/utils/timeStamp'
import Step from '../executor/components/Step'
export default {
  name: 'TenderDetail',
  components: { UploadDialog, Step },
  data() {
    return {
      id: null,
      info: {},
      form: {},
      auditForm: {},
      isEdit: null,
      isAudit: null,
      isDetail: null,
      uploadVisible: false,
      fileData: [],
      fileIds: [],
      stepInfo: {},
      rules: {
        confirmTime: [{ required: true, message: '必填' }]
      },
      auditRules: {
        auditStatus: [{ required: true, message: '必填' }]
      },
      fileColumn: [
        {
          field: 'fileName',
          title: '文件名称'
        },
        {
          field: 'createTime',
          title: '上传时间'
        },
        {
          field: 'createTime',
          title: '操作',
          slots: {
            default: ({ row }) => {
              return [
                <PreviewUrl buttonContent="查看" fileUrl={row.fileUrl} />,
                <el-button type="text" onClick={() => this.downloadFile(row)}>
                  下载
                </el-button>,
                this.isEdit ? (
                  <el-button type="text" onClick={() => this.removeFile(row)}>
                    删除
                  </el-button>
                ) : null
              ]
            }
          }
        }
      ]
    }
  },
  watch: {
    fileIds: {
      handler: function (v) {
        if (!v.length) {
          return
        }
        this.getFileList()
      },
      deep: true
    }
  },
  created() {
    const { id, isEdit, isAudit, isDetail } = this.$route.params
    if (id) {
      this.id = id
      this.isEdit = isEdit
      this.isAudit = isAudit
      this.isDetail = isDetail
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      const res = await Api.detailFile(this.id)
      this.info = res.data
      this.form = res.data
      this.fileIds = res.data?.fileId?.split(',') || []
      this.stepInfo = {
        name: res.data.principalName,
        auditStatus: res.data.auditStatus,
        aduitTime: res.data.aduitTime,
        auditOpinion: res.data.auditOpinion,
        auditFileId: res.data.auditFileId
      }
    },
    addFile() {
      this.uploadVisible = true
    },
    getFile(fileIds) {
      this.fileIds = [...this.fileIds, ...fileIds]
    },
    async getFileList() {
      let res = await fileApi.getFileList(this.fileIds)
      this.fileData = res.data
    },
    async save(isAudit) {
      await this.$refs.form.validate()
      let form = _.cloneDeep(this.form)
      const fileIds = _.cloneDeep(this.fileIds)
      let param = { ...form, fileId: fileIds.join(',') }
      isAudit ? await Api.submitFile(param) : await Api.updateFile(param)
      this.$message.success('操作成功')
      this.goBack()
    },
    async submit() {
      await this.$refs.auditForm.validate()
      let form = _.omit(this.auditForm, 'auditStatus')
      let param = { ...form, id: this.id }
      this.auditForm.auditStatus ? await Api.auditPass(param) : await Api.auditReject(param)
      this.$message.success('操作成功')
      this.goBack()
    },
    //下载文件
    async downloadFile(row) {
      const res = await api.downloadFileById(row.id)
      saveAs(res.data, row.fileName)
    },
    auditTime(time) {
      return timestamp(moment(new Date()).diff(moment(time), 'seconds'))
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../style.less';
</style>
