<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-select v-model="queryForm.cateogry" clearable placeholder="模板分类">
            <el-option v-for="item in cateogryList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.name" style="width: 360px;" placeholder="按模板名称搜索" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addItem()">新建模板</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table :data="dataList" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="name" label="模板名称" min-width="140" />
      <el-table-column prop="cateogry" label="模板分类" min-width="140">
        <template slot-scope="scope">
          {{ $getLabelFromArg('templateCategory', scope.row.cateogry) }}
        </template>
      </el-table-column>
      <el-table-column prop="standardFloorDuration" label="标准楼层工期" min-width="140" />
      <el-table-column prop="refugeFloorDuration" label="避难层工期" min-width="140" />
      <el-table-column prop="nonstandardFloorDuration" label="非标准楼层工期" min-width="140" />
      <el-table-column prop="sort" label="工序数量" min-width="140">
        <template slot-scope="scope">{{ scope.row.totalProcedureCount || 0 }}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="140" />
      <el-table-column prop="updateTime" label="最近更新时间" min-width="140" />
      <el-table-column prop="creatorName" label="提交人" min-width="140" />
      <el-table-column label="操作" width="260" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="interleaving(scope.row.id)">穿插工序</el-button>
          <el-button
            type="text"
            size="mini"
            :disabled="scope.$index === 0"
            @click="swapTemplate(scope.row.id, scope.$index - 1)"
            >上移</el-button
          >
          <el-button
            type="text"
            size="mini"
            :disabled="scope.$index === dataList.length - 1"
            @click="swapTemplate(scope.row.id, scope.$index + 1)"
            >下移</el-button
          >
          <el-button type="text" size="mini" @click="editItem(scope.row.id)">编辑</el-button>
          <el-button type="text" size="mini" @click="deleteItem(scope.row.id)">删除</el-button>
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
  日期：2020-04-02
  任务类型：全新代码
**/
import { processProgressApi } from './api/process-progress'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ProcessProgressTemplateList',
  components: {},
  data() {
    // 这里存放数据
    return {
      cateogryList: this.$getArgList('templateCategory'), // 模板分类下拉框数据
      queryForm: {
        // 查询条件
        projectId: this.$store.state.project.projectId,
        cateogry: '',
        name: '',
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [],
      total: 0
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryList()
  },
  // 方法集合
  methods: {
    // 查询列表
    async queryList() {
      const result = await processProgressApi.queryTemplateListWorking(this.queryForm)
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
    // 穿插工序
    interleaving(id) {
      this.$router.push({
        path: `/process-progress/interleaving?id=${id}`
      })
    },
    // 上移 / 下移
    async swapTemplate(sourceId, index) {
      const targetId = this.dataList[index].id
      await processProgressApi.swapTemplateWorking(sourceId, targetId)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.queryList()
    },
    // 新建模板
    addItem() {
      this.$router.push({
        path: '/process-progress/add-template'
      })
    },
    // 编辑模板
    editItem(id) {
      this.$router.push({
        path: `/process-progress/edit-template?id=${id}`
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
      await processProgressApi.deleteTemplateWorking(id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
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
  &.status-4 i {
    background: #ff0000;
  }
}
</style>
