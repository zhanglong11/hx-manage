<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <!-- 流程图 start -->
      <ViewFlow :id="id" />
      <!-- 流程图 end -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <strong>查看中标资料</strong>
          <el-button style="float: right; padding: 3px 0;" type="text" />
        </div>
        <div>
          <el-row>
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">招标公告名称</div>
                    <div class="lrCellValue">{{ info.invitationBidName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">招标类型</div>
                    <div class="lrCellValue">{{ $getLabel(tenderTypeList, info.type) }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">中标单位</div>
                  <div class="lrCellValue">{{ info.tenderCompany }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">项目经理</div>
                  <div class="lrCellValue">{{ info.projectManager }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">公示日期</div>
                  <div class="lrCellValue">{{ info.publicityDate | ymd }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">联合体工作范围</div>
                  <div class="lrCellValue">{{ info.comboWorkingRange }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">备注</div>
                  <div class="lrCellValue">{{ info.remark }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">创建人</div>
                  <div class="lrCellValue">{{ info.creatorName }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">附件</div>
                  <div class="lrCellValue"><FileList :ids="info.fileIds" /></div>
                </div>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">招标公告编码</div>
                  <div class="lrCellValue">{{ info.invitationBidCode }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">中标方式</div>
                    <div class="lrCellValue">{{ $getLabel(tenderModeList, info.mode) }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">中标金额</div>
                  <div class="lrCellValue">{{ info.tenderMoney }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">电话</div>
                  <div class="lrCellValue">{{ info.mobile }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">是否联合体中标</div>
                  <div class="lrCellValue">{{ info.isCombo === 1 ? '是' : '不是' }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">评审专家</div>
                  <div class="lrCellValue">{{ info.evaluationExpert }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">创建时间</div>
                  <div class="lrCellValue">{{ info.createTime }}</div>
                </div>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card" style="margin-top: 15px;">
        <div slot="header" class="clearfix">
          <strong>管理人员明细</strong>
          <el-button style="float: right; padding: 0;" type="text" />
        </div>
        <div>
          <Grid ref="table" :request="request">
            <vxe-table-column type="seq" title="序号" width="50" />
            <vxe-table-column field="name" title="姓名" />
            <vxe-table-column field="idcardNumber" title="身份证号" />
            <vxe-table-column field="mobile" title="联系电话" />
            <vxe-table-column field="credentials" title="资格证书" />
            <vxe-table-column field="qualificationLevel" title="资格等级" />
            <vxe-table-column field="remark" title="备注" />
          </Grid>
        </div>
      </el-card>
      <template v-if="isCheck">
        <CheckCard :id="id" ref="checkCard"></CheckCard>
      </template>
    </div>
    <div class="footer-btn">
      <template v-if="isCheck">
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import statusList from '../lib/status'
import publicStatusList from '../lib/publicStatus'
import Api from '../api'
export default {
  name: 'TenderDetail',
  data() {
    return {
      statusList,
      publicStatusList,
      info: {},
      id: this.$route.params.id || '',
      isCheck: this.$route.params.isCheck || false,
      request: body => {
        //return Promise.resolve({ list: this.info.personParamDTOList })
        return Api.getWinningDetail(this.id).then(res => {
          return { list: res.data.personParamDTOList, total: res.data.personParamDTOList.length }
        })
      }
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
    if (this.id) {
      this.getDetail()
    }
  },
  mounted() {},
  methods: {
    async getDetail() {
      const res = await Api.getWinningDetail(this.id)
      this.info = { ...res.data }
    },
    approval() {
      this.$refs.checkCard.audit()
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
