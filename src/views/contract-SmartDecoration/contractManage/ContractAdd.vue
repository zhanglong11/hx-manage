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
              <el-form-item label="合同编号" label-width="130px" prop="code" style="margin-right: 20px;">
                <el-input v-model="baseInfo.code" placeholder="请输入合同编号" class="inputStyle"> </el-input>
              </el-form-item>
              <el-form-item label="合同名称" label-width="130px" prop="name" style="margin-right: 20px;">
                <el-input v-model="baseInfo.name" placeholder="请输入合同名称" class="inputStyle"> </el-input>
              </el-form-item>
              <el-form-item label="合同类型" label-width="130px" prop="type" style="margin-right: 20px;">
                <ContractTypeSelectSmartDecoration
                  v-model="baseInfo.type"
                  :hasAll="false"
                  class="inputStyle"
                ></ContractTypeSelectSmartDecoration>
              </el-form-item>
              <el-form-item label="合同金额(万元)" label-width="130px" prop="amount" style="margin-right: 20px;">
                <WanInput v-model="baseInfo.amount" class="inputStyle" />
                <!--                <WanSpan :value="0" />-->
              </el-form-item>
              <el-form-item label="签订日期" label-width="130px" prop="signDate" style="margin-right: 20px;">
                <el-date-picker
                  v-model="baseInfo.signDate"
                  type="date"
                  placeholder="请选择签订日期"
                  class="inputStyle"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="招采方式" label-width="130px" prop="purchaseMode" style="margin-right: 20px;">
                <el-select v-model="baseInfo.purchaseMode" class="inputStyle">
                  <el-option :value="1" label="招标"> </el-option>
                  <el-option :value="2" label="非招标"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="合同工期" label-width="130px" prop="duration" style="margin-right: 20px;">
                <el-input v-model.number="baseInfo.duration" disabled placeholder="请输入合同工期" class="inputStyle">
                </el-input>
              </el-form-item>
              <el-form-item label="开工日期" label-width="130px" prop="startDate" style="margin-right: 20px;">
                <el-date-picker
                  v-model="baseInfo.startDate"
                  type="date"
                  placeholder="请选择开工日期"
                  class="inputStyle"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="竣工日期" label-width="130px" prop="endDate" style="margin-right: 20px;">
                <el-date-picker
                  v-model="baseInfo.endDate"
                  type="date"
                  placeholder="请选择竣工日期"
                  class="inputStyle"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="质保期(月)" label-width="130px" prop="guaranteePeriod" style="margin-right: 20px;">
                <el-input v-model.number="baseInfo.guaranteePeriod" placeholder="请输入质保期" class="inputStyle">
                </el-input>
              </el-form-item>
              <el-form-item label="工程类型" label-width="130px" prop="engineeringType" style="margin-right: 20px;">
                <EngineeringTypeSelect
                  v-model="baseInfo.engineeringType"
                  :hasAll="false"
                  class="inputStyle"
                ></EngineeringTypeSelect>
              </el-form-item>
              <el-form-item label="投资类型" label-width="130px" prop="investmentType" style="margin-right: 20px;">
                <InvestmentTypeSelect
                  v-model="baseInfo.investmentType"
                  :hasAll="false"
                  class="inputStyle"
                ></InvestmentTypeSelect>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="甲方" label-width="130px" prop="firstParty" style="margin-right: 20px;">
                <el-select
                  v-if="partyType === 2"
                  v-model="baseInfo.firstPartyId"
                  allow-create
                  filterable
                  class="inputStyle"
                  @change="changeFirstParty"
                >
                  <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-input
                  v-else
                  v-model="baseInfo.firstParty"
                  :disabled="partyType === 1"
                  placeholder="请输入甲方名称"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="甲方联系人" label-width="130px" prop="firstPartyLinkman" style="margin-right: 20px;">
                <el-input
                  v-model="baseInfo.firstPartyLinkman"
                  :disabled="partyType === 1"
                  placeholder="请输入甲方联系人名称"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="甲方联系电话"
                label-width="130px"
                prop="firstPartyMobile"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model.number="baseInfo.firstPartyMobile"
                  :disabled="partyType === 1"
                  placeholder="请输入甲方联系电话"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="乙方" label-width="130px" prop="secondParty" style="margin-right: 20px;">
                <el-select
                  v-if="partyType === 1"
                  v-model="baseInfo.secondPartyId"
                  allow-create
                  filterable
                  class="inputStyle"
                  @change="changeSecondParty"
                >
                  <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-input
                  v-else
                  v-model="baseInfo.secondParty"
                  :disabled="partyType === 2"
                  placeholder="请输入乙方名称"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="乙方联系人"
                label-width="130px"
                prop="secondPartyLinkman"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model="baseInfo.secondPartyLinkman"
                  :disabled="partyType === 2"
                  placeholder="请输入乙方联系人名称"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="乙方联系电话"
                label-width="130px"
                prop="secondPartyMobile"
                style="margin-right: 20px;"
              >
                <el-input
                  v-model.number="baseInfo.secondPartyMobile"
                  placeholder="请输入乙方联系电话"
                  :disabled="partyType === 2"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="合同备注" label-width="130px" prop="remark" style="margin-right: 20px;">
                <el-input
                  v-model="baseInfo.remark"
                  type="textarea"
                  class="inputStyle"
                  placeholder="备注"
                  :autosize="{ minRows: 4, maxRows: 6 }"
                ></el-input>
              </el-form-item>
              <el-form-item label="创建人 " label-width="130px" prop="creatorName" style="margin-right: 20px;">
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
        <el-button type="text" style="float: right; padding: 3px 0;"
          ><a href="/contract/order.zip" download="清单模板.zip">下载清单范本</a></el-button
        >
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
                  :disabled="![2].includes(baseInfo.status)"
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
        </div>
        <EditTable
          v-if="baseInfo.type === 1"
          ref="table"
          v-model="detailList"
          :tableColumn="checkColumn"
          :validRules="validRules"
          :is-remove="false"
        />
        <EditTable
          v-else
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
      <el-button type="primary" @click="handleSubmit">保存并提交</el-button>
    </div>
  </div>
