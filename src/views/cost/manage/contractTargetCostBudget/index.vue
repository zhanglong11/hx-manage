<!--
    /**
   任务名称：TASK#2829 3月9日注释
   开发人员：崔洛宜
   日期：2020-04-03
   任务类型：注释(路由修改,页面更换)
   **/
-->
<template>
  <div class="contentWrapper">
    <div class="headWrapper">
      <el-button
        v-if="$hasPower('ContractTargetCostBudgetChangeList') && $hasPower('ContractTargetCostBudgetChangeListList')"
        class="changeBtn"
        @click="handleCheckList"
        >查看调整记录</el-button
      >
    </div>
    <el-tabs v-model="activeName" class="topTabs">
      <el-tab-pane label="合同工程直接费用测算" lazy name="first">
        <div class="wrapper">
          <div class="leftBlock">
            <!--
            /**
             任务名称：TASK#2830 3月10日注释
             开发人员：崔洛宜
             日期：2020-03-10
             任务类型：注释(修改树传参)(1)
             **/
             -->
            <ProjectTree
              :treeData="treeData"
              :defaultSelectId="defaultSelectId"
              @selectNode="handleSelectTreeNode"
            ></ProjectTree>
          </div>
          <div class="rightBlock">
            <el-card shadow="never">
              <div slot="header" class="clearfix">
                <span>清单信息</span>
                <el-button type="text" style="float: right; padding: 3px 0;"></el-button>
              </div>
              <div class="topTable" style="margin: 10px 0;">
                <vxe-table ref="xTable" border :show-header-overflow="true" column-min-width="140px" :data="tableData">
                  <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
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
                  <vxe-table-column field="finishedQuantity" title="已计量完成工作量" width="150" />
                  <vxe-table-column field="decomposingQuantity" title="分解量" width="100" />
                  <vxe-table-column field="combinedPrice" title="总价(元)" width="120" />
                  <vxe-table-column field="category" title="所属分类" width="140" />
                  <vxe-table-column
                    field="quantityMachineUnitPrice"
                    title="工料机测算单价(元)"
                    width="140"
                    :formatter="({ cellValue }) => toFixed2(cellValue)"
                  />
                  <vxe-table-column title="工料机测算合价(元)">
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
                      共 {{ total }} 条记录 第 {{ currentPage }} / {{ total ? Math.ceil(total / pageSize) : 1 }} 页
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
                <BudgetTabList
                  :showOperateBtn="false"
                  :showSelect="false"
                  :listId="listId"
                  :meteringUnitId="selectTreeId"
                  :costId="costId"
                ></BudgetTabList>
              </div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="合同项目管理经费测算" lazy name="second">
        <BudgetTreeTable :isEdit="false"></BudgetTreeTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ProjectTree from '@/views/cost/components/ProjectTree'
import BudgetTabList from '@/views/cost/components/BudgetTabList'
import BudgetTreeTable from '@/views/cost/components/BudgetTreeTable'
import Api from '@/api/cost/contractTargetCostBudget'
import findFirstChild from '@/utils/findTreeFirstChild'
export default {
  name: 'ContractTargetCostBudget',
  components: { ProjectTree, BudgetTabList, BudgetTreeTable },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      detailVisible: false,
      activeName: 'first',
      selectTreeId: null, //树形结构选择id
      defaultSelectId: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      treeData: [],
      listId: '',
      costId: ''
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    getTreeData() {
      Api.getTreeData({ module: 'measure_calculate' }).then(res => {
        if (res.code === 200) {
          this.treeData = res.data
          this.costId = res.data && res.data[0] && res.data[0].costId
          let firstNode = findFirstChild(res.data[0])
          this.defaultSelectId = firstNode.id
          this.selectTreeId = firstNode.id
          this.getTableData()
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleCheckList() {
      this.$router.push({ name: `ContractTargetCostBudgetChangeList` })
    },
    /**
     任务名称：TASK#2830 3月10日注释
     开发人员：崔洛宜
     日期：2020-03-10
     任务类型：注释(修改树点击和列表联动)(20)
     **/
    async handleSelectTreeNode(id) {
      this.selectTreeId = id
      await this.getTableData(id)
      this.detailVisible = false
    },
    getTableData(id, isFirst = true) {
      if (isFirst) {
        this.currentPage = 1
      }
      Api.getListData({
        page: this.currentPage,
        rows: this.pageSize,
        meteringUnitId: this.selectTreeId,
        costId: this.costId,
        module: 'measure_calculate'
      }).then(res => {
        this.total = res.data.total
        this.tableData = res.data.records
      })
    },
    handlePageChange(page) {
      this.currentPage = page
      this.getTableData(this.selectTreeId, false)
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getTableData(this.selectTreeId, true)
    },
    showDetail(id) {
      this.listId = id
      this.detailVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../style.less';
</style>
