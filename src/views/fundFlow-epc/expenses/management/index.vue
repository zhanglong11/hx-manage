<template>
  <div class="outContainer">
    <div class="tooltips">
      <el-form ref="filterForm" :model="filterForm" inline>
        <el-form-item label="">
          <el-input v-model="filterForm.keyword" placeholder="管理费用支出计划名称/创建人" style="width: 280px;">
            <i slot="suffix" class="el-icon-search"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="年份">
          <el-date-picker
            v-model="filterForm.year"
            type="year"
            placeholder="选择年"
            value-format="yyyy"
            @change="refresh"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="月份">
          <el-select v-model="filterForm.month" @change="refresh">
            <el-option v-for="item of MonthList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="time"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleCreateTimeChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col>
        <el-button v-if="$hasPower('FundExpensesManagementAddEpc')" type="primary" @click="addNew"
          >新建管理费用支出计划</el-button
        >
      </el-col>
    </el-row>
    <div style="margin-top: 10px;">
      <Grid ref="table" :filter-form.sync="filterForm" :request="request">
        <vxe-table-column type="index" title="序号" width="80" />
        <vxe-table-column field="planName" title="管理费用支出计划名称" min-width="200" />
        <vxe-table-column field="year" title="年份" width="80" />
        <vxe-table-column field="month" title="月份" width="80" />
        <vxe-table-column field="totalAmount" title="预计支出金额(元)" min-width="200">
          <template v-slot="{ row }">
            <span>{{ isNaN(row.totalAmount) ? '-' : Number(row.totalAmount).toFixed(2) }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="actualAmount" title="实际支出金额" min-width="200">
          <template v-slot="{ row }">
            <span>{{ isNaN(row.actualAmount) ? '-' : Number(row.actualAmount).toFixed(2) }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注" min-width="200" />

        <vxe-table-column field="creatorName" title="创建人" width="120" />
        <vxe-table-column field="createTime" title="创建时间" width="150" />
        <vxe-table-column title="操作" width="300">
          <template slot-scope="{ row }">
            <el-button v-if="$hasPower('FundExpensesManagementnDetailEpc')" type="text" @click="toDetail(row)"
              >查看</el-button
            >
            <el-button v-if="$hasPower('FundExpensesManagementEditEpc')" type="text" @click="toEdit(row)"
              >编辑</el-button
            >

            <el-button v-if="$hasPower('FundExpensesManagementActualEpc')" type="text" @click="handleActualEdit(row)"
              >实际支出填报</el-button
            >
            <el-button v-if="$hasPower('FundExpensesManagementnDeleteEpc')" type="text" @click="handleDelete(row.id)"
              >删除</el-button
            >
          </template>
        </vxe-table-column>
      </Grid>
    </div>
  </div>
</template>

<script>
import MonthList from '../../lib/month'
export default {
  name: 'FundExpensesPlan',
  data() {
    return {
      MonthList,
      time: [],
      filterFormBack: {},
      filterForm: {
        //这两项参数必须预定义
        planType: 3,
        projectId: this.$store.state.project.projectId
      },
      request: body => {
        return this.axios.construction.post('/fund/plan/list', body)
      }
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  created() {
    Object.assign(this.filterFormBack, this.filterForm)
  },
  methods: {
    // 选择创建日期
    handleCreateTimeChange(val) {
      this.filterForm.endDate = val[1]
      this.filterForm.startDate = val[0]
      this.refresh()
    },
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.time = null
      Object.assign(this.filterForm, this.filterFormBack)
      this.$refs.table.reset()
    },
    addNew() {
      this.$router.push({ name: 'FundExpensesManagementAddEpc' })
    },
    toEdit(row) {
      this.$router.push({ name: 'FundExpensesManagementEditEpc', query: { id: row.id } })
    },
    // 查看详情
    toDetail(row) {
      this.$router.push({ name: 'FundExpensesManagementnDetailEpc', query: { id: row.id } })
    },
    //删除
    handleDelete(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await this.axios.construction.get(`/fund/plan/delete/${id}`)
        if (result.code === 200) {
          this.$message.success('删除成功')
          this.refresh()
        }
      })
    },
    // 管理费用支出填报
    handleActualEdit(row) {
      this.$router.push({ name: 'FundExpensesManagementActualEpc', query: { id: row.id } })
    }
  }
}
</script>

<style lang="less" scoped></style>