</template>
<script>
import contractStatus from '../lib/contractStatus'
import projectFileNameList from '../lib/projectFileNameList'
import projectFileTypeList from '../lib/projectFileTypeList'
import Api from '../api/contractManage'
import checkTel from '@/utils/checkTel'
import FileUploadWithImg from '_c/FileUploadWithImg/index'
import FileApi from '@/api/file'
import paramList from '@/lib/paramList'
import CostFile from './components/CostFile/index'
import WanInput from '@/views/contract/contractManage/components/WanInput'
import contractApi from '@/api/contract/contractManage'
export default {
  name: 'ContractAdd',
  components: { FileUploadWithImg, WanInput },
  data() {
    return {
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
        type: '',
        signDate: null,
        purchaseMode: '',
        startDate: '',
        endDate: '',
        guaranteePeriod: 0, //保质期
        engineeringType: '', //工程类型
        investmentType: '', //投资类型
        firstPartyId: '', // 甲方
        firstParty: '',
        firstPartyLinkman: '',
        firstPartyMobile: null,
        secondPartyId: '', // 乙方
        secondParty: '',
        secondPartyLinkman: '',
        secondPartyMobile: '',
        remark: '',
        creatorName: ''
      },
      baseInfoRule: {
        code: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
        amount: [
          { required: true, message: '合同金额不能为空', trigger: 'blur' },
          { type: 'number', message: '合同金额必须为数字值' }
        ],
        signDate: [{ required: true, message: '请选择签订日期', trigger: 'change' }],
        purchaseMode: [{ required: true, message: '请选择招采方式', trigger: 'change' }],
        startDate: [{ required: true, message: '请选择开工日期', trigger: 'change' }],
        endDate: [{ required: true, message: '请选择竣工日期', trigger: 'change' }],
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
        ]
      },
      contractStatus: contractStatus,
      projectFileNameList: projectFileNameList,
      projectFileTypeList: projectFileTypeList,
      validRules: {
        number: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }]
      },
      removeList: [],
      detailList: [],
      checkList: [{ name: '合同清单', fileName: null }],
      checkColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'nameCode',
          title: '项目文件名称',
          slots: {
            default: ({ row, rowIndex }) => [
              rowIndex === this.editCount ? (
                <el-select v-model={row.nameCode}>
                  {projectFileNameList.map(r => [
                    <el-option
                      label={r.label}
                      value={r.value}
                      key={row.value}
                      disabled={this.isNameDisabled(r.value, row)}
                    />
                  ])}
                </el-select>
              ) : (
                <span>{_.get(_.find(projectFileNameList, { value: row.nameCode }), 'label')}</span>
              )
            ]
          }
        },
        {
          field: 'categoryCode',
          title: '项目文件分类',
          slots: {
            default: ({ row }) => ['装修工程']
          }
          /*slots: {
            default: ({ row, rowIndex }) => [
              rowIndex === this.editCount ? (
                <el-select v-model={row.categoryCode}>
                  {paramList.projectType.map(r => [
                    <el-option
                      label={r.label}
                      value={r.value}
                      key={row.value}
                      disabled={this.isTypeDisabled(r.value, row)}
                    />
                  ])}
                </el-select>
              ) : (
                <span>{_.get(_.find(paramList.projectType, { value: row.categoryCode }), 'label')}</span>
              )
            ]
          }*/
        },
        {
          field: 'fileName',
          title: '上传文件',
          slots: {
            default: ({ row }) => [<span>{row.fileName ? row.fileName : '暂无文件'}</span>]
          }
        },
        {
          field: 'fileId',
          title: '上传',
          slots: {
            default: ({ row }) => [
              <CostFile
                isButton={true}
                multiple={false}
                onInput={(id, file, name) => this.getRowFile(true, row, id, file, name)}
              />
            ]
          }
        },
        {
          field: 'categoryCode',
          title: '操作',
          slots: {
            default: ({ row, rowIndex }) => [
              !row.isEdit ? (
                this.editCount === rowIndex ? (
                  <el-button type="text" onClick={() => this.save(true, row)}>
                    保存
                  </el-button>
                ) : (
                  <el-button type="text" onClick={() => this.setEdit(rowIndex)}>
                    编辑
                  </el-button>
                )
              ) : null,
              <el-button type="text" onClick={() => this.remove(row)}>
                删除
              </el-button>
            ]
          }
        }
      ],
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
          title: '上传文件',
          slots: {
            default: ({ row, rowIndex }) => [
              // <span>{this.editCount === rowIndex ? '' : row.fileName ? row.fileName : '暂无文件'}</span>
              <span>{row.fileName || '暂无文件'}</span>
            ]
          }
        },
        {
          field: 'fileId',
          title: '上传文件',
          slots: {
            default: ({ row, rowIndex }) => {
              console.log(row)
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
                <el-button type="text" onClick={() => this.setEdit(rowIndex)}>
                  编辑
                </el-button>
              )
            ]
          }
        }
      ],
      partyType: '', // 合同方 1甲方 2乙方
      companyList: [] // 公司列表
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
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
    this.init()
  },
  methods: {
    // 初始化
    init() {
      let { id, isEdit, partyType } = this.$route.query
      this.isEdit = isEdit
      this.contractId = id
      // 合同方 1甲方 2乙方
      this.partyType = partyType === 1 || partyType === '1' ? 1 : 2
      // 编辑合同
      if (isEdit) {
        Api.getContractById(id).then(res => {
          if (res.code === 200) {
            this.baseInfo = res.data
            if (this.baseInfo.type === 1) {
              this.detailList =
                (res.data.attachmentList &&
                  res.data.attachmentList.map(r => {
                    r.isEdit = 1
                    return r
                  })) ||
                []
            } else {
              this.checkList = (res.data.attachmentList &&
                res.data.attachmentList.map(r => {
                  r.isEdit = 1
                  return r
                })) || [{ name: '合同清单', fileName: null }]
            }
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
          } else {
            this.$message.error('未知错误,请重试')
          }
        })
      }
      this.setPartyTypeInfo()
      this.baseInfo.creatorName = this.$store.getters.name || 'admin'
    },
    // 设置合同方信息
    async setPartyTypeInfo() {
      this.queryCompany()
      if (this.isEdit) {
        return
      }
      let result = await contractApi.getCompanyInfo()
      let datas = result.data
      // 我是甲方
      if (this.partyType === 1) {
        this.baseInfo.firstPartyId = datas.id
        this.baseInfo.firstParty = datas.name
        this.baseInfo.firstPartyLinkman = datas.limkman
        this.baseInfo.firstPartyMobile = datas.linkmanMobile
      } else {
        // 我是乙方
        this.baseInfo.secondPartyId = datas.id
        this.baseInfo.secondParty = datas.name
        this.baseInfo.secondPartyLinkman = datas.limkman
        this.baseInfo.secondPartyMobile = datas.linkmanMobile
      }
    },
    // 根据项目id查询企业
    async queryCompany() {
      let result = await contractApi.queryCompany(this.projectId)
      let datas = result.data || []
      this.companyList = datas
    },
    // 选择甲方公司
    changeFirstParty(id) {
      let datas = _.find(this.companyList, { id })
      if (!datas) {
        datas = {
          name: id,
          limkman: '',
          linkmanMobile: ''
        }
      }
      this.baseInfo.firstParty = datas.name
      this.baseInfo.firstPartyLinkman = datas.limkman
      this.baseInfo.firstPartyMobile = datas.linkmanMobile
    },
    // 选择乙方公司
    changeSecondParty(id) {
      let datas = _.find(this.companyList, { id })
      if (!datas) {
        datas = {
          name: id,
          limkman: '',
          linkmanMobile: ''
        }
      }
      this.baseInfo.secondParty = datas.name
      this.baseInfo.secondPartyLinkman = datas.limkman
      this.baseInfo.secondPartyMobile = datas.linkmanMobile
    },
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
      if (this.isEdit) {
        this.removeList.map(async r => {
          await Api.deleteOrderById(r)
        })
      }
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
              ...this.baseInfo,
              electronicContractFileIds: this.docForm.eleFileList.join(','),
              paperContractFileIds: this.docForm.paperFileList.join(','),
              projectId: this.projectId,
              inventoryAttachmentIdList:
                this.baseInfo.type === 1 ? this.detailList.map(r => r.id) : this.checkList.map(r => r.id),
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
              ...this.baseInfo,
              projectId: this.projectId,
              electronicContractFileIds: this.docForm.eleFileList.join(','),
              paperContractFileIds: this.docForm.paperFileList.join(','),
              inventoryAttachmentIdList:
                this.baseInfo.type === 1 ? this.detailList.map(r => r.id) : this.checkList.map(r => r.id),
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
              ...this.baseInfo,
              electronicContractFileIds: this.docForm.eleFileList.join(','),
              paperContractFileIds: this.docForm.paperFileList.join(','),
              projectId: this.projectId,
              inventoryAttachmentIdList:
                this.baseInfo.type === 1 ? this.detailList.map(r => r.id) : this.checkList.map(r => r.id),
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
              ...this.baseInfo,
              electronicContractFileIds: this.docForm.eleFileList.join(','),
              paperContractFileIds: this.docForm.paperFileList.join(','),
              projectId: this.projectId,
              inventoryAttachmentIdList:
                this.baseInfo.type === 1 ? this.detailList.map(r => r.id) : this.checkList.map(r => r.id),
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
    remove(row) {
      row.id ? this.removeList.push(row.id) : null
      this.detailList = this.detailList.filter(d => d._XID !== row._XID)
    },
    isNameDisabled(code, row) {
      return (
        !!_.find(
          this.detailList.filter(e => e.categoryCode),
          { nameCode: code, categoryCode: row.categoryCode }
        ) || this.detailList.filter(e => e.nameCode === code).length === 2
      )
    },
    isTypeDisabled(code, row) {
      if (!row.nameCode) return false
      return !!_.find(this.detailList, { nameCode: row.nameCode, categoryCode: code })
    },
    setEdit(index) {
      this.editCount = index
    },
    getRowFile(isTotal, row, id, file, name) {
      row.fileId = id
      row.file = file
      row.fileName = name
      if (isTotal) {
        this.$refs.table.$refs.table.$refs.vxeTable.reloadRow(row)
      } else {
        this.$refs.checkTable.$refs.table.$refs.vxeTable.reloadRow(row)
      }
    },
    async save(isTotal, row) {
      if (!row.fileName) {
        this.$message.error('请选择文件')
        return
      }
      if (this.baseInfo.type === 1) {
        if (!row.nameCode) {
          this.$message.error('请选择项目文件名称')
          return false
        }
        /*if (!row.categoryCode) {
          this.$message.error('请选择项目文件分类')
          return false
        }*/
      }
      let formData = new FormData()
      formData.append('file', row.file)
      formData.append('fileId', row.fileId)
      formData.append('contractId', this.contractId || '')
      formData.append('nameCode', isTotal ? row.nameCode : 13)
      formData.append('contractType', this.baseInfo.type)
      formData.append('categoryCode', 3)
      const res = await Api.addOrderFile(formData)
      row.id = res.data
      if (isTotal) {
        this.$refs.table.$refs.table.$refs.vxeTable.reloadRow(row)
      } else {
        this.$refs.checkTable.$refs.table.$refs.vxeTable.reloadRow(row)
      }
      this.editCount = null
    }
  }
}
</script>
<style lang="less" scoped>
.inputStyle {
  width: 250px;
}
.addWrapper {
  height: 40px;
  line-height: 40px;
  margin: 10px 50px;
  border: 1px #585858 dashed;
  text-align: center;
}
/deep/ .el-upload {
  text-align: left !important;
}
.imgContainer {
  display: flex;
  .imgWrapper {
    width: 140px;
    height: 140px;
    margin: 10px;
    img {
      width: 100px;
      height: 100px;
      margin: 0 20px;
    }
    .fileName {
      font-size: 12px;
      text-align: center;
    }
  }
}
/deep/ .vxe-default-select option[disabled='disabled'] {
  color: #888888 !important;
  background-color: #585858;
}
.add-company {
  margin-bottom: 10px;
  width: 100%;
}
</style>
