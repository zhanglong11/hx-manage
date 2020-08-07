<template>
  <div class="dialogWrapper indexWrapper">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>合同基本信息</span>
      </div>
      <div>
        <el-form ref="baseInfoForm" :model="baseInfo" :rules="baseInfoRule">
          <el-row>
            <el-col :span="10">
              <el-form-item label="合同编号" label-width="200px" prop="code" style="margin-right: 20px;">
                <el-input v-model="baseInfo.code" placeholder="请输入合同编号" class="inputStyle"> </el-input>
              </el-form-item>
              <el-form-item label="合同名称" label-width="200px" prop="name" style="margin-right: 20px;">
                <el-input v-model="baseInfo.name" placeholder="请输入合同名称" class="inputStyle"> </el-input>
              </el-form-item>
              <el-form-item label="招采方式" label-width="200px" prop="purchaseMode" style="margin-right: 20px;">
                <el-select v-model="baseInfo.purchaseMode" class="inputStyle">
                  <el-option :value="1" label="招标"> </el-option>
                  <el-option :value="2" label="非招标"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="质保期(月)" label-width="200px" prop="guaranteePeriod" style="margin-right: 20px;">
                <el-input v-model.number="baseInfo.guaranteePeriod" placeholder="请输入质保期" class="inputStyle">
                </el-input>
              </el-form-item>
              <el-form-item label="甲方" label-width="200px" prop="firstParty" style="margin-right: 20px;">
                <el-input v-model="baseInfo.firstParty" placeholder="请输入甲方名称" class="inputStyle"> </el-input>
              </el-form-item>
              <el-form-item label="甲方联系人" label-width="200px" prop="firstPartyLinkman" style="margin-right: 20px;">
                <el-input v-model="baseInfo.firstPartyLinkman" placeholder="请输入甲方联系人名称" class="inputStyle">
                </el-input>
              </el-form-item>
              <el-form-item
                label="甲方联系电话"
                label-width="200px"
                prop="firstPartyMobile"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model.number="baseInfo.firstPartyMobile"
                  placeholder="请输入甲方联系电话"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="乙方" label-width="200px" prop="secondParty" style="margin-right: 20px;">
                <el-input v-model="baseInfo.secondParty" placeholder="请输入乙方名称" class="inputStyle"> </el-input>
              </el-form-item>
              <el-form-item
                label="乙方联系人"
                label-width="200px"
                prop="secondPartyLinkman"
                style="margin-right: 20px;"
              >
                <el-input v-model="baseInfo.secondPartyLinkman" placeholder="请输入乙方联系人名称" class="inputStyle">
                </el-input>
              </el-form-item>
              <el-form-item
                label="乙方联系电话"
                label-width="200px"
                prop="secondPartyMobile"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model.number="baseInfo.secondPartyMobile"
                  placeholder="请输入乙方联系电话"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="使用单位" label-width="200px" prop="userCompanyName" style="margin-right: 20px;">
                <el-input v-model="baseInfo.userCompanyName" placeholder="请输入使用单位名称" class="inputStyle">
                </el-input>
              </el-form-item>
              <el-form-item
                label="使用单位联系人"
                label-width="200px"
                prop="userCompanyLinkman"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model="baseInfo.userCompanyLinkman"
                  placeholder="请输入使用单位联系人名称"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="使用单位联系人电话"
                label-width="200px"
                prop="userCompanyMobile"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model.number="baseInfo.userCompanyMobile"
                  placeholder="请输入使用单位联系人电话"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="合同备注" label-width="200px" prop="remark" style="margin-right: 20px;">
                <el-input
                  v-model="baseInfo.remark"
                  type="textarea"
                  class="inputStyle"
                  placeholder="备注"
                  :autosize="{ minRows: 4, maxRows: 6 }"
                  maxlength="200"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                label="监理单位"
                label-width="200px"
                prop="supervisionCompanyName"
                style="margin-right: 20px;"
              >
                <el-input v-model="baseInfo.supervisionCompanyName" placeholder="请输入监理单位名称" class="inputStyle">
                </el-input>
              </el-form-item>
              <el-form-item
                label="监理单位联系人"
                label-width="200px"
                prop="supervisionCompanyLinkman"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model="baseInfo.supervisionCompanyLinkman"
                  placeholder="请输入监理单位联系人名称"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="监理单位联系人电话"
                label-width="200px"
                prop="supervisionCompanyMobile"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model.number="baseInfo.supervisionCompanyMobile"
                  placeholder="请输入监理单位联系人电话"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="项目负责人" label-width="200px" prop="projectLinkman" style="margin-right: 20px;">
                <el-input v-model="baseInfo.projectLinkman" placeholder="请输入项目负责人名称" class="inputStyle">
                </el-input>
              </el-form-item>
              <el-form-item
                label="项目负责人联系电话"
                label-width="200px"
                prop="projectMobile"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model.number="baseInfo.projectMobile"
                  placeholder="请输入项目负责人联系电话"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="甲方项目工程师"
                label-width="200px"
                prop="firstPartyEngineerLinkman"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model="baseInfo.firstPartyEngineerLinkman"
                  placeholder="请输入甲方项目工程师名称"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="甲方项目工程师联系电话"
                label-width="200px"
                prop="firstPartyEngineerMoblie"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model.number="baseInfo.firstPartyEngineerMoblie"
                  placeholder="请输入甲方项目工程师联系电话"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="采购负责人" label-width="200px" prop="purchaseLinkman" style="margin-right: 20px;">
                <el-input v-model="baseInfo.purchaseLinkman" placeholder="请输入采购负责人名称" class="inputStyle">
                </el-input>
              </el-form-item>
              <el-form-item
                label="采购负责人联系电话"
                label-width="200px"
                prop="purchaseMobile"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model.number="baseInfo.purchaseMobile"
                  placeholder="请输入采购负责人联系电话"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="甲供材单位" label-width="200px" prop="supplyCompanyName" style="margin-right: 20px;">
                <el-input v-model="baseInfo.supplyCompanyName" placeholder="请输入甲供材单位名称" class="inputStyle">
                </el-input>
              </el-form-item>
              <el-form-item
                label="甲供材单位联系人"
                label-width="200px"
                prop="supplyCompanyLinkman"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model="baseInfo.supplyCompanyLinkman"
                  placeholder="请输入甲供材单位联系人名称"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="甲供材单位联系人电话"
                label-width="200px"
                prop="supplyCompanyMobile"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model.number="baseInfo.supplyCompanyMobile"
                  placeholder="请输入甲供材单位联系人电话"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="供货周期"
                label-width="200px"
                prop="supplyMaterialPeriod"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model.number="baseInfo.supplyMaterialPeriod"
                  placeholder="请输入供货周期"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="创建人 " label-width="200px" prop="creatorName" style="margin-right: 20px;">
                <el-input v-model="baseInfo.creatorName" class="inputStyle" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>合同附件信息</span>
      </div>
      <div>
        <el-row type="flex" justify="space-between">
          <el-form ref="docForm" :model="docForm" style="width: 100%;">
            <el-col :span="14">
              <el-form-item label="电子合同" required label-width="120px" prop="eleFile" style="margin-right: 20px;">
                <FileUploadWithImg
                  v-model="docForm.eleFileList"
                  :disabled="![undefined, 0].includes(baseInfo.status)"
                  :fileRecover="eleFileUrlList"
                  :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png']"
                  @change="handleChange"
                ></FileUploadWithImg>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <div v-if="isEdit" class="detail-b-file">
                <FileRecord labelName="" :fileRecover="eleFileUrlList1"></FileRecord>
              </div>
            </el-col>
            <el-col :span="14">
              <el-form-item label="纸质合同" required label-width="120px" prop="paperFile" style="margin-right: 20px;">
                <FileUploadWithImg
                  v-model="docForm.paperFileList"
                  :fileRecover="paperFileUrlList"
                  :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png']"
                  @change="handleChange2"
                ></FileUploadWithImg>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <div v-if="isEdit" class="detail-b-file">
                <FileRecord labelName="" :fileRecover="paperFileUrlList1"></FileRecord>
              </div>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </el-card>
    <section v-if="baseInfo.type && baseInfo.type !== 99" style="margin-top: 10px;">
      <el-card shadow="never">
        <div slot="header" class="card-header">
          <span>合同清单信息</span>
          <el-button type="text" style="float: right; padding: 3px 0;">
            <a href="/doc/清单列表.xls" download="导入模板.xls">下载清单范本</a>
          </el-button>
        </div>
        <EditTable
          ref="checkTable"
          v-model="checkList"
          :tableColumn="purchaseColumn"
          :validRules="validRules"
          :is-remove="false"
          :is-add="false"
        />
      </el-card>
    </section>
    <div class="footerButton">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <!--<el-button type="primary" @click="handleSubmit">保存并提交</el-button>-->
    </div>
  </div>
