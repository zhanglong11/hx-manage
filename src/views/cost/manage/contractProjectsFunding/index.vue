<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: a74606ed9a55070d37c4e26d36532f523e607f32
@代码提交修改日期: 2020-03-07
@任务类型: 修改代码，合同项目经费核算 添加项目经费核算模态框
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 9be3e5c65eebd73fa421dd7692c70588a8ed0e99
@代码提交修改日期: 2020-03-09
@任务类型: 修改代码，合同项目经费核算 对接 项目经费核算列表接口，查询核算下的项目经费明细接口，项目经费明细新增(编辑)接口，添加项目经费核算明细详情页
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: b65fe7ac4a5ae22a6bbb5b31ac646558ce4ee2b7
@代码提交修改日期: 2020-03-10
@任务类型: 修改代码，合同项目经费核算 对接 项目经费核算编辑接口，删除接口，提交审核接口
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="contentWrapper">
    <div class="headContainer">
      <div class="formWrapper">
        <el-form ref="form" :inline="true" :model="filter">
          <div>
            <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 20px;">
              <el-input
                v-model="filter.keyword"
                placeholder="项目经费核算编号/项目经费核算名称/创建人"
                style="width: 302px;"
                suffix-icon="el-icon-search"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker
                v-model="filter.createTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="请选择"
                end-placeholder="请选择"
                :default-time="['00:00:00', '23:59:59']"
                style="width: 336px;"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="operateButton">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>
    <el-row type="flex" justify="space-between">
      <el-col :span="6">
        <el-button
          v-if="$hasPower('FundListAdd')"
          type="primary"
          icon="el-icon-plus"
          @click="handleAddContractProjectFundingClick"
          >新建合同项目经费核算</el-button
        >
      </el-col>
    </el-row>
    <div class="tableWrapper">
      <vxe-table
        ref="xTable"
        border
        :show-header-overflow="true"
        column-min-width="140px"
        :data="tableData"
        :loading="loading"
      >
        <vxe-table-column type="seq" title="序号" width="50px" />
        <vxe-table-column field="code" title="项目经费核算编号" />
        <vxe-table-column field="name" title="项目经费核算名称" />
        <vxe-table-column field="budgetTimeRange" title="核算日期范围">
          <template v-slot="{ row }">
            <span>{{ row.accountingStartDate | dateYMD }} ~ {{ row.accountingEndDate | dateYMD }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注" />
        <vxe-table-column field="realMoney" title="本期实际金额(元)" />
        <vxe-table-column field="accruingMoney" title="累计金额(元)" />
        <vxe-table-column field="status" title="核算状态">
          <template slot-scope="{ row }">
            <span>{{ statusList.filter(item => item.value === row.status)[0].label }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="creatorName" title="创建人" />
        <vxe-table-column field="createTime" title="创建时间" />
        <vxe-table-column title="操作" width="130px">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('FundListDetail')" style="margin: 0 3px;">
              <a @click="handleDetail(row.id)">查看</a></span
            >
            <template v-if="row.status === 0">
              <span v-if="$hasPower('FundListEdit')" style="margin: 0 3px;"
                ><a @click="handleEdit(row.id, row)">编辑</a></span
              >
              <span v-if="$hasPower('FundListDelete')" style="margin: 0 3px;"
                ><a @click="handleDelete(row.id, row)">删除</a></span
              >
            </template>
          </template>
        </vxe-table-column>
      </vxe-table>
      <div style="margin-top: 10px;">
        <div class="toolbar" style="display: flex; justify-content: space-between;">
          <div class="num">
            共 {{ total }} 条记录 第 {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }} 页
            <!--
                 任务名称：1497 成本管理->成本管理->合同项目经费核算：刷新页码后报错，请看图
                 开发人员：崔洛宜
                 日期：2020-04-03
                 BUG类型：测试人员发现的研发自测未通过引起的BUG
                 **/
            -->
            <el-button type="text primary" class="el-icon-refresh" @click="refresh(currentPage, pageSize)"></el-button>
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

    <ModalFundEdit :visible.sync="visible" :fundRecord="fundRecord" @refreshList="handleSearch"></ModalFundEdit>
  </div>
</template>
<script>
import statusList from '@/lib/basicStatus'
import ModalFundEdit from './ModalFundEdit'
import Api from '@/api/cost/contractProjectsFunding'
export default {
  name: 'ContractProjectsFunding',
  components: { ModalFundEdit },
  data() {
    return {
      filter: {
        keyword: '',
        createTime: ''
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      statusList: statusList,
      visible: false,
      loading: false,

      fundRecord: {}
    }
  },
  created() {
    this.refresh(1, this.pageSize)
  },
  methods: {
    refresh(currentPage, pageSize) {
      let startDate = ''
      let endDate = ''
      if (this.filter.createTime !== null && this.filter.createTime !== '' && this.filter.createTime.length !== 1) {
        startDate = moment(this.filter.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        endDate = moment(this.filter.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }

      this.loading = true

      Api.getCostExpenditureAccountingList({
        projectId: localStorage.getItem('projectId'),
        keyword: this.filter.keyword,
        startDate,
        endDate,
        page: currentPage,
        rows: pageSize
      }).then(res => {
        //console.log(res)
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
        this.currentPage = currentPage
        this.pageSize = pageSize
      })
    },
    handleSearch() {
      this.refresh(1, this.pageSize)
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.refresh(1, this.pageSize)
    },
    handleDetail(id) {
      //this.$router.push({ name: `ContractProjectsFundingDetail`, params: { id: id, isCheck: false, isEdit: false } })
      this.$router.push({ name: 'FundListDetail', params: { id: id } })
    },
    handleEdit(id, row) {
      this.visible = true
      this.fundRecord = row
    },
    handleDelete(id, row) {
      this.$confirm(`确定移除 ${row.name} 记录吗？`).then(res => {
        Api.deleteCostExpenditureAccounting(id).then(res => {
          this.$message.success('删除成功')
          this.refresh(1, this.pageSize)
        })
      })
    },
    handlePageChange(page) {
      this.refresh(page, this.pageSize)
    },
    handlePageSizeChange(pageSize) {
      this.refresh(1, pageSize)
    },
    handleAddContractProjectFundingClick() {
      //this.$router.push({ name: `ContractProjectsFundingAdd`, params: {} })
      this.visible = true
      this.fundRecord = {}
    }
  }
}
</script>
<style lang="less" scoped>
.contentWrapper {
  padding: 10px;
}
.tableWrapper {
  margin-top: 20px;
}
.headContainer {
  display: flex;
  justify-content: space-between;
  .formWrapper {
    flex: 1;
  }
  .operateButton {
    flex: 0 0 200px;
    text-align: right;
  }
}
</style>
