<template>
  <div class="wrap">
    <el-card class="aside">
      <div slot="header" class="card-header">
        <div>
          <el-button v-if="$hasPower('EarlyAddFileEpc')" type="primary" @click="addFile(null)">新增</el-button>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </div>
      </div>
      <ul class="list">
        <li
          v-for="item in list"
          :key="item.id"
          :class="['item', activeId === item.id ? 'active' : '']"
          @click="getInfo(item)"
        >
          <p :title="item.name">{{ item.name }}</p>
          <div class="btn-wrap">
            <el-button
              v-if="$hasPower('EarlyEditFileEpc')"
              type="primary"
              :disabled="item.taskStatus > 0"
              @click="addFile(item.id)"
              >编辑</el-button
            >
            <el-button type="danger" :disabled="item.taskStatus > 0" @click="delFile(item.id)">删除</el-button>
          </div>
        </li>
      </ul>
    </el-card>
    <el-card class="detail">
      <div slot="header" class="card-header">
        <div>
          <el-button
            v-if="$hasPower('EarlyAddTaskEpc')"
            type="primary"
            :disabled="_.isNil(activeId)"
            @click="addTask(null)"
            >新增</el-button
          >
          <el-button type="primary" :disabled="_.isNil(activeId)" @click="getTaskList">刷新</el-button>
        </div>
        <div>
          <span class="card-title">当前：{{ activeName }}</span>
          <el-button v-if="activeId" type="text" @click="goFileDetail">查看详情</el-button>
        </div>
      </div>
      <VXTable :tableData="tableData" :columns="tableColumn" :pageShow="false" />
    </el-card>
  </div>
</template>