</template>
<script>
import contractType from '@/lib/contractType'
import contractStatus from '@/lib/contractStatus'
import Api from '@/api/contract/contractManage/merchants'
import checkTel from '@/utils/checkTel'
import isNullOrNumber from '@/utils/isNullOrNumber'
import FileUploadWithImg from '_c/FileUploadWithImg/index'
import FileApi from '@/api/file'
import CostFile from './components/CostFile/index'
export default {
  name: 'ContractAdd',
  components: { FileUploadWithImg },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      isEdit: false,
      eleFileUrlList: [],
      eleFileUrlList1: [],
      paperFileUrlList: [],
      paperFileUrlList1: [],
      docForm: { eleFileList: [], paperFileList: [] },
      editCount: null,
      contractId: '',
      baseInfo: {
        code: '',
        name: '',
        type: 2,
        purchaseMode: '',
        guaranteePeriod: null, //保质期
        firstParty: '',
        firstPartyLinkman: '',
        firstPartyMobile: null,
        secondParty: '',
        secondPartyLinkman: '',
        secondPartyMobile: '',
        remark: '',
        creatorName: '',
        userCompanyName: '',
        userCompanyLinkman: '',
        userCompanyMobile: '',
        supervisionCompanyName: '',
        supervisionCompanyLinkman: '',
        supervisionCompanyMobile: '',
        projectLinkman: '',
        projectMobile: '',
        firstPartyEngineerLinkman: '',
        firstPartyEngineerMoblie: '',
        purchaseLinkman: '',
        purchaseMobile: '',
        supplyCompanyName: '',
        supplyCompanyLinkman: '',
        supplyCompanyMobile: '',
        supplyMaterialPeriod: null //供货周期
      },
      baseInfoRule: {
        code: [
          { required: true, message: '请输入合同编号', trigger: 'blur' },
          {
            type: 'string',
            max: 50,
            message: '合同编号长度不超过50位',
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '请输入合同名称', trigger: 'blur' },
          {
            type: 'string',
            max: 50,
            message: '合同名称长度不超过50位',
            trigger: 'blur'
          }
        ],
        type: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
        purchaseMode: [{ required: true, message: '请选择招采方式', trigger: 'change' }],
        guaranteePeriod: [
          { required: true, message: '请输入质保期', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        firstParty: [{ required: true, message: '请输入甲方名称', trigger: 'blur' }],
        firstPartyLinkman: [{ required: true, message: '请输入甲方联系人', trigger: 'blur' }],
        firstPartyMobile: [
          { required: true, message: '甲方联系人电话不能为空', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }
        ],
        secondParty: [{ required: true, message: '请输入乙方名称', trigger: 'blur' }],
        secondPartyLinkman: [{ required: true, message: '请输入乙方联系人', trigger: 'blur' }],
        secondPartyMobile: [
          { required: true, message: '乙方联系人电话不能为空', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }
        ],
        userCompanyMobile: [{ validator: checkTel, trigger: 'blur' }], //使用单位
        supervisionCompanyMobile: [{ validator: checkTel, trigger: 'blur' }], //监理单位
        projectMobile: [{ validator: checkTel, trigger: 'blur' }], //项目负责人
        firstPartyEngineerMoblie: [{ validator: checkTel, trigger: 'blur' }], //甲方工程师
        purchaseMobile: [{ validator: checkTel, trigger: 'blur' }], //采购负责人
        supplyCompanyMobile: [{ validator: checkTel, trigger: 'blur' }], //甲供材单位联系人
        supplyMaterialPeriod: [{ validator: isNullOrNumber, trigger: 'blur' }]
      },
      contractType: contractType,
      contractStatus: contractStatus,
      validRules: {
        number: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }]
      },
      checkList: [{ name: '合同清单', fileName: null }],
      purchaseColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'name',
          title: '项目文件名称',
          slots: {
            default: ({ row }) => [<span>合同清单</span>]
          }
        },
        {
          field: 'fileName',
          title: '已上传文件',
          slots: {
            default: ({ row, rowIndex }) => [<span>{row.fileName || '暂无文件'}</span>]
          }
        },
        {
          field: 'fileId',
          title: '上传文件',
          slots: {
            default: ({ row, rowIndex }) => {
              return [
                this.editCount === rowIndex ? (
                  <CostFile
                    isButton={true}
                    multiple={false}
                    onInput={(id, file, name) => this.getRowFile(false, row, id, file, name)}
                  />
                ) : (
                  <span>点击编辑上传文件</span>
                )
              ]
            }
          }
        },
        {
          field: 'categoryCode',
          title: '操作',
          slots: {
            default: ({ row, rowIndex }) => [
              this.editCount === rowIndex ? (
                <el-button type="text" onClick={() => this.save(false, row)}>
                  保存
                </el-button>
              ) : (
                [
                  <el-button type="text" onClick={() => this.setEdit(rowIndex)}>
                    编辑
                  </el-button>,
                  <el-button type="text" onClick={() => this.handleDeleteList(row)}>
                    删除
                  </el-button>
                ]
              )
            ]
          }
        }
      ]
    }
  },

  watch: {
    'baseInfo.startDate'(val) {
      if (this.baseInfo.endDate) {
        this.baseInfo.duration = moment(this.baseInfo.endDate).diff(moment(val), 'days')
      }
    },
    'baseInfo.endDate'(val) {
      if (this.baseInfo.startDate) {
        this.baseInfo.duration = moment(val).diff(moment(this.baseInfo.startDate), 'days')
      }
    }
  },
  created() {
    let { id, isEdit } = this.$route.query
    this.isEdit = isEdit
    this.contractId = id
    if (isEdit) {
      Api.getContractById(id).then(res => {
        if (res.code === 200) {
          this.baseInfo = res.data
          this.baseInfo.supplyMaterialPeriod = res.data.supplyMaterialPeriod ? res.data.supplyMaterialPeriod - 0 : null
          this.checkList = (res.data.attachmentList &&
            res.data.attachmentList.map(r => {
              r.isEdit = 1
              return r
            })) || [{ name: '合同清单', fileName: null }]
          this.docForm = {
            eleFileList: res.data.electronicContractFileIds.split(','),
            paperFileList: res.data.paperContractFileIds.split(',')
          }
          if (this.docForm.eleFileList.length > 0) {
            FileApi.getFileList(this.docForm.eleFileList).then(res => {
              if (res.data) {
                this.eleFileUrlList = res.data
                this.eleFileUrlList1 = res.data
              }
            })
          }
          if (this.docForm.paperFileList.length > 0) {
            FileApi.getFileList(this.docForm.paperFileList).then(res => {
              if (res.data) {
                this.paperFileUrlList = res.data
                this.paperFileUrlList1 = res.data
              }
            })
          }
          this.tableData = res.data.attachmentList
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
      this.tableData = []
    }
    this.baseInfo.creatorName = this.$store.getters.name || 'admin'
  },
  methods: {
    async handleChange(data) {
      if (data.length > 0) {
        let res = await FileApi.getFileList(data)
        this.eleFileUrlList1 = [...res.data]
      } else {
        this.eleFileUrlList1 = []
      }
    },
    async handleChange2(data) {
      if (data.length > 0) {
        let res = await FileApi.getFileList(data)
        this.paperFileUrlList1 = [...res.data]
      } else {
        this.paperFileUrlList1 = []
      }
    },
    handleCancel() {
      this.$router.back()
    },
    handleSave() {
      if (!this.docForm.eleFileList.length) {
        this.$message.info('请上传电子版附件')
        return false
      }
      if (!this.docForm.paperFileList.length) {
        this.$message.info('请上传纸质版附件')
        return false
      }
      let ids = this.checkList[0].id ? [this.checkList[0].id] : []
      if (ids.length === 0) {
        this.$message.info('请上传清单项目')
        return false
      }
      this.$refs.baseInfoForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            Api.updateContractById({
              type: 2,
              ...this.baseInfo,
              electronicContractFileIds: this.docForm.eleFileList.join(','),
              paperContractFileIds: this.docForm.paperFileList.join(','),
              projectId: this.projectId,
              inventoryAttachmentIdList: ids,
              status: 0
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          } else {
            Api.addContract({
              type: 2,
              ...this.baseInfo,
              projectId: this.projectId,
              electronicContractFileIds: this.docForm.eleFileList.join(','),
              paperContractFileIds: this.docForm.paperFileList.join(','),
              inventoryAttachmentIdList: ids,
              status: 0
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          }
        } else {
          this.$message.info('请正确填写')
          return false
        }
      })
    },
    handleSubmit() {
      if (!this.docForm.eleFileList.length) {
        this.$message.info('请上传电子版附件')
        return false
      }
      if (this.baseInfo.status === 2) {
        if (!this.docForm.paperFileList.length) {
          this.$message.info('请上传纸质版附件')
          return false
        }
      }
      this.$refs.baseInfoForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            Api.updateContractById({
              type: 2,
              ...this.baseInfo,
              electronicContractFileIds: this.docForm.eleFileList.join(','),
              paperContractFileIds: this.docForm.paperFileList.join(','),
              projectId: this.projectId,
              inventoryAttachmentIdList: this.checkList.map(r => r.id),
              status: 1
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          } else {
            Api.addContract({
              type: 2,
              ...this.baseInfo,
              electronicContractFileIds: this.docForm.eleFileList.join(','),
              paperContractFileIds: this.docForm.paperFileList.join(','),
              projectId: this.projectId,
              inventoryAttachmentIdList: this.checkList.map(r => r.id),
              status: 1
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          }
        } else {
          this.$message.info('请正确填写')
          return false
        }
      })
    },
    setEdit(index) {
      if (this.baseInfo.materialSupplyPlanNum || this.baseInfo.materialSupplyConfirmBillNum) {
        this.$message.info('该清单下已有甲供材计划单或者材料确认单,不能更改')
        return
      }
      this.editCount = index
    },
    async handleDeleteList(row) {
      await Api.deleteInventoryAttachmentById(row.id)
      this.checkList = [{ name: '合同清单', fileName: null }]
    },
    getRowFile(isTotal, row, id, file, name) {
      row.fileId = id
      row.file = file
      row.fileName = name
      this.$refs.checkTable.$refs.table.$refs.vxeTable.reloadRow(row)
      this.save(false, row)
    },
    async save(isTotal, row) {
      if (!row.fileName) {
        this.$message.error('请选择文件')
        return
      }
      if (row.file) {
        let formData = new FormData()
        formData.append('file', row.file)
        formData.append('fileId', row.fileId)
        formData.append('contractId', this.contractId || '')
        formData.append('nameCode', 10)
        formData.append('contractType', 2)
        const res = await Api.addOrderFile(formData)
        //let res = await Api.addOrderFile1({ fileId: row.fileId, contractId: '', nameCode: 10, contractType: 2 })
        row.id = res.data
        this.$refs.checkTable.$refs.table.$refs.vxeTable.reloadRow(row)
        this.editCount = null
      } else {
        this.editCount = null
      }
    }
  }
}
</script>
<style lang="less" scoped>
.inputStyle {
  width: 300px;
}
/deep/ .el-upload {
  text-align: left !important;
}
</style>
