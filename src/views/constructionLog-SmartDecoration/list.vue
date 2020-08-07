<template>
  <div class="container">
    <!-- 工具栏 start -->
    <el-form ref="form" :model="formData" inline>
      <el-row>
        <el-form-item>
          <el-input v-model="formData.search" style="width: 400px;" placeholder="编号/创建人" />
        </el-form-item>
        <el-form-item label="编制日期">
          <DateRange :startTime.sync="formData.beginTime" :endTime.sync="formData.endTime" />
        </el-form-item>
        <el-form-item v-if="$hasPower('ConstructionLogSmartDecorationCommentPCDetail')" label="批注状态">
          <el-select v-model="formData.commentStatus">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="已批注"></el-option>
            <el-option :value="0" label="未批注"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button-->
        <!--            v-if="$hasPower('NewConstructionLogSmartDecoration')"-->
        <!--            type="primary"-->
        <!--            icon="el-icon-plus"-->
        <!--            @click="toEdit(null)"-->
        <!--          >-->
        <!--            新建日志-->
        <!--          </el-button>-->
        <!--        </el-form-item>-->
      </el-row>
      <el-row>
        <el-col :span="24" style="margin-bottom: 20px;">
          <el-dropdown trigger="click" :hide-on-click="false">
            <el-button type="primary"> 新建<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            <!--          <span class="el-dropdown-link"> <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i> </span>-->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="toAddWorker">施工员版</el-dropdown-item>
              <el-dropdown-item @click.native="toAddManager">项目经理版</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
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

      <el-table-column prop="code" label="日志编号" min-width="100" />
      <el-table-column prop="todayWeather" label="天气" min-width="100" />
      <el-table-column prop="personNum" label="施工人数" min-width="100" />
      <el-table-column prop="remark" label="备注" min-width="100" />
      <el-table-column prop="creatorName" label="创建人" min-width="100" />
      <el-table-column prop="diaryDate" label="编制日期" min-width="100" />
      <el-table-column
        v-if="$hasPower('ConstructionLogSmartDecorationCommentPCDetail')"
        prop="diaryDate"
        label="批注状态"
        min-width="100"
      >
        <template slot-scope="scope">
          <span class="comment-status" :class="{ active: scope.row.commentStatus }">{{
            scope.row.commentStatus ? '已批注' : '未批注'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('ConstructionLogDetailSmartDecoration')" type="text" @click="toDetail(scope.row)"
            >查看</el-button
          >
          <!--          <el-button v-if="$hasPower('EditConstructionLogSmartDecoration')" type="text" @click="toEdit(scope.row.id)"-->
          <!--            >编辑</el-button-->
          <!--          >-->
          <!--          <el-button-->
          <!--            v-if="$hasPower('EditConstructionLogSmartDecorationDelete')"-->
          <!--            type="text"-->
          <!--            @click="remove(scope.row.id)"-->
          <!--            >删除</el-button-->
          <!--          >-->
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
        endTime: '',
        beginTime: '',
        companyId: '',
        projectId: '',
        commentStatus: '' // 批注状态
      },
      formDataBack: {},
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
    Object.assign(this.formDataBack, this.formData)
    this.getTableData()
  },
  // 方法集合
  methods: {
    getTableData() {
      this.tableLoading = true
      this.searchLoading = true
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
      // this.formData.search = ''
      // this.formData.commentStatus = ''
      // this.createTime = null
      // this.logDate = null
      // this.formData.beginTime = null
      // this.formData.endTime = null
      Object.assign(this.formData, this.formDataBack)
      this.getTableData()
    },
    toDetail(row) {
      if (row.type === 1) {
        this.$router.push({
          name: 'DetailWorkerConstructionLogSmartDecoration',
          query: {
            id: row.id
          }
        })
      } else {
        this.$router.push({
          name: 'DetailManagerConstructionLogSmartDecoration',
          query: {
            id: row.id
          }
        })
      }
    },
    toEdit(id) {
      this.$router.push({
        // path: `/constructionLog/listDetail`,
        name: 'NewConstructionLogSmartDecoration',
        query: {
          id: id
        }
      })
    },
    toAddWorker() {
      this.$router.push({
        name: 'AddWorkerConstructionLogSmartDecoration'
      })
    },
    toAddManager() {
      this.$router.push({
        name: 'AddManagerConstructionLogSmartDecoration'
      })
    },
    remove(id) {
      Api.getLogDelete(id).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          setTimeout(() => {
            this.getTableData()
          }, 500)
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