<script>
import Api from '../api/executor'
import taskStatus from '@/views/earlyManage-epc/executor/lib/taskStatus'
import auditStatus from '@/views/earlyManage-epc/executor/lib/auditStatus'
import { saveAs } from 'file-saver'
export default {
  components: {},
  data() {
    return {
      activeId: this.$route.query.activeId || null,
      activeName: this.$route.query.activeName || null,
      list: [],
      tableData: [],
      taskStatus,
      auditStatus,
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'name',
          title: '任务名称'
        },
        {
          field: 'taskStatus',
          title: '任务状态',
          slots: {
            default: ({ row }) => [
              <span>
                {row.auditStatus === 0 || row.auditStatus === 2
                  ? this.$getLabel(taskStatus, row.taskStatus)
                  : this.$getLabel(auditStatus, row.auditStatus)}
              </span>
            ]
          }
        },
        {
          field: 'planStartTime',
          title: '计划开始时间',
          slots: {
            default: ({ row }) => [
              <span>{row.planStartTime ? moment(row.planStartTime).format('YYYY-MM-DD') : ''}</span>
            ]
          }
        },
        {
          field: 'planEndTime',
          title: '计划结束时间',
          slots: {
            default: ({ row }) => [<span>{row.planEndTime ? moment(row.planEndTime).format('YYYY-MM-DD') : ''}</span>]
          }
        },
        {
          field: 'actualStartTime',
          title: '实际开始时间'
        },
        {
          field: 'actualEndTime',
          title: '实际结束时间'
        },
        {
          field: 'executorName',
          title: '操作人'
        },
        {
          field: '',
          title: '操作',
          width: 200,
          slots: {
            default: ({ row }) => [
              row.auditStatus !== 1 && row.userType.includes(2) ? (
                <el-button type="text" onClick={() => this.goTaskDetail(row.id, 3)}>
                  查看
                </el-button>
              ) : null,
              row.auditStatus === 0 &&
              row.taskStatus === 0 &&
              row.userType.includes(2) &&
              this.$hasPower('EarlyEditTaskEpc') ? (
                <el-button type="text" onClick={() => this.addTask(row.id)}>
                  修改
                </el-button>
              ) : null,
              row.auditStatus === 0 && row.userType.includes(2) && this.$hasPower('EarlyDeleteFileEpc') ? (
                <el-button type="text" onClick={() => this.delFile(row.id)}>
                  删除
                </el-button>
              ) : null,
              row.auditStatus === 1 && row.userType.includes(2) && this.$hasPower('EarlyAuditTaskEpc') ? (
                <el-button type="text" onClick={() => this.goTaskDetail(row.id, 2)}>
                  审批
                </el-button>
              ) : null,
              row.auditStatus === 2 && row.userType.includes(2) && this.$hasPower('EarlydownloadFileEpc') ? (
                <el-button type="text" onClick={() => this.downloadFile(row)}>
                  下载
                </el-button>
              ) : null,
              //操作人
              row.auditStatus === 0 &&
              row.taskStatus === 0 &&
              row.userType.includes(1) &&
              this.$hasPower('EarlyStartTaskEpc') ? (
                <el-button type="text" onClick={() => this.startTask(row.id, 1)}>
                  开始任务
                </el-button>
              ) : null,
              row.auditStatus === 1 && row.userType.includes(1) ? (
                <el-button type="text" onClick={() => this.goTaskDetail(row.id, 3)}>
                  查看
                </el-button>
              ) : null,
              row.auditStatus === 0 &&
              row.taskStatus === 1 &&
              row.userType.includes(1) &&
              this.$hasPower('EarlyProgressTaskEpc') ? (
                <el-button type="text" onClick={() => this.goTaskDetail(row.id, 1)}>
                  填报进度
                </el-button>
              ) : null,
              row.auditStatus === 3 && row.userType.includes(1) && this.$hasPower('EarlyEditTaskChildEpc') ? (
                <el-button type="text" onClick={() => this.goTaskDetail(row.id, 1)}>
                  修改
                </el-button>
              ) : null,

              //游客
              row.userType.includes(0) ? (
                <el-button type="text" onClick={() => this.goTaskDetail(row.id, 3)}>
                  查看
                </el-button>
              ) : null
            ]
          }
        }
      ]
    }
  },
  watch: {
    activeId(val) {
      this.$router.replace({ query: { activeId: val, activeName: this.activeName } })
    },
    activeName(val) {
      this.$router.replace({ query: { activeId: this.activeId, activeName: val } })
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      const res = await Api.list({ page: 1, rows: 1000 })
      this.list = res.data.records
      this.getTaskList()
    },
    async getTaskList() {
      if (!this.activeId) {
        return
      }
      const res = await Api.taskList(this.activeId)
      this.tableData = res.data
    },
    getInfo(item) {
      this.activeId = item.id
      this.activeName = item.name
      this.getTaskList()
    },
    addFile(id) {
      _.isNil(id)
        ? this.$router.push({ name: `AddFileEpc` })
        : this.$router.push({ name: `EditFileEpc`, params: { id } })
    },
    addTask(id) {
      _.isNil(id)
        ? this.$router.push({ name: `AddTaskEpc`, params: { pid: this.activeId } })
        : this.$router.push({ name: `EditTaskEpc`, params: { id, pid: this.activeId } })
    },
    goFileDetail() {
      this.$router.push({ name: `FileDetailEpc`, params: { id: this.activeId } })
    },
    goTaskDetail(id, status) {
      if (status === 1) {
        this.$router.push({ name: `TaskDetailEpc`, params: { id, isEdit: true } })
      } else if (status === 2) {
        this.$router.push({ name: `TaskDetailEpc`, params: { id, isAudit: true } })
      } else if (status === 3) {
        this.$router.push({ name: `TaskDetailEpc`, params: { id, isDetail: true } })
      }
    },
    //开始任务
    async startTask(id) {
      await Api.startTask(id)
      this.$message.success('操作成功')
      this.getTaskList()
    },
    async downloadFile(row) {
      const res = await Api.downloadFile(row.fileId.split(','))
      saveAs(res.data, row.name)
    },
    async delFile(id) {
      await this.$confirm('确认删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await Api.delFile(id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  display: flex;
  .aside {
    /deep/.el-card__body {
      padding: 0;
    }
    flex: 0 0 400px;
    ul > li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 10px 4px 20px;
      height: 50px;
      color: #00a6ff;
      cursor: pointer;
      transition: all ease 0.2s;
      > p {
        flex: 1;
        overflow: hidden;
        margin-right: 20px;
      }
      .btn-wrap {
        display: none;
      }
      &.active {
        /*position: relative;*/
        background: #f2f2f2;
        .btn-wrap {
          flex: 0 0 130px;
          display: block;
        }
        /*&:after {*/
        /*  position: absolute;*/
        /*  content: '';*/
        /*  right: 20px;*/
        /*  top: 50%;*/
        /*  margin-top: -8px;*/
        /*  border-color: transparent transparent transparent #000;*/
        /*  border-width: 8px 8px 8px 16px;*/

        /*  border-style: solid;*/
        /*  !*background: #000;*!*/
        /*  !*width: 20px;*!*/
        /*  !*height: 20px;*!*/
        /*}*/
      }
    }
  }
  .card-title {
    font-weight: normal;
    margin-right: 10px;
  }
  .detail {
    flex: 1;
    margin-left: 10px;
  }
}
</style>
