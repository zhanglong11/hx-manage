<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.keyWords"
            style="width: 400px;"
            placeholder="安全文明管理目标名称/内容/负责人/负责人联系方式/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="计划日期">
          <DateRange :startTime.sync="filterForm.planStartDate" :endTime.sync="filterForm.planEndDate" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option
              v-for="item in safeCivilizationTargetList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.createTimeStart" :endTime.sync="filterForm.createTimeEnd" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-button class="el-icon-plus" type="primary" @click="$router.push('cultureEdit')">
          新建
        </el-button>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="civilizationNumber" title="安全文明计划编号"></vxe-table-column>
      <vxe-table-column field="civilizationName" title="安全文明管理目标名称"></vxe-table-column>
      <vxe-table-column field="civilizationContent" title="安全文明管理内容"></vxe-table-column>
      <vxe-table-column field="principalName" title="负责人"></vxe-table-column>
      <vxe-table-column field="principalContact" title="负责人联系方式"></vxe-table-column>
      <vxe-table-column field="civilizationTarget" title="安全文明管理目标"></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作" width="160px">
        <template slot-scope="{ row }">
          <span style="margin: 0 3px;"> <a @click="handleDetail(row.id)">查看</a></span>
          <template v-if="row.status === 1">
            <span style="margin: 0 3px;"><a @click="handleEdit(row.id)">编辑</a></span>
            <span style="margin: 0 3px;"><a @click="handleDelete(row.id)">删除</a></span>
          </template>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import safeCivilizationTargetList from '../../lib/safeCivilizationTargetList'
import Api from '../../api/index'
export default {
  name: 'SafeCivilizationTarget',
  data() {
    return {
      safeCivilizationTargetList,
      filterForm: {
        keyWords: '',
        status: '',
        year: '',
        projectId: this.$store.state.project.projectId
      },
      request(body) {
        return Api.safeCivilizationTarget.list(body)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    handleDetail(id) {
      this.$router.push({ name: `SafePlanCultureDetail`, params: { id: id, isCheck: false } })
    },
    handleEdit(id) {
      this.$router.push({ name: `SafePlanCultureEdit`, params: { id: id } })
    },
    async handleDelete(id) {
      await this.$confirm('此操作将删除该安全文明目标, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      await Api.safeCivilizationTarget.delete(id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
