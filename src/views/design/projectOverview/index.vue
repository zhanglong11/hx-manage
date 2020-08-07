<!--
 * @Description: 项目概况
 * @Author:
 * @Date: 2020-01-14 09:38:48
 -->
<template>
  <div>
    <section>
      <Flow idSelect="projectOverview" :height="300" title="项目标题" />
    </section>
    <section class="project">
      <div class="left">
        <p class="project-title">{{ baseInfo.name }}</p>
        <div class="project-desc">
          <el-row :gutter="4">
            <el-col :span="12">
              <span class="project-desc-label">项目编号：</span>
              <span>{{ baseInfo.code }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">项目类型：</span>
              <span>{{ projectFilter('type', baseInfo.type) }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">项目负责人：</span>
              <span>{{ projectFilter('baseInfo', 'principalName') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">项目日期：</span>
              <span>{{ projectFilter('baseInfo', 'projectDate', true) }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">项目地址：</span>
              <span>{{ projectFilter('baseInfo', 'address') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">联系电话：</span>
              <span>{{ projectFilter('baseInfo', 'telephone') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">项目规模：</span>
              <span>{{ projectFilter('extInfo', 'scale') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">勘察单位：</span>
              <span>{{ projectFilter('extInfo', 'mainContractor') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">建设单位：</span>
              <span>{{ projectFilter('extInfo', 'constructionUnit') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">监理单位：</span>
              <span>{{ projectFilter('extInfo', 'supervisingUnit') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">施工单位：</span>
              <span>{{ projectFilter('extInfo', 'constructionOrganization') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">设计单位：</span>
              <span>{{ projectFilter('extInfo', 'designOrganization') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">建筑层数：</span>
              <span>{{ projectFilter('extInfo', 'buildingFloorNum') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">建筑高度：</span>
              <span>{{ projectFilter('extInfo', 'buildingHeight') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">建筑面积（平方米）：</span>
              <span>{{ projectFilter('extInfo', 'buildingArea') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">结构形式：</span>
              <span>{{ projectFilter('extInfo', 'structuralStyle') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">工程造价（万元）：</span>
              <span>{{ projectFilter('extInfo', 'constructionCosts') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">抗震等级：</span>
              <span>{{ projectFilter('extInfo', 'seismicLevel') }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">合同开工日期：</span>
              <span>{{ projectFilter('extInfo', 'startTime', true) }}</span>
            </el-col>
            <el-col :span="12">
              <span class="project-desc-label">合同竣工日期：</span>
              <span>{{ projectFilter('extInfo', 'endTime', true) }}</span>
            </el-col>
            <el-col :span="24">
              <span class="project-desc-label">备注：</span>
              <span>{{ projectFilter('extInfo', 'remark') }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="right">
        <!-- onerror方法：需要img标签src必须有值，否则加载不了 -->
        <img :src="baseInfo.thumb ? baseInfo.thumb : '123'" class="project-img" :onerror="imgError" />
        <div v-if="extInfo" class="project-status">{{ projectFilter('status', extInfo.projectStatus) }}</div>
      </div>
    </section>
    <div v-if="extInfo && extInfo.projectStatus === '1'" class="project-btn">
      <el-button
        v-access="'projectOverview-start'"
        type="primary"
        size="medium"
        style="margin-right: 20px;"
        @click="projectStart"
        >项目启动</el-button
      >
    </div>
  </div>
</template>
<script>
import Flow from '@/views/design/components/Flow'
import api from '@/api/design/projectOverview'
import projectStatus from '@/lib/projectStatus'
import projectType from '@/lib/projectType'
export default {
  name: 'ProjectOverview',
  components: {
    Flow
  },
  data() {
    return {
      imgError: 'this.src="' + require('../../../assets/404_images/404.png') + '"'
    }
  },
  computed: {
    baseInfo() {
      return this.$store.state.design.projectDetail.baseInfo
    },
    extInfo() {
      return this.$store.state.design.projectDetail.extInfo
    },
    currentProjectId() {
      return this.$store.state.project.projectId
    }
  },
  methods: {
    async projectStart() {
      let res = await api.projectStart(this.currentProjectId)
      // 更新状态
      this.$store.dispatch('design/getProjectDetail')

      return this.$message.success('项目启动成功')
    },
    projectFilter(type, val, timeFlag = false) {
      if (type === 'status') {
        return _.get(
          projectStatus.find(item => item.value === val),
          'label',
          '-'
        )
      } else if (type === 'type') {
        return _.get(
          projectType.find(item => item.value === val),
          'label',
          '-'
        )
      } else if (timeFlag) {
        let date = _.get(this[type], val)
        if (date) {
          return moment(date).format('YYYY-MM-DD')
        } else {
          return '-'
        }
      } else {
        return _.get(this[type], val, '-') ? _.get(this[type], val, '-') : '-'
      }
    },
    async getProjectDetails() {
      await this.$store.dispatch('design/getProjectDetail')
    }
  }
}
</script>
<style lang="less" scoped>
.project {
  display: flex;
  justify-content: space-between;
  margin-bottom: 120px;
  &-title {
    font-size: 22px;
    font-weight: 900;
  }
  .left {
    width: 52%;
  }
  .right {
    width: 46%;
  }
  &-img {
    width: 100%;
    max-height: 350px;
  }
  &-status {
    font-size: 30px;
    color: red;
    text-align: right;
  }
  &-desc-label {
    color: rgb(153, 153, 153);
  }
  &-btn {
    position: fixed;
    bottom: 0;
    height: 70px;
    background: #fff;
    -webkit-box-shadow: 0 10px 10px lightgrey;
    box-shadow: 0 10px 10px 10px lightgrey;
    width: 100%;
    right: 0;
    text-align: right;
    line-height: 70px;
    &-button {
      margin-right: 30px;
    }
  }
  &-desc {
    /deep/ .el-col {
      padding-top: 14px;
    }
  }
}
</style>
