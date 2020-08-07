<!--
    /**
   任务名称：TASK#2829 3月9日注释
   开发人员：崔洛宜
   日期：2020-04-03
   任务类型：注释(新加调整记录页面)
   **/
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
                placeholder="现场签证编号/成本测算编号/成本测算名称/创建人"
                style="width: 420px;"
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
          </div>
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
          v-if="$hasPower('ContractTargetCostBudgetAdd')"
          type="primary"
          icon="el-icon-plus"
          @click="handleAddContractTargetCostBudgetClick"
          >新建成本测算</el-button
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
        <vxe-table-column field="code" title="成本测算编号" />
        <vxe-table-column field="name" title="成本测算名称" />
        <vxe-table-column field="accessNumber" title="现场签证编号">
          <template slot-scope="{ row }">
            <span style="margin: 0 3px;">
              <a @click="handleAccessDetail(row.siteAccessId)">{{ row.accessNumber }}</a></span
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
            <span v-if="$hasPower('ContractTargetCostBudgetDetail')" style="margin: 0 3px;">
              <a @click="handleDetail(row.id)">查看</a></span
            >
            <template v-if="row.status === 0">
              <span v-if="$hasPower('ContractTargetCostBudgetEdit')" style="margin: 0 3px;"
                ><a @click="handleEdit(row)">编辑</a></span
              >
              <span v-if="$hasPower('ContractTargetCostBudgetRemove')" style="margin: 0 3px;"
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
import Api from '@/api/cost/contractTargetCostBudget'
import DialogAdd from './DialogAdd'
import basicStatus from '@/lib/basicStatus'
export default {
  name: 'ContractTargetCostBudgetChangeList',
  components: { DialogAdd },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      addVisible: false,
      filter: {
        keyword: '',
        status: null,
        createTime: []
      },
      tableData: [],
      form: {},
      isAdd: true,
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
      Api.getContractTargetCostBudgetList({
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
    /**
     任务名称：TASK#2830 3月10日注释
     开发人员：崔洛宜
     日期：2020-03-10
     任务类型：注释(修改按钮点击逻辑)(2)
     **/
    handleAccessDetail(id) {
      this.$router.push({
        name: 'SceneVisaDetail',
        params: {
          id: id,
          isCheck: false
        }
      })
    },
    handleDetail(id) {
      this.$router.push({ path: `contractTargetCostBudgetDetail/${id}`, params: { isCheck: false, isEdit: false } })
    },
    handleEdit(row) {
      this.addVisible = true
      this.form = row
      this.isAdd = false
    },
    handleDelete(id) {
      Api.deleteContractTargetCostBudgetById(id).then(res => {
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
    handleAddContractTargetCostBudgetClick() {
      this.addVisible = true
    },
    /**
     任务名称：TASK#2830 3月10日注释
     开发人员：崔洛宜
     日期：2020-03-10
     任务类型：注释(修改提交逻辑)(7)
     **/
    async handleSubmit(data) {
      if (this.isAdd) {
        let costRes = await Api.addContractTargetCostBudgetForm({
          ...data,
          projectId: this.projectId,
          module: 'measure_calculate'
        })
        let res = await Api.addContractTargetCostBudgetFormNext({ costId: costRes.data, contractId: data.contractId })
        if (res.code === 200) {
          this.addVisible = false
          this.$router.push({ name: `ContractTargetCostBudgetAdd`, query: { id: costRes.data, isEdit: true } })
        }
      } else {
        //更新操作
        let costRes = await Api.updateContractTargetCostBudgetForm({
          ...data,
          projectId: this.projectId,
          module: 'measure_calculate',
          costId: data.id
        })
        let res = await Api.updateContractTargetCostBudgetFormNext({
          contractId: data.contractId,
          costId: data.id
        })
        if (res.code === 200) {
          this.addVisible = false
          this.$router.push({ name: `ContractTargetCostBudgetEdit`, query: { id: data.id, isEdit: true } })
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
