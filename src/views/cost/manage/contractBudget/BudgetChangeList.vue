<!--
    /**
         任务名称：TASK#2828 3月7号注释
         开发人员：崔洛宜
         日期：2020-03-31
         任务类型：注释(调整记录页面,新页面)
         **/
-->
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
    <el-row type="flex" justify="space-between">
      <el-col :span="6">
        <el-button
          v-if="$hasPower('ContractBudgetAdd')"
          type="primary"
          icon="el-icon-plus"
          @click="handleAddContractBudgetClick"
          >新建合同预算</el-button
        ></el-col
      >
      <el-col :span="6" style="text-align: right;"> </el-col>
    </el-row>
    <div class="tableWrapper">
      <vxe-table
        ref="xTable"
        border
        :data="tableData"
        :show-header-overflow="true"
        column-min-width="140px"
        :edit-config="{ trigger: 'manual', mode: 'row' }"
      >
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="code" title="合同预算编号" />
        <vxe-table-column field="name" title="合同预算名称" />
        <!--
            /**
             任务名称：BUG1584 成本管理-合同预算调整-新增合同预算-未选择现场签证，列表页显示有，点击编号，报404
             开发人员：崔洛宜
             日期：2020-04-14
             BUG类型：测试人员发现的研发自测未通过引起的BUG
             **/
        -->
        <vxe-table-column field="accessNumber" title="现场签证编号">
          <template slot-scope="{ row }">
            <span style="margin: 0 3px;">
              <a @click="handleSiteAccessDetail(row.siteAccessId)">{{ row.accessNumber }}</a></span
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
            <span v-if="$hasPower('ContractBudgetDetail')" style="margin: 0 3px;">
              <a @click="handleDetail(row.id)">查看</a></span
            >
            <template v-if="row.status === 0">
              <span v-if="$hasPower('ContractBudgetEdit')" style="margin: 0 3px;"
                ><a @click="handleEdit(row)">编辑</a></span
              >
              <span v-if="$hasPower('ContractBudgetDelete')" style="margin: 0 3px;"
                ><a @click="handleDelete(row.id)">删除</a></span
              >
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
    <!--
        /**
         任务名称：TASK#2831 3月11号注释
         开发人员：崔洛宜
         日期：2020-03-11
         任务类型：注释(修改弹窗参数传递)(6)
         **/
    -->
    <DialogAdd
      v-if="addVisible"
      :visible="addVisible"
      :formData="form"
      :isAdd="isAdd"
      @close="addVisible = false"
      @submit="handleSubmit"
    ></DialogAdd>
  </div>
</template>
<script>
import basicStatus from '@/lib/basicStatus'
import Api from '@/api/cost/contractBudget'
import DialogAdd from './DialogAdd'

export default {
  name: 'BudgetChangeList',
  components: { DialogAdd },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      filter: {
        keyword: '',
        status: null,
        createTime: []
      },
      addVisible: false,
      form: {},
      isAdd: true,
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
        createStartTime: this.filter.createTime?.[0],
        createEndTime: this.filter.createTime?.[1]
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleSiteAccessDetail(siteAccessId) {
      this.$router.push(`/contract/sceneVisaDetail/${siteAccessId}`)
    },

    /**
     任务名称：TASK#2830 3月10日注释
     开发人员：崔洛宜
     日期：2020-03-10
     任务类型：注释(修改按钮点击逻辑)(2)
     **/
    handleDetail(id) {
      this.$router.push({ path: `ContractBudgetDetail/${id}`, params: { isEdit: false, isCheck: false } })
    },
    handleEdit(row) {
      this.addVisible = true
      this.form = row
      this.isAdd = false
    },
    handleDelete(id) {
      Api.deleteCostBudgetById(id).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.refresh()
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
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
    handleAddContractBudgetClick() {
      this.addVisible = true
      //this.$router.push({ name: `ContractBudgetAdd`, params: {} })
    },
    /**
     任务名称：TASK#2830 3月10日注释
     开发人员：崔洛宜
     日期：2020-03-10
     任务类型：注释(修改提交逻辑)(6)
     **/
    /**
     任务名称：TASK#2831 3月11号注释
     开发人员：崔洛宜
     日期：2020-03-11
     任务类型：注释(添加更新操作)(8)
     **/
    async handleSubmit(data) {
      if (this.isAdd) {
        let costRes = await Api.addCostBudgetForm({ ...data, projectId: this.projectId, module: 'budget' })
        let res = await Api.addCostBudgetFormNext({ costId: costRes.data, contractId: data.contractId })
        if (res.code === 200) {
          this.addVisible = false
          this.$router.push({ name: `ContractBudgetAdd`, query: { id: costRes.data, isEdit: true } })
        }
      } else {
        //更新操作
        let costRes = await Api.updateCostBudgetForm({
          ...data,
          projectId: this.projectId,
          module: 'budget',
          costId: data.id
        })
        let res = await Api.updateCostBudgetFormNext({
          contractId: data.contractId,
          costId: data.id
        })
        if (res.code === 200) {
          this.addVisible = false
          this.$router.push({ name: `ContractBudgetEdit`, query: { id: data.id, isEdit: true } })
        }
      }
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
