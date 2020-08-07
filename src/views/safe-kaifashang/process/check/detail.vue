<template>
  <div class="container no-padding is-footer">
    <el-card class="detail">
      <header slot="header" style="display: flex; align-items: center; justify-content: space-between;">
        <span>{{ form.planName }}</span>
        <div class="status-wrap">
          <h6>状态：</h6>
          <p>{{ $getLabel(rectifyStatusList, form.rectifyStatus) }}</p>
        </div>
      </header>
      <el-row :gutter="20">
        <el-col :span="12">
          <ul class="info-list">
            <li>
              <span>检查类型</span>
              <span>{{ $getLabel(planTypeList, form.planType) }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="12">
          <ul class="info-list">
            <li>
              <span>计划检查日期</span>
              <span v-if="form.inspectFrequency">
                <el-tag v-for="e in form.planInspectTime.split(',').sort()" :key="e" style="margin-right: 4px;">
                  {{ e | ymd }}
                </el-tag>
              </span>
            </li>
          </ul>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <ul class="info-list">
            <li>
              <span>检查性质</span>
              <span>{{ $getLabel(planNatureList, form.planNature) }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="12">
          <ul class="info-list">
            <li>
              <span>检查内容</span>
              <span>{{ form.inspectContent }}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <ul class="info-list">
            <li>
              <span>检查要求</span>
              <span>{{ form.inspectRequirements }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="12">
          <ul class="info-list">
            <li>
              <span>检查部门</span>
              <span>{{ form.inspectDeptName }}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <ul class="info-list">
            <li>
              <span>检查人</span>
              <span>{{ form.inspectPrincipalName }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="12">
          <ul class="info-list">
            <li>
              <span>检查执行人</span>
              <span>{{ form.inspectExecutorName }}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <ul class="info-list">
            <li>
              <span>{{ $store.state.project.projectType === 'decoration' ? '受检班组' : '受检部门' }}</span>
              <span>{{ form.beInspectedDeptName }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="12">
          <ul class="info-list">
            <li>
              <span>受检负责人</span>
              <span>{{ form.beInspectedPrincipalName }}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <ul class="info-list">
            <li>
              <span>备注</span>
              <span>{{ form.planRemark }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="12">
          <ul class="info-list">
            <li>
              <span>附件</span>
              <span>
                <AttachmentDialog :ids="form.planFileId" type="previewImage" />
              </span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-card>
    <div class="timeline">
      <div class="item">
        <div @click="type = null">
          <p>检查{{ ['未检查', '合格', '不合格'][form.inspectStatus] }}</p>
          <p>检查人:{{ form.inspectPrincipalName }}</p>
          <p>{{ form.actualInspectTime | ymd }}</p>
        </div>
      </div>
      <div v-for="item in timelineList" :key="item.type + item.rectifyReviewId" class="item">
        <div v-if="item.type === 'rectify'" @click="showRectify(item.rectifyReviewId)">
          <p>{{ item.statusText }}</p>
          <p>整改人:{{ item.rectifyPrincipalName }}</p>
          <p>{{ item.rectifyTime | ymd }}</p>
        </div>
        <div v-else @click="showReview(item.rectifyReviewId)">
          <p>{{ item.statusText }}</p>
          <p>复查人:{{ item.reviewPrincipalName }}</p>
          <p>{{ item.reviewTime | ymd }}</p>
        </div>
      </div>
    </div>

    <section v-if="!type" style="margin-top: 10px;">
      <el-card header="检查情况">
        <el-row :gutter="20">
          <el-col :span="12">
            <ul v-if="form.inspectStatus === 2" class="info-list">
              <li>
                <span>本次检查内容</span> <span>{{ form.aaa }}</span>
              </li>
              <li>
                <span>问题等级</span><span>{{ $getLabel(issueLevelList, form.issueLevel) }}</span>
              </li>
              <li>
                <span>紧急程度</span><span>{{ $getLabel(emergencyLevelList, form.emergencyLevel) }}</span>
              </li>
              <li>
                <span>问题描述</span><span>{{ form.issueDescription }}</span>
              </li>
              <li>
                <span>不合格位置</span><span>{{ form.badLocation }}</span>
              </li>
              <li>
                <span>不合格构件</span><span>{{ form.badNums || 0 }}个</span>
              </li>
            </ul>
          </el-col>
          <el-col :span="form.inspectStatus === 1 ? 24 : 12">
            <ul class="info-list" :class="{ is_qualified: form.inspectStatus === 1 }">
              <li v-if="form.inspectStatus === 1">
                <span>本次检查内容</span> <span>{{ form.inspectContent }}</span>
              </li>
              <li v-if="form.inspectStatus === 1"><span>检查结果</span> <span>合格</span></li>
              <li>
                <span>检查人</span><span>{{ form.inspectPrincipalName }}</span>
              </li>
              <li>
                <span>检查日期</span><span>{{ form.actualInspectTime | ymd }}</span>
              </li>
              <li>
                <span>现场照片</span>
                <span><AttachmentDialog img-width="120px" :ids="form.taskFileId" type="previewImage" /></span>
              </li>
              <li>
                <span>备注</span><span>{{ form.taskRemark }}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </el-card>
    </section>

    <section v-if="type === 'rectify'" style="margin-top: 10px;">
      <el-card header="整改情况">
        <el-row :gutter="30">
          <el-col :span="12">
            <ul class="info-list">
              <li>
                <span>整改人</span>
                <span>{{ rectifyReviewDetail.rectifyPrincipalName }}</span>
              </li>
              <li>
                <span>整改日期</span>
                <span>{{ rectifyReviewDetail.rectifyTime | ymd }}</span>
              </li>
              <li>
                <span>整改期限</span><span>{{ rectifyReviewDetail.rectifyDeadline }}</span>
              </li>
              <li>
                <span>整改要求</span><span>{{ rectifyReviewDetail.rectifyContent }}</span>
              </li>
            </ul>
          </el-col>
          <el-col :span="12">
            <ul class="info-list">
              <li>
                <span>整改照片</span>
                <div class="img-box">
                  <AttachmentDialog key="rectify" type="previewImage" :ids="rectifyReviewDetail.rectifyFileId" />
                </div>
              </li>
            </ul>
          </el-col>
        </el-row>
      </el-card>
    </section>

    <section v-else-if="type === 'review'" style="margin-top: 10px;">
      <el-card header="复查情况">
        <el-row :gutter="20">
          <el-col :span="12">
            <ul class="info-list">
              <li>
                <span>复查人</span>
                <span>{{ rectifyReviewDetail.reviewPrincipalName }}</span>
              </li>
              <li>
                <span>复查日期</span>
                <span>{{ rectifyReviewDetail.reviewTime | ymd }}</span>
              </li>
              <li>
                <span>是否合格</span>
                <span>{{ ['不合格', '合格'][rectifyReviewDetail.reviewResult] }}</span>
              </li>
              <li>
                <span>复查意见</span>
                <span>{{ rectifyReviewDetail.reviewOpinion }}</span>
              </li>
              <li><span>不合格位置</span><span>位置1，位置2</span></li>
              <li><span>不合格构件</span><span>位置1构件2，位置2构件1，位置3构件1</span></li>
            </ul>
          </el-col>
          <el-col :span="12">
            <ul class="info-list">
              <li>
                <span>复查照片</span>
                <div class="img-box">
                  <AttachmentDialog
                    key="review"
                    img-width="120px"
                    type="previewImage"
                    :ids="rectifyReviewDetail.reviewFileId"
                  />
                </div>
              </li>
            </ul>
          </el-col>
        </el-row>
      </el-card>
    </section>
    <!-- 批注组件 start -->
    <template v-if="$hasPower('SafeProcessCheckCommentPCDetail')">
      <AddComments
        :id="id"
        :type="form.planNature === 5 ? 'SafetyInspectRecord' : 'SafetyInspectRecord'"
        :canAdd="$hasPower('SafeProcessCheckCommentPCAdd')"
      />
    </template>
    <!-- 批注组件 end -->
    <div class="footerButton">
      <el-button @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script>
import inspectStatusList from './lib/inspectStatusList'
import rectifyStatusList from './lib/rectifyStatusList'
import issueLevelList from './lib/issueLevelList'
import emergencyLevelList from './lib/emergencyLevelList'
import planNatureList from './lib/planNatureList'
import planTypeList from './lib/planTypeList'

export default {
  name: 'Detail',
  data() {
    return {
      form: {},
      inspectStatusList,
      rectifyStatusList,
      issueLevelList,
      emergencyLevelList,
      planNatureList,
      planTypeList,
      type: '', // rectify,review
      timelineList: [],
      activeRectifyReviewId: null,
      rectifyReviewDetail: {}
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  watch: {
    activeRectifyReviewId(val) {
      this.axios.safety.get('rectify/get/' + val).then(res => {
        this.rectifyReviewDetail = res.data
      })
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await this.axios.safety.get('inspect/get/' + this.id)
      for (let item of res.data.historyDtoList) {
        this.timelineList.push({
          type: 'rectify',
          statusText: this.$getLabel(this.rectifyStatusList, item.rectifyStatus),
          ..._.pick(item, ['rectifyPrincipalName', 'rectifyReviewId', 'rectifyStatus', 'rectifyTime'])
        })
        if (item.reviewTime) {
          _.last(this.timelineList).statusText = '整改完成'
          this.timelineList.push({
            type: 'review',
            statusText: '复查' + ['不合格', '合格'][item.reviewResult],
            ..._.pick(item, ['rectifyReviewId', 'reviewPrincipalName', 'reviewResult', 'reviewTime'])
          })
        }
      }
      this.form = res.data
    },
    showRectify(id) {
      this.type = 'rectify'
      this.activeRectifyReviewId = id
    },
    showReview(id) {
      this.type = 'review'
      this.activeRectifyReviewId = id
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  color: #333;
  padding: 0 5px;
  .status-wrap {
    display: flex;
    align-items: center;
    h6 {
      color: #666;
    }
    p {
      font-weight: bold;
    }
    p + .el-button {
      margin-left: 20px;
    }
  }
}
.info-list {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  &.is_qualified {
    li {
      width: 50%;
    }
  }
  li {
    margin: 5px 0;
    width: 100%;
    padding-right: 50px;
    display: flex;
    align-items: flex-start;
    line-height: 30px;
    > span {
      &:first-child {
        flex-shrink: 0;
        color: #888;
        width: 120px;
        &::after {
          content: '：';
        }
      }
    }
  }
}
.timeline {
  display: flex;
  flex-wrap: wrap;
  margin: 10 -10px;
  .item {
    width: 120px;
    height: 120px;
    background-color: #00a6ff;
    color: #fff;
    margin: 10px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: 13px;
    border: 2px solid #fffc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    position: relative;
    & + .item {
      margin-left: 150px;
      &:before {
        content: '';
        display: block;
        width: 100px;
        height: 30px;
        position: absolute;
        top: 45px;
        left: -130px;
        background: url(~@/assets/images/arrow.png) no-repeat;
      }
    }
  }
}
</style>
