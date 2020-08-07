<template>
  <div class="indexWrapper">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="info">
      <div class="content">
        <h6 class="title">
          <img
            src="http://t8.baidu.com/it/u=1484500186,1503043093&fm=79&app=86&f=JPEG?w=1280&h=853"
            alt="未知错误"
            width="30px"
            height="30px"
            style="border-radius: 50%; vertical-align: middle;"
          />
          <span>{{ headData.name }}（{{ headData.code }}）</span>
        </h6>
      </div>
      <div class="status-box">
        <el-button-group>
          <el-button
            v-if="[1, 3, 5].includes(headData.type) && $hasPower('ContractMeasurementSmartDecoration')"
            :disabled="headData.status != 5"
            @click="$router.push('/contract-SmartDecoration/contractMeasurement')"
            >合同计量与支付</el-button
          >
        </el-button-group>
      </div>
    </div>
    <div class="divWrapper">
      <el-row>
        <el-col :span="6">
          <div class="infoCellLabel">合同金额（万元）</div>
          <div class="infoCellValue"><WanSpan :value="headData.amount" /></div>
        </el-col>
        <el-col :span="6">
          <div class="infoCellLabel">合同类型</div>
          <div class="infoCellValue">
            {{ $getLabel(contractType, headData.type) }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="infoCellLabel">合同状态</div>
          <div class="infoCellValue">
            {{ $getLabel(contractStatus, headData.status) }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="infoCellLabel">甲方</div>
          <div class="infoCellValue">{{ headData.firstParty }}</div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">签订日期</div>
            <div class="lrCellValue">{{ moment(headData.signDate).format('YYYY-MM-DD') }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">甲方联系人</div>
            <div class="lrCellValue">{{ headData.firstPartyLinkman }}</div>
          </div>
        </el-col>
        <el-col :span="6" :offset="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">创建人</div>
            <div class="lrCellValue">{{ headData.creatorName }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">合同工期</div>
            <div class="lrCellValue">{{ headData.duration }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">甲方联系电话</div>
            <div class="lrCellValue">{{ headData.firstPartyMobile }}</div>
          </div>
        </el-col>
        <el-col :span="6" :offset="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">创建时间</div>
            <div class="lrCellValue">{{ headData.createTime }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">开工日期</div>
            <div class="lrCellValue">{{ headData.startDate | ymd }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">乙方</div>
            <div class="lrCellValue">{{ headData.secondParty }}</div>
          </div>
        </el-col>
        <el-col :span="6" :offset="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">备注</div>
            <div class="lrCellValue">{{ headData.remark }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">竣工日期</div>
            <div class="lrCellValue">{{ headData.endDate | ymd }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">乙方联系人</div>
            <div class="lrCellValue">{{ headData.secondPartyLinkman }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">质保期（月）</div>
            <div class="lrCellValue">{{ headData.guaranteePeriod }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">乙方联系电话</div>
            <div class="lrCellValue">{{ headData.secondPartyMobile }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">工程类型</div>
            <div class="lrCellValue">
              {{ $getLabel(engineeringType, headData.engineeringType) }}
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">投资类型</div>
            <div class="lrCellValue">
              {{ $getLabel(investmentType, headData.investmentType) }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="divWrapper tabContainerOuter">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="合同附件" name="first"
          ><ContractAnnex ref="files" :fileUrl="fileUrl" :canUpload="headData.status === 2"></ContractAnnex
        ></el-tab-pane>
        <template v-if="headData.type === 1">
          <el-tab-pane label="甲供材材料单" name="second22" lazy>
            <CommonTabPane :contractId="headData.id" :module="11"></CommonTabPane
          ></el-tab-pane>
          <el-tab-pane label="BIM模型关联材料单" name="third22" lazy>
            <CommonTabPane :contractId="headData.id" :module="12"></CommonTabPane
          ></el-tab-pane>
        </template>
        <template v-if="[2, 4].indexOf(headData.type) >= 0">
          <el-tab-pane label="采购清单" name="fifth22" lazy>
            <CommonTabPane :contractId="headData.id" :module="13"></CommonTabPane
          ></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <template v-if="isCheck && headData.status !== 2">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="handleCancel">返回</el-button>
      <el-button v-if="headData.status === 2" :disabled="!allowClick" type="primary" @click="handleUploadPaperContract"
        >提交</el-button
      >
      <template v-if="isCheck">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
    <el-dialog title="选择人材机类型" :visible.sync="visible" width="400px">
      <div style="display: flex; justify-content: space-around;">
        <el-upload
          class="upload-demo"
          action="aaa"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :show-file-list="false"
          :on-success="handleSuccess"
          :http-request="params => uploadSectionFile(params, 1)"
          :inventoryCategory="1"
        >
          <el-button size="small">人材机(建筑)</el-button>
        </el-upload>
        <el-upload
          class="upload-demo"
          action="aaa"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :show-file-list="false"
          :on-success="handleSuccess"
          :http-request="params => uploadSectionFile(params, 2)"
          :inventoryCategory="2"
        >
          <el-button size="small">人材机(机电)</el-button>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ContractAnnex from './components/ContractAnnex'
import CommonTabPane from './components/CommonTabPane'
import Api from '../api/contractManage'
import contractType from '../lib/contractTypeSmartDecoration'
import investmentType from '@/lib/investmentType'
import contractStatus from '../lib/contractStatus'
import engineeringType from '@/lib/engineeringType'
import FileApi from '@/api/file'
import WanSpan from '@/views/contract/contractManage/components/WanSpan'
export default {
  name: 'Detail',
  components: {
    ContractAnnex,
    WanSpan,
    CommonTabPane //精装修统一tab
  },
  props: {
    inventoryCategory: {}
  },
  data() {
    return {
      visible: false,
      allowClick: true,
      projectId: localStorage.getItem('projectId'),
      investmentType,
      engineeringType,
      contractType,
      contractStatus,
      headData: {},
      activeName: 'first',
      fileList: [],
      fileUrl: {
        ele: [],
        paper: []
      }
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
    this.getDetail(id)
  },
  methods: {
    getDetail(id) {
      Api.getContractById(id).then(res => {
        if (res.code === 200) {
          this.headData = res.data
          let eleArr = res.data.electronicContractFileIds.split(',')
          let paperArr = res.data.paperContractFileIds.split(',')
          if (eleArr.length > 0) {
            FileApi.getFileList(eleArr).then(res => {
              if (res.data) {
                this.fileUrl.ele = res.data
              }
            })
          }
          if (paperArr.length > 0) {
            FileApi.getFileList(paperArr).then(res => {
              if (res.data) {
                this.fileUrl.paper = res.data
              }
            })
          }
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleSuccess(res, files, fileList) {},
    uploadSectionFile(params, type) {
      const file = params.file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('contractId', this.id)
      formData.append('projectId', this.projectId)
      formData.append('inventoryCategory', type)
      Api.uploadRCJ(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('上传成功')
          this.visible = false
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    //清单分解
    handleDisintegrate() {
      this.$router.push({ name: `ContractListDisintegrationSmartDecoration`, params: { id: this.id } })
    },
    handleDownload() {
      Api.downloadRCJ({
        contractId: this.contractId
      }).then(res => {
        this.download(res.data)
      })
    },
    download(data) {
      if (!data) {
        return
      }
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
      let fileName = '人材机模板.xls'
      if ('download' in document.createElement('a')) {
        // 不是IE浏览器
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
      } else {
        // IE 10+
        window.navigator.msSaveBlob(blob, fileName)
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleCancel() {
      this.$router.back()
    },
    //纸质版审核
    async handleUploadPaperContract() {
      this.allowClick = false
      let res = await this.$refs.files.handleSubmit(this.id)
      if (!res) this.allowClick = true
      if (res && res.code && res.code === 200) {
        this.$message.success('提交成功')
        this.$router.back()
      } else {
        this.allowClick = true
      }
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    },
    handleEmitForm(data) {
      console.log(data)
      Api.handleCheck(data).then(res => {
        if (res.code === 200) {
          this.$message.success('审核成功')
          this.$router.back()
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    showTalentDialog() {
      this.visible = true
    }
  }
}
</script>
<style lang="less" scoped>
.info {
  display: flex;
  background: #fff;
  padding: 10px;

  .title {
    margin: 0;
    padding: 10px;
    font-size: 20px;

    span {
      padding-left: 10px;
    }
  }

  .content {
    flex: 1;
  }

  .status-box {
    width: 600px;
    padding: 10px;
    text-align: right;
  }
}
.divWrapper {
  padding: 20px 50px;
  .infoCellLabel {
    font-size: 14px;
    color: #cccccc;
    height: 30px;
    line-height: 30px;
  }
  .infoCellValue {
    font-size: 16px;
  }
  .lrCellInfo {
    display: flex;
    height: 40px;
    .lrCellLabel {
      color: #cccccc;
      margin-right: 10px;
    }
  }
}
.tabContainerOuter {
  min-height: 200px;
  overflow: auto;
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
.upload-demo {
  display: inline-block;
}
</style>
