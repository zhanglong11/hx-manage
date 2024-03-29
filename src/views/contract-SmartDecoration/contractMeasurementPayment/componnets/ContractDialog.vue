<template>
  <el-dialog title="选择合同" :visible="visible" width="1400px" top="10px" @close="$emit('close')">
    <div class="contentWrapper">
      <div class="headContainer">
        <div class="formWrapper">
          <el-form ref="form" :inline="true" :model="filter">
            <div>
              <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 20px;">
                <el-input
                  v-model="filter.keyword"
                  placeholder="合同名称/合同编号/甲方/乙方/创建人"
                  style="width: 260px;"
                >
                  <i slot="suffix" class="el-icon-search"></i>
                </el-input>
              </el-form-item>
              <el-form-item label="合同类型" label-width="120px" prop="type" style="margin-right: 20px;">
                <ContractTypeSelectSmartDecoration v-model="filter.type"></ContractTypeSelectSmartDecoration>
              </el-form-item>
              <el-form-item label="招采类型" label-width="120px" prop="purchaseMode" style="margin-right: 20px;">
                <el-select v-model="filter.purchaseMode">
                  <el-option value="null" label="全部"> </el-option>
                  <el-option value="1" label="招标"> </el-option>
                  <el-option value="2" label="非招标"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="合同状态" label-width="120px" prop="status" style="margin-right: 20px;">
                <ContractStatusSelect v-model="filter.status"></ContractStatusSelect>
              </el-form-item>
              <el-form-item label="创建日期" prop="date">
                <el-date-picker
                  v-model="filter.date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="请选择"
                  end-placeholder="请选择"
                  style="width: 400px;"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div style="text-align: right;">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
                <!--                <el-button-->
                <!--                  @click="-->
                <!--                    () => {-->
                <!--                      $refs.form.resetFields()-->
                <!--                      refresh(true)-->
                <!--                    }-->
                <!--                  "-->
                <!--                  >重置</el-button-->
                <!--                >-->
                <el-button @click="reset">重置</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="tableWrapper">
        <vxe-table ref="xTable" border :data="tableData" @radio-change="radioChangeEvent">
          <vxe-table-column type="radio" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
          <vxe-table-column field="code" title="合同编号" />
          <vxe-table-column field="name" title="合同名称">
            <template slot-scope="{ row }">
              <span style="margin: 0 3px;">
                <a @click="handleContractDetail(row.id)">{{ row.name }}</a></span
              >
            </template>
          </vxe-table-column>
          <vxe-table-column field="type" title="合同类型">
            <template slot-scope="{ row }">
              <span>{{ row.type ? contractType.filter(item => item.value === row.type)[0].label : '' }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="firstParty" title="甲方" />
          <vxe-table-column field="secondParty" title="乙方" />
          <vxe-table-column field="amount" title="合同金额（万元）" width="150" formatter="toWan"> </vxe-table-column>
          <vxe-table-column field="purchaseMode" title="招采类型"
            ><template slot-scope="{ row }">
              <span>{{ row.purchaseMode == 1 ? '招标' : '非招标' }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="status" title="合同状态">
            <template slot-scope="{ row }">
              <span>{{
                row.status !== null ? contractStatus.filter(item => item.value === row.status)[0].label : ''
              }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="signDate" title="签订日期" />
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import contractStatus from '@/lib/contractStatus'
import Api from '@/api/contract/contractManage'
import contractType from '../lib/contractType'
export default {
  name: 'ContractDialog',
  components: {},
  props: ['visible'],
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      selectRow: null,
      filter: {
        keyword: '',
        typeList: [1, 3],
        status: null,
        purchaseMode: null,
        date: []
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      contractType,
      typeList: null,
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
      Api.getContractList({
        ...this.filter,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId,
        startDate: this.filter.date[0],
        endDate: this.filter.date[1]
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.typeList = null
      this.filter = {
        ...this.filter,
        ...{
          typeList: [1, 3]
        }
      }
      this.refresh(true)
    },
    getType(e) {
      this.filter = { ..._.omit(this.filter, 'typeList'), ...{ typeList: [e] } }
    },
    handleContractDetail(id) {
      this.$router.push(`/contract/manage/detail/${id}`)
    },
    /**
     任务名称：BUG1249/合同管理-合同计量与支付-新建预付款-选择合同-翻页点了没反应
     开发人员：崔洛宜
     日期：2020-03-23
     BUG类型：测试人员发现的研发自测未通过引起的BUG
     **/
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh()
    },
    radioChangeEvent({ row }) {
      this.selectRow = row
    },
    handleSubmit() {
      if (this.selectRow) {
        this.$emit('submit', this.selectRow)
      } else {
        this.$message.error('请选择一个合同')
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
