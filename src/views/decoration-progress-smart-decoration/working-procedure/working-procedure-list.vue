<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-select v-model="queryForm.cateogry" clearable placeholder="模板分类" @change="handleCategoryChange">
            <el-option
              v-for="item in cateogryList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.templateId" clearable placeholder="模板名称" @change="search">
            <el-option
              v-for="item in computedTemplateList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.status !== 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.name" style="width: 360px;" placeholder="楼号或地面名称" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$hasPower('ProgressAddWorkingProcedureSmartDecoration')"
            type="primary"
            icon="el-icon-plus"
            @click="addItem()"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table :data="dataList" border stripe size="small">
      <el-table-column type="index" width="60" align="center" label="序号" />
      <el-table-column prop="templateName" label="模板名称" min-width="140" />
      <el-table-column prop="templateCategory" label="模板分类" min-width="140">
        <template slot-scope="scope">
          {{ $getLabelFromArg('templateCategory', scope.row.templateCategory) }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="140" />
      <el-table-column prop="planStartTime" label="计划开始时间" min-width="140" />
      <el-table-column prop="updateTime" label="最近更新时间" min-width="140" />
      <el-table-column prop="creatorName" label="提交人" min-width="140" />
      <el-table-column v-if="$hasPower('ProgressDownloadSmartDecoration')" label="下载样板间" min-width="140">
        <a v-if="row.sampleRoomUrl" slot-scope="{ row }" download :href="row.sampleRoomUrl">下载</a>
      </el-table-column>
      <el-table-column label="操作" width="260" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="$hasPower('ProgressScheduleViewSmartDecoration')"
            type="text"
            @click="handleItemView(scope.row.id)"
            >查看</el-button
          >

          <template v-if="scope.row.status === 0">
            <el-button
              v-if="$hasPower('ProgressAddWorkingProcedureSmartDecoration')"
              type="text"
              size="mini"
              @click="editItem(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              v-if="$hasPower('ProgressPublishProcedureSmartDecoration')"
              type="text"
              size="mini"
              @click="publishItem(scope.row)"
              >发布</el-button
            >
            <el-button
              v-if="$hasPower('ProgressDeleteProcedureSmartDecoration')"
              type="text"
              size="mini"
              @click="deleteItem(scope.row.id)"
              >删除</el-button
            >
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <p class="total">
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }}
        <el-button type="text primary" class="el-icon-refresh" @click="queryList()" />
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
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-31
 * @Last Modified by: gengweigang
 */
/**
  任务名称：task#2867 【智慧工地2.0-前端】工序进度模块功能开发
  开发人员：耿为刚
  日期：2020-04-03
  任务类型：全新代码
**/
import { processProgressApi } from '../api/process-progress'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ProgressWorkingProcedureSmartDecoration',
  components: {},
  data() {
    // 这里存放数据
    return {
      cateogryList: this.$getArgList('templateCategory'), // 模板分类下拉框数据
      templateList: [], // 总的模板列表
      computedTemplateList: [], //用来展示的模板列表
      queryForm: {
        // 查询条件
        name: '',
        projectId: this.$store.state.project.projectId,
        templateId: '',
        page: 1,
        rows: this.$pageConfig.pageSize,
        cateogry: ''
      },
      queryFormBack: {},
      dataList: [],
      total: 0
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryTemplateListWorking()
    this.queryList()
  },
  // 方法集合
  methods: {
    // 查询列表
    async queryTemplateListWorking() {
      let params = {
        // 查询条件
        projectId: this.$store.state.project.projectId,
        cateogry: '',
        name: '',
        page: 1,
        rows: 200
      }
      const result = await processProgressApi.queryTemplateListWorking(params)
      const datas = result.data
      const list = datas.records || []
      this.templateList = list
      this.computedTemplateList = [...list]
    },
    // 查看

    handleItemView(id) {
      this.$router.push({
        name: 'ProgressAddWorkingProcedureDetailSmartDecoration',
        params: {
          id
        }
      })
    },
    //模板分类选择后
    handleCategoryChange() {
      let cateogry = this.queryForm.cateogry
      if (this.queryForm.cateogry) {
        this.computedTemplateList = this._.filter(this.templateList, item => {
          return item.cateogry === cateogry
        })
      } else {
        this.computedTemplateList = [...this.templateList]
      }
      this.search()
    },
    // 查询列表
    async queryList() {
      const result = await processProgressApi.queryConfigListWorking(this.queryForm)
      const datas = result.data
      const list = datas.records
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
    // 添加规则配置
    addItem() {
      this.$router.push({
        // path: '/decoration-progress-smart-decoration/add-working-procedure'
        name: 'ProgressAddWorkingProcedureSmartDecoration'
      })
    },
    // 编辑规则配置
    editItem(id) {
      this.$router.push({
        // path: `/decoration-progress-smart-decoration/add-working-procedure?id=${id}`
        name: 'ProgressAddWorkingProcedureSmartDecoration',
        query: { id }
      })
    },
    // 预览规则配置
    previewItem(data) {
      this.$router.push({
        // path: `/decoration-progress-smart-decoration/preview-working-procedure?id=${data.id}&preview=true&status=${data.status}`
        name: 'ProgressPreviewWorkingProcedureSmartDecoration',
        query: {
          id: data.id,
          preview: true,
          status: data.status
        }
      })
    },
    // 删除工序模板
    deleteItem(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteItemSuccess(id)
        })
        .catch(() => {})
    },
    // 删除工序模板 - 异步
    async deleteItemSuccess(id) {
      await processProgressApi.deleteConfigWorking(id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.search()
    },
    // 修改工序配置状态
    async publishItem(data) {
      let result = await processProgressApi.publishConfigWorking(data.id)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '发布成功!'
        })
        data.status = 1
      }
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

  &.status-4 i {
    background: #ff0000;
  }
}
</style>
