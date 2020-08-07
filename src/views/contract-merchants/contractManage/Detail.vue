<template>
  <div class="indexWrapper">
    <!-- 流程图 start -->
    <!-- <ViewFlow :id="id" />-->
    <!-- 流程图 end -->
    <div class="info">
      <div class="content">
        <h6 class="title">
          <img
            src="http://t8.baidu.com/it/u=1484500186,1503043093&fm=79&app=86&f=JPEG?w=30&h=30"
            alt="未知错误"
            width="30px"
            height="30px"
            style="border-radius: 50%; vertical-align: middle;"
          />
          <span>{{ headData.name }}（{{ headData.code }}）</span>
        </h6>
      </div>
      <div class="status-box"></div>
    </div>
    <div class="divWrapper">
      <el-row>
        <!--  <el-col :span="8">
          <div class="infoCellLabel">合同金额（万元）</div>
          <div class="infoCellValue"><WanSpan :value="headData.amount" /></div>
        </el-col>-->
        <el-col :span="8">
          <div class="infoCellLabel">合同类型</div>
          <div class="infoCellValue">
            {{ headData.type ? contractType.filter(item => item.value === headData.type)[0].label : '采购合同' }}
          </div>
        </el-col>
        <!--<el-col :span="6">
          <div class="infoCellLabel">合同状态</div>
          <div class="infoCellValue">
            {{
              headData.status !== null && headData.status !== undefined
                ? contractStatus.filter(item => item.value === headData.status)[0].label
                : ''
            }}
          </div>
        </el-col>-->
        <el-col :span="8">
          <div class="infoCellLabel">招采方式</div>
          <div class="infoCellValue">
            {{
              headData.purchaseMode !== null && headData.purchaseMode !== undefined
                ? headData.purchaseMode === 1
                  ? '招标'
                  : '非招标'
                : ''
            }}
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">创建人</div>
            <div class="lrCellValue">{{ headData.creatorName }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">创建时间</div>
            <div class="lrCellValue">{{ headData.createTime }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">质保期(月)</div>
            <div class="lrCellValue">{{ headData.guaranteePeriod }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">甲方</div>
            <div class="lrCellValue">{{ headData.firstParty }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">甲方联系人</div>
            <div class="lrCellValue">{{ headData.firstPartyLinkman }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">甲方联系电话</div>
            <div class="lrCellValue">{{ headData.firstPartyMobile }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">乙方</div>
            <div class="lrCellValue">{{ headData.secondParty }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">乙方联系人</div>
            <div class="lrCellValue">{{ headData.secondPartyLinkman }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">乙方联系电话</div>
            <div class="lrCellValue">{{ headData.secondPartyMobile }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">使用单位</div>
            <div class="lrCellValue">{{ headData.userCompanyName }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">使用单位联系人</div>
            <div class="lrCellValue">{{ headData.userCompanyLinkman }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">使用单位联系人电话</div>
            <div class="lrCellValue">{{ headData.userCompanyMobile }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">监理单位</div>
            <div class="lrCellValue">{{ headData.supervisionCompanyName }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">监理单位联系人</div>
            <div class="lrCellValue">{{ headData.supervisionCompanyLinkman }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">监理单位联系人电话</div>
            <div class="lrCellValue">{{ headData.supervisionCompanyMobile }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">项目负责人</div>
            <div class="lrCellValue">{{ headData.projectLinkman }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">项目负责人电话</div>
            <div class="lrCellValue">{{ headData.projectMobile }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">甲方项目工程师</div>
            <div class="lrCellValue">{{ headData.firstPartyEngineerLinkman }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">甲方项目工程师电话</div>
            <div class="lrCellValue">{{ headData.firstPartyEngineerMoblie }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">采购负责人</div>
            <div class="lrCellValue">{{ headData.purchaseLinkman }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">采购负责人电话</div>
            <div class="lrCellValue">{{ headData.purchaseMobile }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">甲供材单位</div>
            <div class="lrCellValue">{{ headData.supplyCompanyName }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">甲供材单位联系人</div>
            <div class="lrCellValue">{{ headData.supplyCompanyLinkman }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">甲供材单位联系人电话</div>
            <div class="lrCellValue">{{ headData.supplyCompanyMobile }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0;">
        <el-col :span="8">
          <div class="lrCellInfo">
            <div class="lrCellLabel">供货周期</div>
            <div class="lrCellValue">{{ headData.supplyMaterialPeriod }}</div>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="lrCellInfo">
            <div class="lrCellLabel">备注</div>
            <div class="lrCellValue">{{ headData.remark }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="divWrapper tabContainerOuter">
      <el-tabs v-model="activeName">
        <el-tab-pane label="合同附件" name="first" lazy
          ><ContractAnnex ref="files" :fileUrl="fileUrl" :canUpload="headData.status === 2"></ContractAnnex
        ></el-tab-pane>
        <el-tab-pane label="合同清单" name="fifth" lazy>
          <ContractOrderList :contractId="headData.id"></ContractOrderList
        ></el-tab-pane>
      </el-tabs>
    </div>

    <!-- <template v-if="isCheck && headData.status !== 2">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>-->
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
  </div>
</template>
<script>
import ContractAnnex from './components/ContractAnnex'
import ContractOrderList from './components/ContractOrderList'
import Api from '@/api/contract/contractManage/merchants'
import contractType from '@/lib/contractType'
import contractStatus from '@/lib/contractStatus'
import FileApi from '@/api/file'
export default {
  name: 'Detail',
  components: {
    ContractAnnex,
    ContractOrderList
  },
  props: {
    inventoryCategory: {}
  },
  data() {
    return {
      visible: false,
      allowClick: true,
      projectId: localStorage.getItem('projectId'),
      contractType,
      contractStatus,
      headData: {},
      activeName: 'first',
      tableData: [],
      total: 50,
      pageSize: 10,
      currentPage: 1,
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
      this.tableData = [{ id: 1, name: 1, type: 1, fileName: '分部分项工程和单价措施项目清单与计价表.xlsx' }]
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
    }
  }
}
</script>
<style lang="less" scoped>
.info {
  display: flex;
  background: #fff;
  //padding: 10px;
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
  padding: 10px 50px;
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
    align-items: center;
    padding: 2px 10px 2px 0;
    min-height: 30px;
    font-size: 16px;
    .lrCellLabel {
      color: #cccccc;
      margin-right: 10px;
    }
    .lrCellValue {
      flex: 1;
    }
  }
}
.tabContainerOuter {
  min-height: 400px !important;
  overflow: auto;
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
</style>
