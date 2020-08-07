<script src="../router/index.js"></script>
<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="queryForm.keyword" style="width: 360px;" placeholder="材料编号/材料名称/供应商/创建人" />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="handleTimeChange"
          >
          </el-date-picker>
        </el-form-item>
        <template v-if="$hasPower('InventoryListSmartDecorationPartyACommentPCDetail')">
          <el-form-item label="批注状态">
            <el-select v-model="queryForm.commentStatus">
              <el-option value="" label="全部"></el-option>
              <el-option :value="1" label="已批注"></el-option>
              <el-option :value="0" label="未批注"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button-group v-if="$hasPower('InventoryListViewPartyA')">
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item class="flex-wrapper">
          <!--          <el-button-->
          <!--            v-if="$hasPower('InventoryAddSmartDecorationPartyA')"-->
          <!--            type="primary"-->
          <!--            icon="el-icon-plus"-->
          <!--            @click="addItem()"-->
          <!--            >新建材料</el-button-->
          <!--          >-->
          <template v-if="$hasPower('InventorySmartDecorationExportPartyA')">
            <el-upload
              ref="upload"
              action
              :show-file-list="false"
              :http-request="handleImportMaterialInfo"
              :accept="acceptType"
              :on-success="reset"
            >
              <el-button type="primary">导 入</el-button>
            </el-upload>
            <el-button type="primary" style="margin-left: 10px;">
              <a href="/doc/精装修-材料导入模板.xlsx" download>下载模板</a>
            </el-button>
          </template>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table :data="dataList" border fit size="small">
      <el-table-column type="index" width="60" align="center" label="序号" />
      <el-table-column prop="code" label="材料编码" min-width="180" show-overflow-tooltip align="center" />
      <el-table-column prop="name" label="材料名称" min-width="120" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column prop="models" label="规格型号" min-width="120" align="center"> </el-table-column>
      <el-table-column prop="unit" label="单位" min-width="100" align="center"> </el-table-column>
      <el-table-column prop="brand" label="品牌" min-width="120" align="center" />

      <el-table-column prop="supplier" label="供应商" min-width="120" align="center"> </el-table-column>
      <!--      <el-table-column prop="budgetNumber" label="预算量" min-width="100" align="center" />-->
      <!--      <el-table-column prop="consumeNumber" label="已消耗量" min-width="100" align="center" />-->
      <el-table-column prop="inventoryNumber" label="库存量" min-width="100" align="center" />
      <el-table-column prop="consumeNumber" label="已使用量" min-width="100" align="center" />
      <el-table-column prop="type" label="采购方" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type === 2 ? '自购' : '甲供' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$hasPower('InventoryListSmartDecorationPartyACommentPCDetail')"
        prop="commentStatus"
        label="批注状态"
        min-width="100"
      >
        <template slot-scope="scope">
          <span class="comment-status" :class="{ active: scope.row.commentStatus }">{{
            scope.row.commentStatus ? '已批注' : '未批注'
          }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column prop="remark" label="备注" min-width="150" align="center" />-->
      <!--      <el-table-column label="出入库记录" width="150" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--            v-if="$hasPower('InventoryRecordSmartDecoration')"-->
      <!--            type="text"-->
      <!--            size="mini"-->
      <!--            @click="handlePreviewRecordInfo(scope.row.id)"-->
      <!--            >查 看</el-button-->
      <!--          >-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" width="100" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="$hasPower('InventoryDetailSmartDecorationPartyA')"
            type="text"
            size="mini"
            @click="handlePreviewRecordInfo(scope.row.id)"
            >查 看</el-button
          >
          <!--          <el-button-->
          <!--            v-if="$hasPower('InventoryEditSmartDecorationPartyA')"-->
          <!--            type="text"-->
          <!--            size="mini"-->
          <!--            @click="editItem(scope.row.id)"-->
          <!--            >修 改</el-button-->
          <!--          >-->
          <!--          <el-button-->
          <!--            v-if="$hasPower('InventoryEditSmartDecorationDeletePartyA')"-->
          <!--            type="text"-->
          <!--            size="mini"-->
          <!--            @click="deleteItem(scope.row.id)"-->
          <!--            >删 除</el-button-->
          <!--          >-->
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
export default {
  name: 'InventoryListPartyA',

  data() {
    return {
      queryForm: {
        // 查询条件
        projectId: this.$store.state.project.projectId,
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [],
      timeRange: '',
      total: 0,
      acceptType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryList()
  },
  // 方法集合
  methods: {
    // 选中日期范围时查询数据
    handleTimeChange(val) {
      this.queryForm.startDate = `${val[0]} 00:00:00`
      this.queryForm.endDate = `${val[1]} 00:00:00`
      this.search()
    },
    // 查询列表
    async queryList() {
      const result = await this.axios.material.post('/material/list', this.queryForm)
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
      this.queryForm = this._.cloneDeep(this.queryFormBack)

      this.timeRange = null
      this.search()
    },
    // 当前页码改变
    changePageNumber(page) {
      this.queryForm.page = page
      this.queryList()
    },
    // 每页显示条数改变
    changePageSize(rows) {
      this.queryForm.page = 1
      this.queryForm.rows = rows
      this.queryList()
    },
    // 新建材料
    addItem() {
      this.$router.push({
        name: 'InventoryAddSmartDecorationPartyA'
      })
    },
    // 编辑材料
    editItem(id) {
      this.$router.push({
        // path: `/supplies/materialManage/edit-inventory?id=${id}`
        name: `InventoryEditSmartDecorationPartyA`,
        query: {
          id: id
        }
      })
    },
    // 删除材料
    deleteItem(id) {
      this.$confirm('确认删除此材料吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteItemSuccess(id)
        })
        .catch(() => {})
    },
    // 删除材料 - 异步
    async deleteItemSuccess(id) {
      let result = await this.axios.material.post(`/material/delete/${id}`)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.search()
      }
    },
    // 导入材料excel,

    // 自定义导入方法
    async handleImportMaterialInfo(options) {
      let file = options.file
      let formData = new FormData()
      formData.append('file', file)
      formData.append('projectId', this.$store.state.project.projectId)
      let result = await this.axios.material.post(`/material/importMaterial`, formData, {
        processData: false,
        contentType: false
      })
      if (result.code === 200) {
        this.$message.success('导入成功')
      }
    },
    // 查看出入记录
    handlePreviewRecordInfo(id) {
      this.$router.push({
        // path: `/supplies/materialManage/inventory-record?id=${id}`
        name: `InventoryDetailSmartDecorationPartyA`,
        query: {
          id: id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.flex-wrapper {
  /deep/ .el-form-item__content {
    display: inline-flex;
  }
  /deep/ .el-upload {
    margin-left: 10px;
  }
}
</style>
