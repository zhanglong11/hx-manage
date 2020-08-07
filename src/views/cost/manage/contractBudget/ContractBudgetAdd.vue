<template>
  <div class="contentWrapper indexWrapper">
    <div class="headWrapper">
      <div class="statusContainer">
        <div class="content">预算状态：</div>
        <div class="statusValue">草稿</div>
      </div>
    </div>
    <div class="wrapper">
      <div class="leftBlock">
        <ProjectTree :treeData="treeData" @selectNode="handleSelectTreeNode"></ProjectTree>
      </div>
      <div class="rightBlock">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>清单信息</span>
            <el-button type="text" style="float: right; padding: 3px 0;"></el-button>
          </div>
          <div class="topTable" style="margin: 10px 0;">
            <vxe-table ref="xTable" v-loading="loading" border :data="tableData" auto-resize>
              <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
              <!--
                  /**
                 任务名称：TASK#2831 3月11号注释
                 开发人员：崔洛宜
                 日期：2020-03-11
                 任务类型：注释(修改列字段)(12)
                 **/
              -->
              <vxe-table-column field="itemCode" title="项目编码" width="150" />
              <vxe-table-column field="itemName" title="项目名称" width="150" />
              <vxe-table-column field="unit" title="单位" width="60" />
              <vxe-table-column
                field="comprehensiveUnitPrice"
                title="合同单价(元)"
                width="100"
                :formatter="({ cellValue }) => toFixed2(cellValue)"
              />
              <vxe-table-column field="quantity" title="合同数量" width="80" />
              <vxe-table-column
                field="updateUnitPrice"
                title="变更后单价(元)"
                width="120"
                :formatter="({ cellValue }) => toFixed2(cellValue)"
              />
              <vxe-table-column field="updateQuantity" title="变更后数量" width="100" />
              <!--
                  /**
                 任务名称：BUG#1655 成本管理-合同预算调整&目标成本测算调整-下图所示的清单信息按照最新原型修改
                 开发人员：崔洛宜
                 日期：2020-04-16
                 任务类型：测试人员发现的研发自测未通过引起的BUG
                 **/
              -->
              <!--<vxe-table-column field="finishedQuantity" title="已计量完成工作量" width="150" />-->
              <!-- <vxe-table-column field="decomposingQuantity" title="分解核实量" width="100" />&ndash;&gt;-->
              <vxe-table-column field="decomposingQuantity" title="分解量" width="100" />
              <vxe-table-column
                field="combinedPrice"
                title="总价(元)"
                width="120"
                :formatter="({ cellValue }) => toFixed2(cellValue)"
              />
              <vxe-table-column field="category" title="所属分类" width="140" />
              <vxe-table-column
                field="quantityMachineUnitPrice"
                title="工料机单价(元)"
                width="120"
                :formatter="({ cellValue }) => toFixed2(cellValue)"
              />
              <vxe-table-column title="工料机总价(元)">
                <vxe-table-column
                  field="personCombinedPrice"
                  title="人"
                  width="100"
                  :formatter="({ cellValue }) => toFixed2(cellValue)"
                />
                <vxe-table-column
                  field="materialCombinedPrice"
                  title="材料"
                  width="100"
                  :formatter="({ cellValue }) => toFixed2(cellValue)"
                />
                <vxe-table-column
                  field="machineCombinedPrice"
                  title="机械"
                  width="100"
                  :formatter="({ cellValue }) => toFixed2(cellValue)"
                />
                <vxe-table-column
                  field="quantityMachineCombinedPrice"
                  title="合计"
                  width="120"
                  :formatter="({ cellValue }) => toFixed2(cellValue)"
                />
              </vxe-table-column>
              <vxe-table-column title="操作" width="150px">
                <template v-slot="{ row }">
                  <vxe-button @click="showDetail(row.itemCode)">查看</vxe-button>
                </template>
              </vxe-table-column>
            </vxe-table>
            <div style="margin-top: 10px;">
              <div class="toolbar" style="display: flex; justify-content: space-between;">
                <div class="num">
                  共 {{ total }} 条记录 第 {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }} 页
                  <el-button type="text primary" class="el-icon-refresh" @click="refresh(false)"></el-button>
                </div>
                <el-pagination
                  class="pagination"
                  :total="total"
                  :current-page.sync="currentPage"
                  :page-size="pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  layout="sizes, prev, pager, next, jumper"
                  @current-change="handlePageChange"
                  @size-change="handlePageSizeChange"
                />
              </div>
            </div>
          </div>
        </el-card>
        <el-card v-if="detailVisible" shadow="never" style="margin-top: 20px;">
          <div slot="header" class="clearfix">
            <span>工料机明细</span>
            <el-button type="text" style="float: right; padding: 3px 0;"></el-button>
          </div>
          <div>
            <!--
                /**
               任务名称：TASK#2831 3月11号注释
               开发人员：崔洛宜
               日期：2020-03-11
               任务类型：注释(修改参数传递)(1)
               **/
            -->
            <TabList :listId="listId" :meteringUnitId="selectTreeId" :costId="id" @tabSave="getTableData"></TabList>
          </div>
        </el-card>
      </div>
    </div>
    <div class="footerButton">
      <el-button @click="handleCancel">返回列表</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>
<script>
import ProjectTree from '@/views/cost/components/ProjectTree'
import TabList from '@/views/cost/components/TabList'
import Api from '@/api/cost/contractBudget'
export default {
  name: 'ContractBudgetAdd',
  components: { ProjectTree, TabList },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      loading: false,
      detailVisible: false,
      selectTreeId: null, //树形结构选择id
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      treeData: [],
      listId: ''
    }
  },
  created() {
    let { id } = this.$route.query
    this.id = id
    this.getTreeData(id)
  },
  methods: {
    async handleSelectTreeNode(id) {
      this.selectTreeId = id
      await this.getTableData(id)
      this.detailVisible = false
    },
    /**
     任务名称：TASK#2830 3月10日注释
     开发人员：崔洛宜
     日期：2020-03-10
     任务类型：注释(添加获取树接口,修改树和列表联动)(2)
     **/
    getTreeData(id) {
      Api.getAddTreeData({ projectId: this.projectId, costId: id, module: 'budget' }).then(res => {
        if (res.code === 200) {
          this.treeData = res.data
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    /**
     任务名称：TASK#2829 3月9日注释
     开发人员：崔洛宜
     日期：2020-04-03
     任务类型：注释(修改获取列表的接口)
     **/
    getTableData(id, isFirst = true) {
      if (isFirst) {
        this.currentPage = 1
      }
      this.loading = true
      Api.getListData({
        page: this.currentPage,
        rows: this.pageSize,
        meteringUnitId: this.selectTreeId,
        costId: this.id
      })
        .then(res => {
          this.total = res.data.total
          this.tableData = res.data.records
        })
        .finally(() => (this.loading = false))
    },
    handlePageChange(page) {
      this.currentPage = page
      this.getTableData(this.selectTreeId, false)
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getTableData(this.selectTreeId)
    },
    showDetail(id) {
      this.listId = id
      this.detailVisible = true
    },
    handleCancel() {
      this.$router.back()
    },
    handleSubmit() {
      Api.addCostBudget(this.id).then(res => {
        if (res.code === 200) {
          this.$message.success('提交成功')
          this.$router.back()
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../style.less';
</style>
