<!--
 * @Description: 外部协作
 * @Author:
 * @Date: 2020-01-17 16:27:45
 -->
<template>
  <div>
    <el-form ref="pageQuery" :model="pageQuery" label-width="80px" class="search-form">
      <el-row :gutter="4">
        <el-col :span="6">
          <el-form-item label="文件名称" prop="name">
            <el-input v-model="pageQuery.name" placeholder="文件名称" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="起止时间">
            <el-date-picker
              v-model="time"
              style="width: 100%;"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <Table
      ref="table"
      v-loading="tableLoading"
      :tableData="tableData"
      :pageQuery="pageQuery"
      :total="total"
      rowId="id"
      :columns="tableColumn"
      @selectionChange="selectionChange"
      @getList="getList"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    />
  </div>
</template>
<script>
import PageMixin from '@/mixins/pageMixin'
import api from '@/api/design/file'
export default {
  mixins: [PageMixin],
  props: {
    // 里程碑id
    taskUniqueId: {}
  },
  data() {
    return {
      time: null,
      tableColumn: [
        { prop: 'name', label: '名称' },
        {
          prop: 'createTime',
          label: '创建时间'
        },
        {
          prop: 'creatorName',
          label: '创建人名称'
        },
        {
          prop: 'indate',
          label: '有效期（天）'
        },
        {
          prop: 'loseEfficacyTime',
          label: '失效时间'
        },
        {
          prop: 'password',
          label: '提取码'
        },
        {
          prop: 'url',
          label: '分享链接'
        }
      ],
      request: api.externalCollaborationList,
      pageQuery: {
        projectId: localStorage.getItem('projectId'),
        taskUniqueId: null
      },
      requestFlag: false
    }
  },
  watch: {
    taskUniqueId(val) {
      this.pageQuery.taskUniqueId = this.taskUniqueId
      this.getList()
    },

    time(val) {
      if (val) {
        this.pageQuery.startDate = moment(val[0]).format('YYYY-MM-DD HH:MM:SS')
        this.pageQuery.endDate = moment(val[1]).format('YYYY-MM-DD HH:MM:SS')
      } else {
        this.pageQuery.startDate = ''
        this.pageQuery.endDate = ''
      }
    }
  },
  methods: {
    getList() {
      this.pageQuery.taskUniqueId = this.taskUniqueId
      if (!this.taskUniqueId) return
      this.tableLoading = true
      this.request(this.pageQuery)
        .then(res => {
          // 基于接口统一处理
          this.tableLoading = false
          this.tableData = res.data.list ? res.data.list : res.data.records ? res.data.records : []
          //每个数据新增页码标志：便于对比
          this.tableData.forEach(e => {
            e.page = this.pageQuery.page
          })
          this.total = res.data.total ? res.data.total : 0
        })
        .catch(error => {
          this.tableLoading = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
.search-form {
  padding-top: 20px;
}
</style>
