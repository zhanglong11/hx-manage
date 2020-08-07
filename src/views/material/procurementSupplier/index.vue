<template>
  <div class="contentWrapper">
    <div class="headContainer">
      <div class="formWrapper">
        <el-form ref="filterForm" :inline="true" :model="form">
          <div>
            <el-form-item label="" label-width="0" prop="content" style="margin-right: 20px;">
              <el-input
                v-model="form.keyword"
                placeholder="甲购材计划编号/甲购材计划名称/供应商名称"
                style="width: 300px;"
              >
                <i slot="suffix" class="el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="创建时间" label-width="100px" prop="createTime" style="margin-right: 20px;">
              <el-date-picker
                v-model="form.createTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="请选择"
                end-placeholder="请选择"
                style="width: 400px;"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="计划状态" label-width="100px" prop="supplyStatus" style="margin-right: 20px;">
              <el-select v-model="form.supplyStatus" placeholder="请选择">
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
              </el-button-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!--      <div class="operateButton">-->
      <!--        <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>-->
      <!--        <el-button @click="reset">重置</el-button>-->
      <!--      </div>-->
    </div>
    <div class="tableWrapper">
      <vxe-table
        ref="xTable"
        border
        :show-header-overflow="true"
        column-min-width="140px"
        :data="tableData"
        :edit-config="{ trigger: 'manual', mode: 'row' }"
        :loading="loading"
      >
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="supplyPlanCode" title="甲供材计划编号"></vxe-table-column>
        <vxe-table-column field="supplyPlanName" title="甲供材计划名称" />
        <vxe-table-column field="secondParty" title="供应商名称" />
        <vxe-table-column field="projectManagerName" title="项目经理" />
        <vxe-table-column field="consigneeName" title="收货人" />
        <vxe-table-column field="confirmBillNum" title="材料确认单数量" />
        <vxe-table-column field="createTime" title="填报时间" />
        <vxe-table-column field="supplyStatus" title="计划状态" width="120">
          <template slot-scope="{ row }">
            <span>{{
              row.supplyStatus !== null && row.supplyStatus !== undefined
                ? stateList.filter(item => item.value === row.supplyStatus)[0].label
                : ''
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作">
          <template slot-scope="{ row }">
            <span v-if="$hasPower('procurementSupplierDetail')" style="margin: 0 3px;"
              ><a @click="handleDetail(row.id)">查看</a></span
            >
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
import Api from '../api/procurement'

export default {
  name: 'ProcurementParty',
  data() {
    return {
      // 状态列表
      stateList: [
        {
          label: '供货中',
          value: 1
        },
        {
          label: '已完成',
          value: 2
        }
      ],
      loading: true,
      form: {
        auditStatus: 2,
        createEndTime: '',
        createStartTime: '',
        supplyStatusList: [1, 2],
        keyword: '',
        page: 1,
        projectId: localStorage.getItem('projectId'),
        rows: 10,
        supplyStatus: ''
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  mounted() {
    this.refresh(true)
  },
  methods: {
    refresh(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      this.loading = true
      Api.getPartyList({
        ...this.form,
        rows: this.pageSize,
        page: this.currentPage,
        createStartTime: this.form.createStartTime[0] || '',
        createEndTime: this.form.createEndTime[1] || ''
      }).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleDetail(id) {
      this.$router.push({
        name: `procurementSupplierDetail`,
        params: {
          id: id
        }
      })
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh()
    },
    reset() {
      this.$refs.filterForm.resetFields()
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
  .operateButton {
    flex: 0 0 200px;
    text-align: right;
  }
}
</style>
