<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <strong>新建中标资料</strong>
          <el-button style="float: right; padding: 3px 0;" type="text" />
        </div>
        <div>
          <el-form ref="form" :model="form" :rules="rules" class="form" label-width="140px">
            <el-row>
              <el-col :span="8">
                <el-row>
                  <el-form-item label="招标公告名称" prop="invitationBidId">
                    <el-select
                      v-model="form.invitationBidId"
                      placeholder="请选择招标公告"
                      class="inputStyle"
                      @change="handleTenderChange"
                    >
                      <el-option v-for="item of tenderList" :key="item.id" :value="item.id" :label="item.name" />
                    </el-select>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="招标类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择招标类型" disabled class="inputStyle">
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
                  <el-form-item label="中标单位" prop="tenderCompany">
                    <el-input v-model="form.tenderCompany" placeholder="请输入中标单位名称" class="inputStyle" />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="项目经理" prop="projectManager">
                    <el-input v-model="form.projectManager" placeholder="请输入项目经理名称" class="inputStyle" />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="公示日期" prop="publicityDate">
                    <el-date-picker
                      v-model="form.publicityDate"
                      placeholder="请选择公示日期"
                      value-format="yyyy-MM-dd 00:00:00"
                      class="inputStyle"
                    />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="联合体工作范围" prop="comboWorkingRange">
                    <el-input v-model="form.comboWorkingRange" placeholder="请输入联合体工作范围" class="inputStyle" />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" class="inputStyle" />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="附件">
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
                  <el-form-item label="招标编号" prop="invitationBidCode">
                    <el-input
                      v-model="form.invitationBidCode"
                      placeholder="请输入招标编码"
                      disabled
                      class="inputStyle"
                    />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="中标方式" prop="mode">
                    <el-select v-model="form.mode" placeholder="请选择中标方式" disabled class="inputStyle">
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
                  <el-form-item label="中标金额(元)" prop="tenderMoney">
                    <el-input-number
                      v-model="form.tenderMoney"
                      :min="0"
                      placeholder="请输入中标金额"
                      :controls="false"
                      :precision="2"
                      class="inputStyle"
                    ></el-input-number>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="电话" prop="mobile">
                    <el-input v-model.number="form.mobile" placeholder="请输入电话" class="inputStyle" />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="是否联合体中标" prop="isCombo">
                    <el-radio-group v-model="form.isCombo" class="formInput">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="评审专家" prop="evaluationExpert">
                    <el-input v-model="form.evaluationExpert" placeholder="请输入评审专家名称" class="inputStyle" />
                  </el-form-item>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <el-card class="box-card" style="margin-top: 15px;">
        <div slot="header" class="clearfix">
          <strong>管理人员明细</strong>
          <el-button style="float: right;" type="primary" @click="handleAddManage">
            新增
          </el-button>
        </div>
        <div>
          <vxe-table
            ref="xTable"
            border
            resizable
            show-overflow
            keep-source
            :data="managerList"
            :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
            :edit-rules="tableRules"
          >
            <vxe-table-column type="seq" title="序号" width="50" />
            <vxe-table-column
              field="name"
              title="姓名"
              :edit-render="{
                name: '$input',
                props: { type: 'text' }
              }"
            />
            <vxe-table-column
              field="idcardNumber"
              title="身份证号"
              :edit-render="{
                name: '$input',
                props: { type: 'text' }
              }"
            />
            <vxe-table-column
              field="mobile"
              title="联系电话"
              :edit-render="{
                name: '$input',
                props: { type: 'text' }
              }"
            />
            <vxe-table-column
              field="credentials"
              title="资格证书"
              :edit-render="{
                name: '$input',
                props: { type: 'text' }
              }"
            />
            <vxe-table-column
              field="qualificationLevel"
              title="资格等级"
              :edit-render="{
                name: '$input',
                props: { type: 'text' }
              }"
            />
            <vxe-table-column
              field="remark"
              title="备注"
              :edit-render="{
                name: '$input',
                props: { type: 'text' }
              }"
            />
            <vxe-table-column title="操作" width="120">
              <template v-slot="{ row, $rowIndex }">
                <template v-if="$refs.xTable.isActiveByRow(row)">
                  <a @click="saveRowEvent(row, $rowIndex)">保存</a>
                  <a @click="cancelRowEvent(row)">取消</a>
                </template>
                <template v-else>
                  <a @click="editRowEvent(row)">编辑</a>
                  <a @click="deleteRowEvent(row)">删除</a>
                </template>
              </template>
            </vxe-table-column>
          </vxe-table>
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
import regular from '@/utils/regular'
import FileUploadWithImg from '@/components/FileUploadWithImg'
export default {
  name: 'AddWinning',
  components: {
    FileUploadWithImg
  },
  data() {
    return {
      id: '',
      projectId: localStorage.getItem('projectId'),
      form: { invitationBidId: '' },
      fileList: [],
      fileUrlList: [],
      tenderList: [],
      managerList: [], // 管理用户列表
      rules: {
        invitationBidId: [{ required: true, message: '请选择招标公告', trigger: 'change' }],
        type: [{ required: true, message: '请选择招标类型', trigger: 'change' }],
        tenderCompany: [{ required: true, message: '请输入中标单位', trigger: 'blur' }],
        projectManager: [{ required: true, message: '请输入项目经理', trigger: 'blur' }],
        publicityDate: [{ required: true, message: '请选择公示日期', trigger: 'change' }],
        code: [{ required: true, message: '请输入招标公告编码', trigger: 'change' }],
        mode: [{ required: true, message: '请选择招标方式', trigger: 'change' }],
        tenderMoney: [
          { required: true, message: '请输入中标金额', trigger: 'blur' },
          { type: 'number', message: '必须是数字', trigger: 'blur' }
        ],
        mobile: [{ pattern: regular.telephone, message: '电话格式不正确', trigger: 'blur' }],
        isCombo: [{ required: true, message: '请选择是否为联合体中标', trigger: 'change' }]
      },
      tableRules: {
        name: [{ required: true, message: '请选输入姓名', trigger: 'blur' }],
        idcardNumber: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { pattern: regular.idCardNo, message: '请输入正确的身份证号', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { pattern: regular.telephone, message: '请输入正确的电话格式', trigger: 'blur' }
        ]
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
    this.getAvailableTenderList()
  },
  mounted() {},
  methods: {
    async getDetail() {
      const res = await Api.getWinningDetail(this.id)
      this.form = { ...res.data }
      this.managerList = res.data.personParamDTOList || []
      this.fileList = res.data.fileIds.split(',')
      if (this.fileList.length > 0) {
        FileApi.getFileList(this.fileList).then(res => {
          if (res.data) {
            this.fileUrlList = res.data
          }
        })
      }
    },
    // 获取招标公告列表
    async getAvailableTenderList() {
      const res = await Api.getAvailableTenderList()
      this.tenderList = res.data || []
    },
    //选择招标公告事件
    async handleTenderChange(e) {
      let res = await Api.getTenderDetail(e)
      this.form = {
        ...this.form,
        invitationBidCode: res.data.name,
        type: res.data.type,
        mode: res.data.mode
      }
    },
    //添加管理用户
    handleAddManage() {
      const newObj = { name: '', idcardNumber: '', mobile: '', credentials: '', qualificationLevel: '', remark: '' }
      this.managerList.push(newObj)
      this.$refs.xTable.setActiveRow(newObj)
    },
    saveRowEvent(row, $rowIndex) {
      this.$refs.xTable.clearActived()
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    deleteRowEvent(row) {
      this.managerList = this.managerList.filter(item => item._XID !== row._XID)
    },
    async submit(isSubmit) {
      await this.$refs.xTable.clearActived()
      await this.$refs.form.validate()
      if (this.managerList.length === 0) {
        this.$message.warning('管理人员不能为空')
        return
      }
      let res = await this.$refs.xTable.validate(this.managerList).catch(e => e)
      if (res) return
      const params = {
        id: this.id,
        ...this.form,
        fileIds: this.fileList.join(','),
        projectId: this.projectId,
        personParamDTOList: this.managerList
      }
      isSubmit ? await Api.submitWinning(params) : await Api.addWinning(params)
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
