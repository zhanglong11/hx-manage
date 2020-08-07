<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <!-- 流程图 start -->
      <ViewFlow :id="id" />
      <!-- 流程图 end -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>查看招标公告</strong>
          <el-button style="float: right; padding: 3px 0;" type="text" />
        </div>
        <div>
          <el-row>
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">招标公告名称</div>
                    <div class="lrCellValue">{{ info.name }}</div>
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
                  <div class="lrCellLabel">公告发布日期</div>
                  <div class="lrCellValue">{{ info.publishDate | ymd }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">开标地点</div>
                  <div class="lrCellValue">{{ info.address }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">发布状态</div>
                  <div class="lrCellValue">{{ $getLabel(publicStatusList, info.publishStatus) }}</div>
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
                  <div class="lrCellValue">{{ info.code }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <el-col :span="16">
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">招标方式</div>
                    <div class="lrCellValue">{{ $getLabel(tenderModeList, info.mode) }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">投标截止日期</div>
                  <div class="lrCellValue">{{ info.endDate | ymd }}</div>
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
                  <div class="lrCellLabel">状态</div>
                  <div class="lrCellValue">{{ $getLabel(statusList, info.auditStatus) }}</div>
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
      id: this.$route.params.id || '',
      isCheck: this.$route.params.isCheck || false,
      info: {}
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
      const res = await Api.getTenderDetail(this.id)
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
