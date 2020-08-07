<template>
  <div class="contentWrapper">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <CardHead
          :showStatus="true"
          statusContent="目标成本测算状态"
          :showSelectContract="true"
          :showOtherBtn="false"
          :showEdit="false"
          @change="handleContractChange"
          @edit="handleEditBtnClick"
        ></CardHead>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="合同工程直接费用测算" name="first">
          <div class="wrapper">
            <div class="leftBlock">
              <ProjectTree :id="contractId" @selectNode="handleSelectTreeNode"></ProjectTree>
            </div>
            <div class="rightBlock">
              <el-card shadow="never">
                <div slot="header" class="clearfix">
                  <span>清单信息</span>
                  <el-button type="text" style="float: right; padding: 3px 0;"></el-button>
                </div>
                <div class="topTable" style="margin: 10px 0;">
                  <vxe-table ref="xTable" border :data="tableData" auto-resize>
                    <vxe-table-column type="seq" width="60"></vxe-table-column>
                    <vxe-table-column field="code" title="项目编码" width="120" />
                    <vxe-table-column field="name" title="项目名称" width="120" />
                    <vxe-table-column field="unit" title="单位" width="80" />
                    <vxe-table-column field="price" title="合同单价(元)" width="120" />
                    <vxe-table-column field="number" title="合同数量" width="100" />
                    <vxe-table-column field="changedNumber" title="变更后数量" width="120" />
                    <vxe-table-column field="completedNumber" title="已计量完成工作量" width="150" />
                    <vxe-table-column field="disintegrateCheckNumber" title="分解核实量" width="120" />
                    <vxe-table-column field="totalPrice" title="总价(元)" width="100" />
                    <vxe-table-column field="belongType" title="所属分类" width="100" />
                    <vxe-table-column field="gljPrice" title="工料机单价(元)" width="120" />
                    <vxe-table-column title="工料机测算总价(元)">
                      <vxe-table-column field="peoplePrice" title="人" width="60" />
                      <vxe-table-column field="materialPrice" title="材料" width="60" />
                      <vxe-table-column field="mechanicalPrice" title="机械" width="60" />
                      <vxe-table-column field="gljTotalPrice" title="合计" width="60" />
                    </vxe-table-column>
                    <vxe-table-column title="调整后总价(元)">
                      <vxe-table-column field="changedPeoplePrice" title="人" width="60" />
                      <vxe-table-column field="changedMaterialPrice" title="材料" width="60" />
                      <vxe-table-column field="changedMechanicalPrice" title="机械" width="60" />
                      <vxe-table-column field="changedGljTotalPrice" title="合计" width="60" />
                    </vxe-table-column>
                    <vxe-table-column title="操作" width="150px">
                      <template v-slot="{ row }">
                        <vxe-button @click="showDetail(row.id)">查看</vxe-button>
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
                  <BudgetTabList :showSelect="false" :showOperateBtn="false" :showChanged="true"></BudgetTabList>
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="合同项目管理经费测算" name="second">
          <BudgetTreeTable :isEdit="false"></BudgetTreeTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <OperateList> </OperateList>
    <CheckCard ref="checkCard" @emit="handleEmitForm"></CheckCard>
    <div class="footerButton">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button type="primary" @click="handleSubmit">保存并提交</el-button>
    </div>
  </div>
</template>
<script>
import CardHead from '@/views/cost/components/CardHead'
import ProjectTree from '@/views/cost/components/ProjectTree'
import BudgetTabList from '@/views/cost/components/BudgetTabList'
import OperateList from '@/views/cost/components/OperateList'
import BudgetTreeTable from '@/views/cost/components/BudgetTreeTable'
export default {
  name: 'AdjustmentTargetCostCheck',
  components: { CardHead, ProjectTree, BudgetTabList, OperateList, BudgetTreeTable },
  data() {
    return {
      showFooter: false,
      detailVisible: true,
      activeName: 'first',
      contractId: null,
      componentId: null, //树形结构选择id
      currentPage: 1,
      pageSize: 10,
      total: 50,
      tableData: []
    }
  },
  methods: {
    handleContractChange(id) {
      this.contractId = id
    },
    handleSelectTreeNode(id) {
      this.componentId = id
      this.getTableData(id)
    },
    getTableData(id) {
      this.tableData = [
        {
          code: '2020020210',
          name: '实心砖墙',
          unit: 'kg',
          number: 1000,
          price: 10000,
          changedNumber: 800,
          completedNumber: 400,
          disintegrateCheckNumber: 300,
          totalPrice: 800000,
          belongType: '建筑工程',
          gljPrice: 1000,
          peoplePrice: 200,
          materialPrice: 300,
          mechanicalPrice: 400,
          gljTotalPrice: 900,
          changedPeoplePrice: 350,
          changedMaterialPrice: 500,
          changedMechanicalPrice: 800,
          changedGljTotalPrice: 1800
        }
      ]
    },
    handlePageChange(page) {
      this.currentPage = page
      this.getTableData()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getTableData()
    },
    handleEditBtnClick() {
      console.log(123)
      this.showFooter = true
    },
    showDetail(id) {
      this.projectCode = id
      this.detailVisible = true
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    saveRowEvent(row) {
      console.log(row)
      this.$refs.xTable.clearActived().then(() => {
        this.$message.success('保存成功')
        this.tableData = [{ id: 1, name: 1, type: 1, fileName: '分部分项工程和单价措施项目清单与计价表.xlsx' }]
      })
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    handleDelete() {
      this.$message.success('删除成功')
    },
    handleCancel() {
      this.showFooter = false
    },
    handleSave() {
      this.$message.success('保存成功')
      this.showFooter = false
    },
    handleSubmit() {
      this.$refs.checkCard.audit()
    },
    handleEmitForm(data) {
      console.log(data)
      this.$message.success('审核成功')
      //this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.contentWrapper {
  padding: 10px;
}
.wrapper {
  display: flex;
  .leftBlock {
    width: 420px;
  }
  .rightBlock {
    flex: 1;
    margin-left: 20px;
    overflow: scroll;
    .topTable {
      min-height: 200px;
      max-height: 500px;
    }
  }
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
</style>
