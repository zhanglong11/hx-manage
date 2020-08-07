<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <div>
        <ViewFlow :id="id"></ViewFlow>
      </div>
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>{{ isOver ? '竣工验收详情' : '工程初验详情' }}</strong>
          <el-button style="float: right; padding: 3px 0;" type="text" />
        </div>
        <div>
          <el-row>
            <el-col :span="8">
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">验收名称</div>
                  <div class="lrCellValue">{{ info.name }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">组织单位</div>
                  <div class="lrCellValue">{{ info.organizer }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">负责人</div>
                  <div class="lrCellValue">{{ info.principalName }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">填报时间</div>
                  <div class="lrCellValue">{{ info.actualAcceptanceTime | ymd }}</div>
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
                  <div class="lrCellLabel">附件</div>
                  <div class="lrCellValue"><FileList :ids="info.acceptanceFileId" /></div>
                </div>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">验收范围</div>
                  <div class="lrCellValue">{{ info.acceptanceScope }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">计划验收日期</div>
                  <div class="lrCellValue">{{ info.planAcceptanceTime | ymd }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">参加单位</div>
                  <div class="lrCellValue">{{ info.participant }}</div>
                </div>
              </el-row>
              <el-row class="rowLine">
                <div class="lrCellInfo">
                  <div class="lrCellLabel">填报人</div>
                  <div class="lrCellValue">{{ info.fillPersonName }}</div>
                </div>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card v-if="info.rectifyStatus !== 0" class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>参与方总体的验收结果</strong>
          <el-button style="float: right; padding: 3px 0;" type="text" />
        </div>
        <div>
          <InspectInfo type="inspect" :item-info="itemInfo"></InspectInfo>
        </div>
      </el-card>
      <div v-if="type === 'rectifier'">
        <TimeLine :info="info"></TimeLine>
        <div v-if="info.rectifyStatus === 4 && isCheck">
          <RectifyForm ref="rectifyForm"></RectifyForm>
        </div>
      </div>
      <div v-if="type === 'inspector'">
        <template v-if="info.acceptanceStatus === 2">
          <InspectForm ref="inspectForm"></InspectForm>
        </template>
        <template v-if="info.acceptanceStatus === 4">
          <InspectInfo type="inspect" :item-info="itemInfo"></InspectInfo>
        </template>
        <template v-if="info.acceptanceStatus === 5">
          <InspectInfo type="inspect" :item-info="itemInfo"></InspectInfo>
        </template>
      </div>
      <template v-if="isCheck">
        <CheckCard v-if="isCheck" :id="id" ref="checkCard"></CheckCard>
      </template>
    </div>
    <div class="footer-btn">
      <template v-if="isCheck">
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
      <template v-if="info.status === 0">
        <el-button type="primary" @click="handleSubmit(false)">保存</el-button>
        <el-button type="primary" @click="handleSubmit(true)">提交并审核</el-button>
      </template>
      <template v-if="type === 'inspector' && info.acceptanceStatus === 2">
        <el-button type="primary" @click="handleInspect(false)">保存</el-button>
      </template>
      <template v-if="type === 'rectifier' && info.rectifyStatus === 4 && isCheck">
        <el-button type="primary" @click="handleRectify(false)">保存</el-button>
      </template>
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import inspectStatus from '../lib/inspectStatus'
import rectifyStatus from '../lib/rectifyStatus'
import Api from '../api/inspect.js'
import InspectForm from '../component/InspectForm'
import RectifyForm from '../component/RectifyForm'
import InspectInfo from '../component/InspectInfo'
import TimeLine from '../component/TimeLine'
export default {
  name: 'FirstInspectDetail',
  components: { InspectForm, TimeLine, InspectInfo, RectifyForm },
  data() {
    return {
      inspectStatus,
      rectifyStatus,
      id: this.$route.params.id || '',
      isCheck: this.$route.params.isCheck || false,
      type: this.$route.query.type || '', //验收填报
      /**
       * 是竣工还是初检
       */
      isOver: this.$route.query.isOver || false,
      info: {},
      itemInfo: {}
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
      this.info = { ...res.data }
      this.itemInfo = {
        result: this.info.acceptanceStatus === 4 ? 1 : 0,
        opinion: this.info.acceptanceOpinion,
        inspectTime: this.info.actualAcceptanceTime,
        issueDesctiption: this.info.issueDesctiption || '',
        fileIds: this.info.resultFileId
      }
    },
    //审核操作
    async handleSubmit(isSubmit) {
      isSubmit ? await Api.submitById(this.id) : await Api.addById(this.id)
      this.$message.success('操作成功')
    },
    //验收提交
    async handleInspect() {
      let inspectFormData = await this.$refs.inspectForm.validForm()
      if (!inspectFormData) return
      await Api.inspect({ ...inspectFormData, id: this.id })
      this.$message.success('操作成功')
      this.$router.go(-1)
    },
    async handleRectify() {
      let rectifyFormData = await this.$refs.rectifyForm.validForm()
      if (!rectifyFormData) return
      await Api.rectify({ ...rectifyFormData, id: this.id })
      this.$message.success('操作成功')
      this.$router.go(-1)
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>
<style lang="less" scoped>
@import '../style.less';
</style>
