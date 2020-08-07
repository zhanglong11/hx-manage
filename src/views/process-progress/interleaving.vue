<template>
  <div class="container is-footer">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-select v-model="queryForm.constructStage" clearable placeholder="施工阶段">
            <el-option v-for="item in constructStageList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.mainProcedure" style="width: 360px;" placeholder="主要施工工序" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addItem()">添加工序</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table :data="dataList" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="constructStage" label="施工阶段" min-width="140">
        <template slot-scope="scope">
          {{ $getLabelFromArg('constructStage', scope.row.constructStage) }}
        </template>
      </el-table-column>
      <el-table-column prop="mainProcedure" label="主要施工工序" min-width="140" />
      <el-table-column prop="duration" label="周期/d" min-width="140" />
      <el-table-column prop="floorRule" label="楼层规则" min-width="140" />
      <el-table-column prop="associatedType" label="模板分类" min-width="140">
        <template slot-scope="scope">
          {{ $getLabelFromArg('associatedType', scope.row.associatedType) }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="140" />
      <el-table-column label="操作" width="260" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="editItem(scope.row.id, scope.row.floorRule)">编辑</el-button>
          <el-button
            type="text"
            size="mini"
            :disabled="scope.$index === 0"
            @click="swapWorking(scope.row.id, scope.$index - 1)"
            >上移</el-button
          >
          <el-button
            type="text"
            size="mini"
            :disabled="scope.$index === dataList.length - 1"
            @click="swapWorking(scope.row.id, scope.$index + 1)"
            >下移</el-button
          >
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

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
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
      id: this.$route.query.id || '',
      constructStageList: this.$getArgList('constructStage'), // 施工阶段下拉框数据
      queryForm: {
        // 查询条件
        templateId: this.$route.query.id || '',
        constructStage: '',
        mainProcedure: '',
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
      const result = await processProgressApi.queryListWorking(this.queryForm)
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
    changePageNumber(page) {
      this.queryForm.page = page
      this.queryList()
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.page = 1
      this.queryForm.rows = pageSize
      this.queryList()
    },
    // 添加工序
    addItem() {
      const floorRule = this.total === 0 ? 'N' : `N-${this.total}`
      this.$router.push({
        path: `/process-progress/add-interleaving?templateId=${this.id}&floorRule=${floorRule}`
      })
    },
    // 编辑工序
    editItem(id, floorRule) {
      this.$router.push({
        path: `/process-progress/edit-interleaving?id=${id}&floorRule=${floorRule}`
      })
    },
    // 上移 / 下移
    async swapWorking(sourceId, index) {
      const targetId = this.dataList[index].id
      await processProgressApi.swapWorking(sourceId, targetId)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.queryList()
    },
    // 删除工序
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
    // 删除工序 - 异步
    async deleteItemSuccess(id) {
      await processProgressApi.deleteWorking(id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.search()
    },
    // 返回
    goBack() {
      this.$router.go(-1)
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
