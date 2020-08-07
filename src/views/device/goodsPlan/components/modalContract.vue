<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: c27c798f8b2f6f081625e46d76469a1ca2e61a8f
@代码提交修改日期: 2020-03-02
@任务类型: 修改代码，选择需用计划模态框接口调整，选择合同模态框接口调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 9c09ed88507aa76c22849531fc13a576eff74928
@代码提交修改日期: 2020-03-02
@任务类型: 修改代码，采购单 新增采购单时，查询采购合同明细与需用计划明细的交集(40%)
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 30d0953c4a78d9a7fe4e41d80840a6e8643bfc98
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，选择租赁计划模态框调整，选择合同模态框添加合同类型参数控制
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 205b52064519eb0958411cba677f55987291c7c8
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，物资设备计划模块和审核模块 时间组件 添加时分秒
@补加代码注释日期: 2020-04-11
-->
<template>
  <el-dialog width="1080px" :title="'选择合同'" :visible="visible" @close="handleCancel">
    <el-form ref="form" :model="form" :inline="true">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="synthesize">
            <el-input
              v-model="form.synthesize"
              placeholder="合同名称/合同编号/甲方/乙方/创建人"
              style="width: 260px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <!--<el-form-item label="合同类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择类型" style="width: 160px;">
              <el-option label="总承包合同" value="1"></el-option>
              <el-option label="采购合同" value="2"></el-option>
              <el-option label="劳务分包合同" value="3"></el-option>
              <el-option label="设备租赁合同" value="4"></el-option>
              <el-option label="专业工程分包合同" value="5"></el-option>
              <el-option label="其他合同" value="6"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="招采方式" prop="way">
            <el-select v-model="form.way" placeholder="请选择方式" style="width: 110px;">
              <el-option label="招标" value="1"></el-option>
              <el-option label="非招标" value="2"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="合同状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态" style="width: 110px;">
              <el-option label="草稿" value="0"></el-option>
              <el-option label="电子版待审核" value="1"></el-option>
              <el-option label="电子版已通过" value="2"></el-option>
              <el-option label="电子版已驳回" value="3"></el-option>
              <el-option label="纸质版待审核" value="4"></el-option>
              <el-option label="纸质版已通过" value="5"></el-option>
              <el-option label="纸质版已驳回" value="6"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 336px;"
            ></el-date-picker>
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </li>
      </ul>
    </el-form>

    <vxe-table
      ref="xTable"
      size="mini"
      border
      resizable
      show-overflow
      :data="tableData"
      :loading="loading"
      @radio-change="radioChangeEvent"
    >
      <vxe-table-column type="radio" width="50"></vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="code" title="合同编号"></vxe-table-column>
      <vxe-table-column field="name" title="合同名称"></vxe-table-column>
      <vxe-table-column field="type" title="合同类型">
        <template v-slot="{ row }">
          <span v-if="row.type === 1">总承包合同</span>
          <span v-else-if="row.type === 2">采购合同</span>
          <span v-else-if="row.type === 3">劳务分包合同</span>
          <span v-else-if="row.type === 4">设备租赁合同</span>
          <span v-else-if="row.type === 5">专业工程分包合同</span>
          <span v-else-if="row.type === 6">其他合同</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="firstParty" title="甲方"></vxe-table-column>
      <vxe-table-column field="secondParty" title="乙方"></vxe-table-column>
      <vxe-table-column field="secondParty" title="合同金额(万元)"></vxe-table-column>
      <vxe-table-column field="purchaseMode" title="招采方式">
        <template v-slot="{ row }">
          <span v-if="row.purchaseMode === 1">招标</span>
          <span v-else-if="row.purchaseMode === 2">非招标</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="status" title="合同状态">
        <template v-slot="{ row }">
          <span v-if="row.status === 0">草稿</span>
          <span v-else-if="row.status === 1">电子版待审核</span>
          <span v-else-if="row.status === 2">电子版已通过</span>
          <span v-else-if="row.status === 3">电子版已驳回</span>
          <span v-else-if="row.status === 4">纸质版待审核</span>
          <span v-else-if="row.status === 5">纸质版已通过</span>
          <span v-else-if="row.status === 6">纸质版已驳回</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="signDate" title="签订日期"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
    </vxe-table>
    <vxe-pager
      border
      size="medium"
      :loading="loading"
      :current-page="page"
      :page-size="rows"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange"
    >
    </vxe-pager>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleEnter">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/api/contract/contractManage'
export default {
  name: 'ModalContract',
  props: {
    visible: Boolean,
    contractType: String
  },
  data() {
    return {
      type: '',
      form: {
        synthesize: '',
        type: '',
        way: '',
        status: '',
        createTime: ''
      },
      selectRow: null,
      tableData: [],

      loading: false,
      page: 1,
      rows: 10,
      total: 0
    }
  },
  watch: {
    contractType(val) {
      this.type = val
    },
    visible(val) {
      if (val) {
        this.refresh(1, this.rows)
      }
    }
  },
  methods: {
    refresh(page, rows) {
      let startDate = ''
      let endDate = ''
      if (this.form.createTime !== null && this.form.createTime !== '' && this.form.createTime.length !== 1) {
        startDate = moment(this.form.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        endDate = moment(this.form.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      let keyword = this.form.synthesize
      //let type = this.form.type
      let purchaseMode = this.form.way
      //let status = this.status

      this.loading = true

      Api.getContractList({
        projectId: localStorage.getItem('projectId'),
        keyword,
        type: this.type, //2是采购合同，4设备租赁合同
        purchaseMode,
        startDate,
        endDate,
        status: '5', //状态为纸质版已通过
        page,
        rows
      }).then(res => {
        //console.log(res)
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
        this.page = page
        this.rows = rows
      })
    },
    handleSearch() {
      this.refresh(1, this.rows)
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.refresh(1, this.rows)
    },
    handleCancel() {
      this.selectRow = null
      this.$refs.xTable.clearRadioRow()
      this.$emit('update:visible', false)
    },
    handleEnter() {
      if (this.selectRow) {
        this.$emit('update:visible', false)
        this.$emit('optionSelectRecord', this.selectRow)
        //console.log(this.selectRow)
      } else {
        this.$message.error('请选择一条记录，再做该操作')
      }
    },
    radioChangeEvent({ row }) {
      this.selectRow = row
    },
    handlePageChange({ currentPage, pageSize }) {
      this.refresh(currentPage, pageSize)
    }
  }
}
</script>

<style scoped lang="less">
.search_bar {
  display: flex;
  justify-content: space-between;

  .search_bar_btn {
    white-space: nowrap;
  }
}
</style>
