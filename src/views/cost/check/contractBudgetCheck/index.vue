<template>
  <div class="contentWrapper">
    <div class="headContainer">
      <div class="formWrapper">
        <el-form ref="form" :inline="true" :model="filter">
          <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 20px;">
            <el-input
              v-model="filter.keyword"
              placeholder="现场签证编号/合同预算编号/合同预算名称/创建人"
              style="width: 330px;"
            >
              <i slot="suffix" class="el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="120px" prop="status">
            <BasicStatusSelect v-model="filter.status"></BasicStatusSelect>
          </el-form-item>
          <el-form-item label="创建时间" label-width="120px" prop="createTime">
            <el-date-picker
              v-model="filter.createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              style="width: 400px;"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="operateButton">
        <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
        <el-button @click="$refs.form.resetFields()">重置</el-button>
      </div>
    </div>
    <div class="tableWrapper">
      <vxe-table ref="xTable" border :data="tableData" :edit-config="{ trigger: 'manual', mode: 'row' }">
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="code" title="合同预算编号" />
        <vxe-table-column field="name" title="合同预算名称" />
        <vxe-table-column field="accessNumber" title="现场签证编号">
          <template slot-scope="{ row }">
            <span style="margin: 0 3px;">
              <a @click="handleContractDetail(row.contractId)">{{ row.contractCode }}</a></span
            >
          </template>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注" />
        <vxe-table-column field="creatorName" title="创建人" />
        <vxe-table-column field="createTime" title="创建时间" />
        <vxe-table-column field="status" title="状态">
          <template slot-scope="{ row }">
            <span>{{
              row.status !== null && row.status !== undefined
                ? basicStatus.filter(item => item.value === row.status)[0].label
                : ''
            }}</span>
          </template>
        </vxe-table-column>

        <vxe-table-column title="操作" width="120">
          <template slot-scope="{ row }">
            <template v-if="row.status === 1">
              <span style="margin: 0 3px;"><a @click="handleCheck(row.id)">审核</a></span>
            </template>
            <template v-else>
              <span style="margin: 0 3px;"> <a @click="handleDetail(row.id)">查看</a></span>
            </template>
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
  </div>
</template>
<script>
import basicStatus from '@/lib/basicStatus'
import Api from '@/api/cost/contractBudget'
export default {
  name: 'ContractBudgetCheck',
  components: {},
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      filter: {
        keyword: '',
        status: null,
        createTime: []
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      basicStatus: basicStatus
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
      Api.getContractBudgetList({
        ...this.filter,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId,
        createStartTime: this.filter.createTime[0] || '',
        createEndTime: this.filter.createTime[1] || ''
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleContractDetail(id) {
      this.$router.push(`Detail/${id}`)
    },
    handleDetail(id) {
      this.$router.push({ path: `contractBudgetCheckDetail/${id}`, params: { isEdit: false, isCheck: false } })
      // this.$router.push({ name: `ContractBudgetDetail`, query: { id: id, isEdit: false, isCheck: false } })
    },
    handleCheck(id) {
      this.$router.push({ path: `contractBudgetCheckDetail/${id}`, params: { isEdit: false, isCheck: true } })
      // this.$router.push({ name: `ContractBudgetCheckDetail`, query: { id: id, isEdit: false, isCheck: true } })
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
