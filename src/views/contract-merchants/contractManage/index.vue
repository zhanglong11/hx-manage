<template>
  <div class="contentWrapper">
    <div class="headContainer">
      <div class="formWrapper">
        <el-form ref="form" :inline="true" :model="filter">
          <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 10px;">
            <el-input v-model="filter.keyword" placeholder="合同名称/合同编号/甲方/乙方/创建人" style="width: 260px;">
              <i slot="suffix" class="el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="招采方式" label-width="100px" prop="purchaseMode" style="margin-right: 10px;">
            <el-select v-model="filter.purchaseMode">
              <el-option value="null" label="全部"> </el-option>
              <el-option value="1" label="招标"> </el-option>
              <el-option value="2" label="非招标"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建日期" prop="date">
            <el-date-picker
              v-model="filter.date"
              type="daterange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              style="width: 300px;"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="resetFilter()">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-row type="flex" justify="space-between">
      <el-col v-if="$hasPower('ContractAddMerchants')" :span="6">
        <el-button type="primary" icon="el-icon-plus" @click="handleAddContractClick">新建合同</el-button></el-col
      >
      <el-col :span="6" style="text-align: right;"> <a @click="handleDownload"></a></el-col>
    </el-row>
    <div class="tableWrapper">
      <vxe-table
        ref="xTable"
        v-loading="loading"
        border
        show-overflow
        :data="tableData"
        :edit-config="{ trigger: 'manual', mode: 'row' }"
      >
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="code" title="合同编号" width="150" />
        <vxe-table-column field="name" title="合同名称" width="200">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('ContractDetailMerchants')" style="margin: 0 3px;">
              <a @click="handleDetail(row.id)">{{ row.name }}</a></span
            >
            <span v-else style="margin: 0 3px;">{{ row.name }}</span>
          </template>
        </vxe-table-column>
        <!--<vxe-table-column field="type" title="合同类型">
          <template slot-scope="{ row }">
            <span>{{ row.type ? contractType.filter(item => item.value === row.type)[0].label : '' }}</span>
          </template>
        </vxe-table-column>-->
        <vxe-table-column field="firstParty" title="甲方" min-width="200" />
        <vxe-table-column field="secondParty" title="乙方" min-width="200" />
        <vxe-table-column field="purchaseMode" title="招采方式" width="100"
          ><template slot-scope="{ row }">
            <span>{{ row.purchaseMode == 1 ? '招标' : '非招标' }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="creatorName" title="计划单数量" width="100">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('MaterialPlanListView')" style="margin: 0 3px;">
              <a @click="$router.push(`/material/planList?contractId=${row.id}&auditStatus=2`)">{{
                row.materialSupplyPlanNum
              }}</a>
            </span>
            <span v-else style="margin: 0 3px;">{{ row.materialSupplyPlanNum }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="creatorName" title="确认单数量" width="100">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('MaterialConfirmCodeDetail')" style="margin: 0 3px;">
              <a @click="$router.push(`/material/confirmCode?contractId=${row.id}&status=2`)">
                {{ row.materialSupplyConfirmBillNum }}
              </a>
            </span>
            <span v-else style="margin: 0 3px;">{{ row.materialSupplyConfirmBillNum }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="creatorName" title="创建人" width="100" />
        <vxe-table-column field="createTime" title="创建时间" width="150" />
        <vxe-table-column title="操作" width="150">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('ContractDetailMerchants')" style="margin: 0 3px;">
              <a @click="handleDetail(row.id)">查看</a></span
            >
            <span v-if="$hasPower('ContractEditMerchants')" style="margin: 0 3px;"
              ><a @click="handleEdit(row.id)">编辑</a></span
            >
            <span v-if="$hasPower('ContractDeleteMerchants')" style="margin: 0 3px;"
              ><a @click="handleDelete(row.id)">删除</a></span
            >
          </template>
        </vxe-table-column>
      </vxe-table>
      <div style="margin-top: 10px;">
        <div class="toolbar" style="display: flex; justify-content: space-between;">
          <div class="num">
            共 {{ total }} 条记录 第 {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }} 页
            <el-button
              type="text primary"
              class="el-icon-refresh"
              style="transform: scale(1.4);"
              @click="refresh(false)"
            ></el-button>
          </div>
          <el-pagination
            class="pagination"
            :total="total"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="prev,pager,next,sizes,jumper"
            @current-change="handlePageChange"
            @size-change="handlePageSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import contractType from '@/lib/contractType'
import contractStatus from '@/lib/contractStatus'
import Api from '@/api/contract/contractManage/merchants'
export default {
  name: 'ContractMerchants',
  components: {},
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      loading: false,
      filter: {
        keyword: '',
        type: 2,
        status: null,
        purchaseMode: null,
        date: []
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      contractType: contractType,
      contractStatus: contractStatus
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    refresh(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      this.loading = true
      Api.getContractList({
        ...this.filter,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId,
        startDate: this.filter.date[0] ? this.filter.date[0] + ' 00:00:00' : '',
        endDate: this.filter.date[1] ? this.filter.date[1] + ' 23:59:59' : ''
      })
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.records
            this.total = res.data.total
          } else {
            this.$message.error('未知错误,请重试')
          }
        })
        .finally(() => (this.loading = false))
    },
    handleDetail(id) {
      this.$router.push({ name: `ContractDetailMerchants`, params: { id: id, isCheck: false } })
    },
    handleEdit(id) {
      this.$router.push({ name: `ContractEditMerchants`, query: { id: id, isEdit: true } })
    },
    async handleDelete(id) {
      await this.$confirm('此操作将删除该合同, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      await Api.deleteContractById(id)
      this.$message.success('删除成功')
      this.refresh()
    },
    handleDownload() {
      console.log('下载')
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh()
    },
    handleAddContractClick() {
      this.$router.push('AddContract')
    },
    /**
     任务名称：BUG1245/合同管理-【下载合同范本】点击没反应，【重置】-列表的数据没有被重置
     开发人员：崔洛宜
     日期：2020-03-23
     BUG类型：测试人员发现的研发自测未通过引起的BUG
     **/
    resetFilter() {
      this.$refs.form.resetFields()
      this.refresh(true)
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
}
</style>
