<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.search"
            style="width: 280px;"
            placeholder="保护部位/保护方法/责任部门/责任人/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="保护日期">
          <DateRange :startTime.sync="filterForm.protectionBeginTime" :endTime.sync="filterForm.protectionEndTime" />
        </el-form-item>
        <el-form-item label="拆除日期">
          <DateRange :startTime.sync="filterForm.dismantleBeginTime" :endTime.sync="filterForm.dismantleEndTime" />
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-button
          v-if="$hasPower('QualityAcceptanceFinishProtectAdd')"
          class="el-icon-plus"
          type="primary"
          @click="$router.push('finishProtectEdit')"
        >
          新建
        </el-button>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="protectionNumber" title="成品保护编号"></vxe-table-column>
      <vxe-table-column field="protectionPlace" title="保护部位"></vxe-table-column>
      <vxe-table-column field="protectionDate" title="保护日期" formatter="ymd"></vxe-table-column>
      <vxe-table-column field="dismantleDate" title="拆除日期" formatter="ymd"></vxe-table-column>
      <vxe-table-column field="protectionMethod" title="保护方法"></vxe-table-column>
      <vxe-table-column field="responsibleDepartmentName" title="责任部门"></vxe-table-column>
      <vxe-table-column field="principalName" title="责任人"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作" width="160px">
        <template slot-scope="{ row }">
          <span v-if="$hasPower('QualityAcceptanceFinishProtectEdit')" style="margin: 0 3px;"
            ><a @click="handleEdit(row.id)">编辑</a></span
          >
          <span v-if="$hasPower('QualityAcceptanceFinishProtectDetail')" style="margin: 0 3px;">
            <a @click="handleDetail(row.id)">查看</a></span
          >
          <span v-if="$hasPower('QualityAcceptanceFinishProtectDelete')" style="margin: 0 3px;"
            ><a @click="handleDelete(row.id)">删除</a></span
          >
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from '../../api/index'
export default {
  name: 'FinishProtect',
  data() {
    return {
      filterForm: {
        search: '',
        projectId: this.$store.state.project.projectId
      },
      request(body) {
        return Api.finishProtect.list(body)
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
      this.$router.push({ name: `QualityAcceptanceFinishProtectDetail`, params: { id: id, isCheck: false } })
    },
    handleEdit(id) {
      this.$router.push({ name: `QualityAcceptanceFinishProtectEdit`, params: { id: id } })
    },
    async handleDelete(id) {
      await this.$confirm('此操作将删除该成本保护, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      await Api.finishProtect.delete(id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
