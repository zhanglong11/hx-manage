<template>
  <div class="main">
    <el-row :gutter="20">
      <el-col :md="6">
        <!-- 项目列表 start -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>项目列表</span>
            <el-button
              style="float: right; padding: 3px 0;"
              type="text"
              @click="goToUrl('/work-bench/work-bench-project')"
            >
              查看更多
              <span class="el-icon-arrow-right" />
            </el-button>
          </div>
          <div class="list">
            <ul v-if="projectDataList.length > 0">
              <li v-for="(item, i) in projectDataList" :key="i">
                <el-badge :value="i + 1" :type="i < 3 ? 'success' : 'info'" />
                <router-link to="" class="title" @click.native="toProject(item)" v-text="item.name" />
                <el-tag size="mini" style="margin-right: 10px;">{{ item.code }}</el-tag>
                <span class="time">{{ item.projectDate | formatData }}</span>
              </li>
            </ul>
            <Empty v-else />
          </div>
        </el-card>
        <!-- 项目列表 end -->

        <el-row :gutter="20">
          <el-col :md="8">
            <el-card class="box-card">
              <router-link to="/work-bench/work-bench-project" class="quick-menu">
                <span class="el-icon-office-building icon" style="color: rgb(179, 127, 235);" />
                项目
              </router-link>
            </el-card>
          </el-col>
          <el-col v-if="$hasPower('WorkBenchHomeMessage')" :md="8">
            <el-card class="box-card">
              <router-link to="/work-bench/work-bench-message" class="quick-menu">
                <span class="el-icon-s-comment icon" style="color: rgb(255, 133, 192);" />
                消息
              </router-link>
            </el-card>
          </el-col>
          <el-col v-if="$hasPower('WorkBenchHomeApproval')" :md="8">
            <el-card class="box-card">
              <router-link to="/work-bench/work-bench-approval" class="quick-menu">
                <span class="el-icon-s-check icon" style="color: rgb(92, 219, 211);" />
                审核
              </router-link>
            </el-card>
          </el-col>
        </el-row>

        <!-- 我发起的 start -->
        <el-card v-if="$hasPower('WorkBenchHomeApproval')" class="box-card">
          <el-tabs v-model="tabIndex" type="card">
            <el-tab-pane :label="`我发起的(${meInitiatedTotal})`" name="0"></el-tab-pane>
            <el-tab-pane :label="`待办(${waitAuditTotal})`" name="1"></el-tab-pane>
            <el-tab-pane :label="`已办(${doneAuditTotal})`" name="2"></el-tab-pane>
          </el-tabs>
          <div class="table-list">
            <!-- 我发起的 start -->
            <div v-show="tabIndex === '0' && meInitiatedList.length > 0">
              <el-table :data="meInitiatedList" border stripe style="width: 100%;">
                <el-table-column prop="startTime" label="日期" width="180">
                  <template slot-scope="scope">
                    {{ scope.row.startTime | formatData }}
                  </template>
                </el-table-column>
                <el-table-column prop="processInstanceName" label="任务名称" show-overflow-tooltip width="180">
                  <template slot-scope="scope">
                    <span class="task-title" @click="viewTask(scope.row, 1)">{{ scope.row.processInstanceName }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="statusText" label="状态">
                  <template slot-scope="scope">
                    {{ scope.row.endTime ? '已结束' : '进行中' }}
                  </template>
                </el-table-column>
              </el-table>
              <el-button style="margin-top: 10px;" @click="goToRouter('WorkBenchApprovalMine')">
                查看更多
                <span class="el-icon-more"></span>
              </el-button>
            </div>
            <Empty v-if="tabIndex === '0' && meInitiatedList.length == 0" />
            <!-- 我发起的 end -->
            <!-- 待办 start -->
            <div v-show="tabIndex === '1' && waitAuditList.length > 0">
              <el-table :data="waitAuditList" border stripe style="width: 100%;">
                <el-table-column prop="createTime" label="日期" width="180">
                  <template slot-scope="scope">
                    {{ scope.row.createTime | formatData }}
                  </template>
                </el-table-column>
                <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip width="180">
                  <template slot-scope="scope">
                    <span class="task-title" @click="viewTask(scope.row, 0)">{{ scope.row.taskName }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="statusText" label="状态">待审批</el-table-column>
              </el-table>
              <el-button style="margin-top: 10px;" @click="goToRouter('WorkBenchApprovalTodo')">
                查看更多
                <span class="el-icon-more"></span>
              </el-button>
            </div>
            <Empty v-if="tabIndex === '1' && waitAuditList.length == 0" />
            <!-- 待办 end -->
            <!-- 已办 start -->
            <div v-show="tabIndex === '2' && doneAuditList.length > 0">
              <el-table :data="doneAuditList" border stripe style="width: 100%;">
                <el-table-column prop="createTime" label="日期" width="180">
                  <template slot-scope="scope">
                    {{ scope.row.createTime | formatData }}
                  </template>
                </el-table-column>
                <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip width="180">
                  <template slot-scope="scope">
                    <span class="task-title" @click="viewTask(scope.row, 1)">{{ scope.row.taskName }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="statusText" label="状态">已审批</el-table-column>
              </el-table>
              <el-button style="margin-top: 10px;" @click="goToRouter('WorkBenchApprovalDone')">
                查看更多
                <span class="el-icon-more"></span>
              </el-button>
            </div>
            <Empty v-if="tabIndex === '2' && doneAuditList.length == 0" />
            <!-- 已办 end -->
          </div>
        </el-card>
        <!-- 我发起的 end -->
      </el-col>
      <el-col :md="12">
        <!-- 地图区域 start -->
        <el-card class="box-card">
          <div class="map">占位</div>
        </el-card>
        <!-- 地图区域 end -->
      </el-col>
      <el-col v-if="$hasPower('WorkBenchHomeEvents') || $hasPower('WorkBenchHomeMessage')" :md="6">
        <!-- 大事记 start -->
        <el-card v-if="$hasPower('WorkBenchHomeEvents')" class="box-card">
          <div slot="header" class="clearfix">
            <span>大事记</span>
            <el-button
              style="float: right; padding: 3px 0;"
              type="text"
              @click="goToUrl('/work-bench/work-bench-events')"
            >
              查看更多
              <span class="el-icon-arrow-right" />
            </el-button>
          </div>
          <div class="list-timeline">
            <ul v-if="greatEventData.length > 0">
              <template v-for="(item, i) in greatEventData">
                <li :key="i">
                  <span class="time">
                    <span class="month">{{ item.timeMonth }}</span>
                    <span class="year">{{ item.timeYear }}</span>
                  </span>
                  <router-link
                    :to="`/work-bench/work-bench-events/${item.id}`"
                    :title="item.title"
                    class="title"
                    v-text="item.title"
                  />
                  <span class="status"><el-switch :value="true" disabled /></span>
                </li>
              </template>
            </ul>
            <Empty v-else />
          </div>
        </el-card>
        <!-- 大事记 end -->
        <!-- 消息 start -->
        <el-card v-if="$hasPower('WorkBenchHomeMessage')" class="box-card">
          <div slot="header" class="clearfix">
            <span>消息</span>
            <el-button
              style="float: right; padding: 3px 0;"
              type="text"
              @click="goToUrl('/work-bench/work-bench-message')"
            >
              查看更多
              <span class="el-icon-arrow-right" />
            </el-button>
          </div>
          <div class="list">
            <ul v-if="messageData.length > 0">
              <li v-for="(item, i) in messageData" :key="i">
                <span class="el-icon-message icon" />
                <span class="type">[{{ $enum.getDescByValue('MESSAGE_TYPE', item.type) }}]</span>
                <router-link :to="`/work-bench/work-bench-message/${item.id}`" class="title" v-text="item.title" />
                <span class="time">{{ item.createTime }}</span>
                <span class="status"><el-switch :value="item.status === 1" disabled /></span>
              </li>
            </ul>
            <Empty v-else />
          </div>
        </el-card>
        <!-- 消息 end -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
/**
  任务名称：task#2854 【智慧工地2.0-前端】工作台切图及功能开发
  开发人员：耿为刚
  日期：2020-04-01
**/
import { workBenchApi } from '../api/work-bench'
import { noticeApi } from '@/views/notice/api/notice'
import Empty from '@/components/empty-template/empty'

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    Empty
  },
  data() {
    //这里存放数据
    return {
      tabIndex: '0',
      projectDataList: [],
      greatEventData: [], // 大事件
      messageData: [], // 消息
      meInitiatedList: [], // 我发起的
      meInitiatedTotal: 0,
      waitAuditList: [], // 待办
      waitAuditTotal: 0,
      doneAuditList: [], // 已办
      doneAuditTotal: 0,
      taskQueryForm: {
        taskStatus: 0,
        page: 1,
        rows: 7
      }
    }
  },
  computed: {
    // 当前项目id
    currentProjectId() {
      return this.$store.state.project.projectId
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.init()
  },
  //方法集合
  methods: {
    // 初始化
    init() {
      this.queryTaskList(0) // 获取待办数据
      this.queryTaskList(1) // 获取已办数据
      this.queryInstanceActivitiList() // 我发起的流程
      this.queryProjectList()
      this.queryListMessage(1) // 查询消息
      this.queryEventList() // 查询大事记
    },
    // 获取任务列表
    async queryTaskList(taskStatus) {
      let params = Object.assign({}, this.taskQueryForm, { taskStatus })
      const result = await workBenchApi.queryTaskList(params)
      const datas = result.data
      let list = datas.records || []
      let total = datas.total || 0
      if (!taskStatus) {
        this.waitAuditList = list
        this.waitAuditTotal = total
      } else {
        this.doneAuditList = list
        this.doneAuditTotal = total
      }
    },
    // 我发起的流程
    async queryInstanceActivitiList() {
      const result = await workBenchApi.queryInstanceActivitiList(this.taskQueryForm)
      const datas = result.data || []
      let list = datas.records || []
      this.meInitiatedList = list
      this.meInitiatedTotal = datas.total || 0
    },
    // 查看任务
    viewTask(item, index) {
      let routerName = this.$enum.getDescByValue('APPROVAL_TYPE', item.processDefinitionCategory)
      if (routerName) {
        this.$store.commit('setApprovalType', {
          index,
          item,
          routerName,
          projectDataList: this.projectDataList
        })
      }
    },
    // 任务更多路由跳转
    goToRouter(name) {
      this.$router.push({
        name
      })
    },
    // 获取项目列表
    async queryProjectList() {
      const result = await workBenchApi.queryProjectList({ page: 1, rows: 999 })
      const datas = (result.data && result.data.records) || []
      this.projectDataList = datas
    },
    // 查询大事记
    async queryEventList() {
      let params = {
        page: 1,
        rows: 8,
        sortField: 'occur_time',
        sortValue: 'desc'
      }
      const result = await workBenchApi.queryEventList(params)
      const datas = result.data
      const list = datas.records || []
      list.map(item => {
        const time = item.occurTime && item.occurTime.substring(0, 10).split('-')
        item.timeYear = time[0]
        item.timeMonth = `${time[1]}-${time[2]}`
      })
      this.greatEventData = list
    },
    // 查询消息列表
    async queryListMessage(classification) {
      const params = {
        classification,
        page: 1,
        rows: classification === 3 ? 8 : 10
      }
      const result = await noticeApi.queryListMessage(params)
      const datas = result.data
      const list = datas.records || []
      list.map(item => {
        const time = item.createTime && item.createTime.substring(0, 10).split('-')
        item.timeYear = time[0]
        item.timeMonth = `${time[1]}-${time[2]}`
      })
      // 查询消息
      if (classification === 1) {
        this.messageData = list
      }
    },
    // 跳转项目详情
    toProject(item) {
      this.$store.commit('setProjectLocalStorage', item)
    },
    // 根据路由 path 跳转路由
    goToUrl(path) {
      this.$router.push({ path })
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../../../styles/color.less');
.main {
  padding: 0 !important;
  background: none !important;
  .map {
    background: url('../images/map5.png') no-repeat;
    background-position: center;
    background-size: cover;
    width: 100%;
    font-size: 0;
    border-radius: 10px;
    height: 945px;
  }
  a {
    color: #333;
    &:hover {
      color: @main-color;
    }
  }
  .box-card {
    margin-bottom: 20px;
    .list,
    .list-timeline {
      height: 300px;
      font-size: 14px;
      li {
        display: flex;
        align-items: center;
        height: 30px;
        line-height: 30px;
        .icon {
          margin-right: 10px;
          color: #999;
        }
        .el-badge {
          width: 40px;
        }
        .title {
          flex: 2;
          overflow: hidden;
          white-space: nowrap;
        }
        .progress {
          flex: 1;
        }
        .time {
          margin-right: 6px;
          color: @sub-base-color;
        }
        .type {
          margin-right: 6px;
          color: @sub-base-color;
        }
        /deep/sup {
          top: 0;
          &.el-badge__content--info {
            color: rgb(140, 140, 140);
            background-color: rgb(245, 245, 245);
          }
        }
      }
    }
    .list-timeline {
      height: 480px;
      li {
        margin-bottom: 10px;
        height: auto;
        line-height: 30px;
        border-bottom: 1px #e5e5e5 dotted;
        .time {
          margin-right: 15px;
          margin-bottom: -1px;
          padding: 5px;
          background: @sub-base-color;
          color: #fff;
          line-height: 20px;
        }
        .year {
          display: block;
        }
        .month {
          font-size: 20px;
          font-weight: bold;
        }
        .title {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          width: calc(100% - 50px);
          display: inline-block;
        }
      }
    }
    .table-list {
      height: 360px;
    }
  }
  .quick-menu {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 14px;
    .icon {
      margin-bottom: 10px;
      font-size: 32px;
    }
  }
  .task-title {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
