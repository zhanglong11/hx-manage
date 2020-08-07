<template>
  <div class="container">
    <!-- 工具栏 start -->
    <el-form ref="form" :model="formData" inline>
      <el-form-item>
        <el-input v-model="formData.search" style="width: 477px;" placeholder="施工内容/主要记事/创建人" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="createTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="日志日期">
        <el-date-picker
          v-model="logDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
          <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
        </el-button-group>
      </el-form-item>
      <br />
      <el-form-item>
        <el-button v-if="$hasPower('ConstructionLogAdd')" type="primary" icon="el-icon-plus" @click="toEdit"
          >新建</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 工具栏 end -->

    <el-table
      v-loading="tableLoading"
      :data="logList"
      style="width: 100%;"
      element-loading-text="数据加载中..."
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column type="index" :index="indexMethod" label="序号" width="80" />
      <el-table-column prop="diaryDate" label="日志日期" min-width="100" />
      <el-table-column prop="code" label="日志编号" min-width="100" />
      <el-table-column prop="chargePersonName" label="项目负责人" min-width="100" />
      <el-table-column prop="afternoonWeather" label="今日天气" min-width="100" />
      <el-table-column prop="constructionPersonCount" label="施工人数" min-width="100" />
      <el-table-column prop="remark" label="备注" min-width="100" />
      <el-table-column prop="creator" label="创建人" min-width="100" />
      <el-table-column prop="createTime" label="创建时间" min-width="100" />
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('ConstructionLogDetail')" type="text" @click="toDetail(scope.row.id)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page.current"
      :page-sizes="[10, 20]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
/*
 * @Author: 许雷 创建
 * @Date: 2020-06-29
 * @Last Modified by: 许雷
 */
import Api from './api/constructionLog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ConstructionLogList',
  components: {},
  data() {
    return {
      createTime: null,
      logDate: null,
      searchLoading: false,
      tableLoading: false,
      formData: {
        search: '',
        createEndTime: '',
        createbeginTime: '',
        diaryDateEndTime: '',
        diaryDatebeginTime: '',
        companyId: '',
        projectId: ''
      },
      page: {
        current: 1,
        size: 10, // 每页条数 必须与page-sizes一致
        total: 0
      },
      logList: []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    let projectId = localStorage.getItem('projectId')
    this.formData.projectId = projectId ? projectId : this.$store.state.project.projectId
    this.formData.companyId = this.$store.getters.companyId
    this.getTableData()
  },
  // 方法集合
  methods: {
    getTableData() {
      this.tableLoading = true
      this.searchLoading = true
      this.formData.createbeginTime = this.createTime ? this.createTime[0] : ''
      this.formData.createEndTime = this.createTime ? this.createTime[1] : ''
      this.formData.diaryDatebeginTime = this.logDate ? this.logDate[0] : ''
      this.formData.diaryDateEndTime = this.logDate ? this.logDate[1] : ''
      const param = Object.assign(this.formData, {
        page: this.page.current,
        rows: this.page.size
      })
      Api.getLogList(param)
        .then(res => {
          this.logList = res.data.records
          this.page.total = res.data.total
        })
        .finally(() => {
          this.tableLoading = false
          this.searchLoading = false
        })
    },
    handleSizeChange(val) {
      this.page.size = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getTableData()
    },
    onSearch() {
      this.getTableData()
    },
    onReset() {
      this.formData.search = ''
      this.createTime = null
      this.logDate = null
      this.getTableData()
    },
    toEdit() {
      this.$router.push({
        name: `NewConstructionLog`
      })
    },
    toDetail(id) {
      this.$router.push({
        path: `/constructionLog/listDetail`,
        query: {
          id: id
        }
      })
    },
    indexMethod(index) {
      return index + 1
    }
  }
}
</script>
<style lang="less" scoped></style>
