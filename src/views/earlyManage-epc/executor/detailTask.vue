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
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">任务名称</div>
                    <div class="lrCellValue">{{ info.name }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">执行人</div>
                    <div class="lrCellValue">{{ info.principalName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">计划开始时间</div>
                    <div class="lrCellValue">
                      {{ moment(info.planStartTime).format('YYYY-MM-DD') }}
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">实际开始时间</div>
                    <div class="lrCellValue">
                      {{ info.actualStartTime ? moment(info.actualStartTime).format('YYYY-MM-DD') : '' }}
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">备注说明</div>
                    <div class="lrCellValue">{{ info.remark }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">申报文件名称</div>
                  <div class="lrCellValue">{{ info.parentName }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">操作人</div>
                    <div class="lrCellValue">{{ info.executorName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">计划结束时间</div>
                    <div class="lrCellValue">{{ moment(info.planEndTime).format('YYYY-MM-DD') || '' }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">实际结束时间</div>
                    <div class="lrCellValue">
                      {{ info.actualEndTime ? moment(info.actualEndTime).format('YYYY-MM-DD') : '' }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">报审单位</div>
                  <div class="lrCellValue">{{ info.executorName }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">工期（天）</div>
                  <div class="lrCellValue">{{ info.duration }}</div>
                </div>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>任务进度</strong>
          <el-button v-if="isEdit" type="primary" style="margin-left: 10px;" @click="addTask">新增进度</el-button>
        </div>
        <EditTable
          v-if="isEdit"
          ref="table"
          v-model="tableData"
          :pageShow="false"
          :tableColumn="tableEditColumn"
          :validRules="validRules"
          :is-add="false"
          :isRemove="false"
        />
        <VXTable v-else ref="table" :pageShow="false" :columns="tableColumn" :tableData="tableData" />
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
        <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px" style="display: flex;">
          <div style="width: 50%;">
            <el-form-item label="审批结果" prop="auditStatus">
              <el-radio-group
                v-model="form.auditStatus"
                @input="
                  val => {
                    rules.auditOpinion[0].required = val === 0
                  }
                "
              >
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="0">驳回</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审批意见" prop="auditOpinion">
              <el-input v-model="form.auditOpinion" class="form-input" type="textarea" />
            </el-form-item>
          </div>
          <el-form-item label="文件上传" prop="auditFileId">
            <FileEdit v-model="form.auditFileId" />
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
      <el-button v-if="isEdit" type="primary" @click="save">保存</el-button>
      <el-button v-if="isEdit" type="primary" @click="submit">任务完成,提交</el-button>
      <el-button v-if="isAudit" type="primary" @click="audit">提交</el-button>
    </div>
    <UploadDialog v-if="uploadVisible" :visible.sync="uploadVisible" @getFile="getFile" />
  </div>
</template>

<script>
import Api from '../api/executor'
import UploadDialog from '@/views/earlyManage-epc/executor/components/UploadDialog'
import fileApi from '@/api/file'
import timestamp from '@/utils/timeStamp'
import Step from './components/Step'
import Download from '@/views/earlyManage-epc/executor/components/Download'
export default {
  name: 'TenderDetail',
  components: { UploadDialog, Step },
  data() {
    return {
      id: this.$route.params.id || '',
      info: {},
      isDetail: null,
      isEdit: null,
      isAudit: null,
      editIndex: null,
      tableData: [],
      fileData: [],
      fileIds: [],
      form: {},
      stepInfo: {},
      rules: {
        auditStatus: [{ required: true, message: '必填' }],
        auditOpinion: [{ required: false, message: '必填' }]
      },
      uploadVisible: false,
      tableColumn: [
        {
          field: 'content',
          title: '进度内容'
        },
        {
          field: 'createTime',
          title: '填写日期'
        }
      ],
      validRules: {
        content: [{ required: true, message: '必填' }]
      },
      tableEditColumn: [
        {
          field: 'content',
          title: '进度内容',
          slots: {
            default: ({ row, rowIndex }) => [
              rowIndex === this.editIndex ? <el-input v-model={row.content} /> : <span>{row.content}</span>
            ]
          }
        },
        {
          field: 'createTime',
          title: '填写日期'
        },
        {
          field: 'createTime',
          title: '操作',
          slots: {
            default: ({ row, rowIndex }) => {
              return [
                this.editIndex === rowIndex ? (
                  <el-button type="text" onClick={() => this.saveRow(row)}>
                    保存
                  </el-button>
                ) : (
                  <el-button type="text" onClick={() => this.editRow(row, rowIndex)}>
                    编辑
                  </el-button>
                ),
                <el-button type="text" onClick={() => this.remove(row)}>
                  删除
                </el-button>
              ]
            }
          }
        }
      ],
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
                <PreviewByFileId fileId={row.id} />,
                <Download fileId={row.id} fileName={row.fileName} />,
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
          this.fileData = []
          return
        }
        this.getFileList()
      },
      deep: true
    }
  },
  created() {
    const { id, isDetail, isEdit, isAudit } = this.$route.params
    if (this.id) {
      this.id = id
      this.isDetail = isDetail
      this.isEdit = isEdit
      this.isAudit = isAudit
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      const res = await Api.detailTask(this.id)
      this.info = res.data
      this.tableData = res.data.paramDTOList || []
      console.log(res.data.fileId)
      this.fileIds = res.data?.fileId?.split(',') || []
      this.stepInfo = {
        name: res.data.principalName,
        auditStatus: res.data.auditStatus,
        auditTime: res.data.auditTime,
        auditOpinion: res.data.auditOpinion,
        auditFileId: res.data.auditFileId
      }
    },
    async addTask() {
      if (this.editIndex) {
        this.$message.error('请结束当前编辑')
        return
      }
      this.tableData = [...this.tableData, {}]
    },
    editRow(row, rowIndex) {
      this.editIndex = rowIndex
    },
    //任务进度保存当前行
    async saveRow(row) {
      await this.$refs.table.$refs.table.$refs.vxeTable.validate(row)
      row.createTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      this.editIndex = null
    },
    //删除任务进度
    remove(row) {
      this.$refs.table.$refs.table.$refs.vxeTable.remove(row)
    },
    //添加文件
    addFile() {
      this.uploadVisible = true
    },
    //删除文件
    removeFile(row) {
      console.log(row)
      return
      this.fileIds = this.fileIds.filter(r => r !== row.id)
    },
    //保存
    async save() {
      if (!this.fileIds.length) {
        this.$message.error('请上传文件')
        return
      }
      const fileIds = _.cloneDeep(this.fileIds)
      await Api.saveDetailTask({
        paramDTOList: this.tableData,
        fileId: fileIds.join(','),
        preTaskId: this.id
      })
      this.$message.success('操作成功')
      this.goBack()
    },
    //提交
    async submit() {
      if (!this.fileIds.length) {
        this.$message.error('请上传文件')
        return
      }
      const fileIds = _.cloneDeep(this.fileIds)
      await Api.submitDetailTask({
        paramDTOList: this.tableData,
        fileId: fileIds.join(','),
        preTaskId: this.id
      })
      this.$message.success('操作成功')
      this.goBack()
    },
    auditTime(time) {
      return timestamp(moment(new Date()).diff(moment(time), 'seconds'))
    },
    //获取文件id
    getFile(fileIds) {
      this.fileIds = [...this.fileIds, ...fileIds]
    },
    //获取文件列表
    async getFileList() {
      let res = await fileApi.getFileList(this.fileIds)
      this.fileData = res.data
    },
    //审批
    async audit() {
      await this.$refs.form.validate()
      let form = _.omit(this.form, 'auditStatus')
      let param = { ...form, id: this.id }
      this.form.auditStatus ? await Api.auditPass(param) : await Api.auditReject(param)
      this.$message.success('操作成功')
      this.goBack()
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
@import '../style.less';
</style>
