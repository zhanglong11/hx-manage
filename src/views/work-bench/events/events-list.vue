<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-select v-model="queryForm.projectId" placeholder="选择项目" @change="search">
            <el-option v-for="item in projectDataList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.keyWords" style="width: 360px;" placeholder="标题" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addItem()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table :data="dataList" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="creatorName" label="发布人" />
      <el-table-column prop="createTime" label="发布时间" />
      <el-table-column prop="occurTime" label="事件时间" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="toDetails(scope.row.id)">查看</el-button>
          <el-button type="text" size="mini" @click="editItem(scope.row.id)">编辑</el-button>
          <el-button type="text" size="mini" @click="deleteEvent(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <p class="total">
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }} 页
      </p>
      <el-pagination
        background
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="queryForm.page"
        :page-size="queryForm.rows"
        :page-sizes="$pageConfig.pageSizes"
        @size-change="changePageSize"
        @current-change="changePageNumber"
      />
    </div>
  </div>
</template>

<script>
/**
  任务名称：task#2854 【智慧工地2.0-前端】工作台切图及功能开发
  开发人员：耿为刚
  日期：2020-04-01
**/
import { workBenchApi } from '../api/work-bench'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'WorkBenchEvents',
  components: {},
  data() {
    // 这里存放数据
    return {
      // 消息类型下拉框数据
      typeList: this.$enum.getValueDescList('MESSAGE_TYPE'),
      queryForm: {
        // 查询条件
        title: '',
        projectId: '',
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [],
      total: 0,
      projectDataList: [] // 项目列表
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryProjectList()
    this.queryList()
  },
  // 方法集合
  methods: {
    // 获取项目列表
    async queryProjectList() {
      const result = await workBenchApi.queryProjectList({ page: 1, rows: 999 })
      const datas = (result.data && result.data.records) || []
      let list = []
      datas.map(item => {
        list.push({
          label: item.name,
          value: item.id
        })
      })
      this.projectDataList = list
    },
    // 查询列表
    async queryList() {
      const result = await workBenchApi.queryEventList(this.queryForm)
      const datas = result.data
      const list = datas.records || []
      this.total = datas.total
      this.dataList = list
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryList()
    },
    // 重置
    reset() {
      Object.assign(this.queryForm, this.queryFormBack)
      this.queryList()
    },
    // 当前页码改变
    changePageNumber(pageNumber) {
      this.queryForm.pageNumber = pageNumber
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.pageNumber = 1
      this.queryForm.pageSize = pageSize
      this.queryList()
    },
    // 查看详情
    toDetails(id) {
      this.$router.push({
        name: 'WorkBenchEventsDetails',
        params: {
          id
        }
      })
    },
    // 新增大事记
    addItem() {
      this.$router.push({
        name: 'AddWorkBenchEvents'
      })
    },
    // 编辑大事记
    editItem(id) {
      this.$router.push({
        name: 'EditWorkBenchEvents',
        query: {
          id
        }
      })
    },
    // 删除大事记
    deleteEvent(id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteEventSuccess(id)
        })
        .catch(() => {})
    },
    // 删除大事记 - 异步
    async deleteEventSuccess(id) {
      await workBenchApi.deleteEvent(id)
      this.$message.success('删除成功')
      this.search()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.status {
  display: flex;
  align-items: center;
  i {
    margin-right: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00cc00;
  }
  &.status-2 i {
    background: #999;
  }
  &.status-3 i {
    background: #ff9900;
  }
}
</style>
