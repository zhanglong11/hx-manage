<template>
  <el-dialog title="选择合同" :visible="visible" width="1200px" top="50px" @close="$emit('update:visible', false)">
    <div class="contentWrapper">
      <div class="headContainer">
        <div class="formWrapper">
          <el-form ref="form" :inline="true" :model="filter">
            <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 20px;">
              <el-input v-model="filter.keyword" placeholder="合同名称/合同编号/甲方/乙方/创建人" style="width: 260px;">
                <i slot="suffix" class="el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="招采类型" label-width="120px" prop="purchaseMode" style="margin-right: 20px;">
              <el-select v-model="filter.purchaseMode">
                <el-option value="null" label="全部"> </el-option>
                <el-option value="1" label="招标"> </el-option>
                <el-option value="2" label="非招标"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建日期" prop="date">
              <DateRange :start-time.sync="filter.startDate" :end-time.sync="filter.endDate" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
              <el-button
                @click="
                  () => {
                    $refs.form.resetFields()
                    refresh(true)
                  }
                "
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tableWrapper">
        <vxe-table
          ref="xTable"
          border
          row-id="id"
          :data="tableData"
          highlight-current-row
          :radio-config="{ checkRowKey: checkRowKey, trigger: 'row', highlight: true }"
          @current-change="currentChange"
          @radio-change="currentChange"
        >
          <vxe-table-column type="radio" width="60"> </vxe-table-column>
          <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
          <vxe-table-column field="code" title="合同编号" />
          <vxe-table-column field="name" title="合同名称">
            <template slot-scope="{ row }">
              <span style="margin: 0 3px;">
                <router-link :to="`/contract/detail/${row.id}`" target="_blank">
                  {{ row.name }}
                </router-link>
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="type" title="合同类型">
            <template slot-scope="{ row }">
              <span>{{ row.type ? contractType.filter(item => item.value === row.type)[0].label : '采购合同' }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="firstParty" title="甲方" />
          <vxe-table-column field="secondParty" title="乙方" />
          <!--<vxe-table-column field="amount" title="合同金额（万元）" width="150" />-->
          <vxe-table-column field="purchaseMode" title="招采类型"
            ><template slot-scope="{ row }">
              <span>{{ row.purchaseMode === 1 ? '招标' : '非招标' }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="status" title="合同状态">
            <template slot-scope="{ row }">
              <span>{{
                row.status !== null ? contractStatus.filter(item => item.value === row.status)[0].label : '已通过'
              }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="creatorName" title="创建人" />
          <vxe-table-column field="createTime" title="创建时间" width="150" />
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
  </el-dialog>
</template>
<script>
import contractType from '@/lib/contractType'
import contractStatus from '@/lib/contractStatus'
import Api from '@/api/contract/contractManage/merchants'
export default {
  name: 'ContractDialog',
  // props: ['visible'],
  props: {
    visible: {
      type: Boolean
    },
    checkRowKey: {
      type: String,
      defalut: ''
    },
    //是否展示单选框
    showRadio: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      filter: {
        keyword: '',
        type: 2,
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
    this.$nextTick(() => {
      if (this.showRadio) return
      let xtable = this.$refs.xTable
      xtable.hideColumn(xtable.getColumns(0))
    })
  },
  methods: {
    refresh(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      Api.getContractList({
        ...this.filter,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
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
    currentChange({ row }) {
      this.$emit('submit', row)
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped></style>
