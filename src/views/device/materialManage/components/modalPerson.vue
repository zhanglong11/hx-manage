<!--
@任务名称: 1020/过磅单调整
@开发人员: 董渊海
@修改日期: 2020-03-24
@任务类型: 修改代码，选择人员模态框功能调整，修改比例(20%)
-->
<template>
  <el-dialog
    width="780px"
    :title="'请选择人员'"
    :visible="visible"
    @close="
      () => {
        $emit('update:visible', false)
      }
    "
  >
    <el-form ref="form" :model="form" :inline="true">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="content">
            <el-input
              v-model="form.content"
              placeholder="工号/员工名称/手机号/职位/所属部门"
              style="width: 260px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态" style="width: 120px;">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="2"></el-option>
            </el-select>
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" @click="() => {}">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </li>
      </ul>
    </el-form>

    <vxe-table ref="xTable" border resizable show-overflow :data="tableData" @radio-change="radioChangeEvent">
      <vxe-table-column type="radio" width="50"></vxe-table-column>
      <!--
        /**
         任务名称：1256/新建采购单的问题
         开发人员：崔洛宜
         日期：2020-03-23
         BUG类型：自测bug
         **/
      -->
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="userCode" title="工号"></vxe-table-column>
      <vxe-table-column field="realName" title="人员名称"></vxe-table-column>
      <vxe-table-column field="mobile" title="手机号"></vxe-table-column>
      <vxe-table-column field="post" title="职位"></vxe-table-column>
      <vxe-table-column field="depart" title="所属部门"></vxe-table-column>
      <vxe-table-column field="status" title="状态">
        <template v-slot="row">
          {{ !!row.status ? '停用' : '启用' }}
        </template>
      </vxe-table-column>
    </vxe-table>

    <vxe-pager
      border
      size="medium"
      :loading="loading"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :total="totalResult"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange"
    >
    </vxe-pager>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="onOk">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/api'
export default {
  name: 'Modalperson',
  props: {
    visible: Boolean
  },
  data() {
    return {
      form: {
        content: '',
        status: ''
      },
      selectRow: null,
      tableData: [],

      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalResult: 0
    }
  },
  /**
   任务名称：1256/新建采购单的问题
   开发人员：崔洛宜
   日期：2020-03-23
   BUG类型：自测bug
   **/
  created() {
    Api.getUserList({}).then(res => {
      this.tableData = res.data.records
      this.totalResult = res.data.total
    })
  },
  methods: {
    resetForm() {
      this.$refs['form'].resetFields()
    },
    radioChangeEvent({ row }) {
      this.selectRow = row
    },
    clearRadioRowEevnt() {
      this.selectRow = null
      this.$refs.xTable.clearRadioRow()
    },
    onOk() {
      if (this.selectRow) {
        this.$emit('update:visible', false)
        this.$emit('disposeSelectRow', this.selectRow)
      } else {
        this.$message.error('请选择一条记录，再做该操作')
      }
    },
    handlePageChange({ currentPage, pageSize }) {
      this.currentPage = currentPage
      this.pageSize = pageSize
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
