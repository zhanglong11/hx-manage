<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.search" style="width: 200px;" placeholder="验收编号/验收名称/验收人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="验收时间">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item label="验收类型" prop="acceptanceType">
          <el-select v-model="filterForm.acceptanceType" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in acceptanceTypeList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-button
          v-if="$hasPower('QualityAcceptanceCheckApplyAdd')"
          class="el-icon-plus"
          type="primary"
          @click="$router.push('qualityApplyEdit')"
        >
          新建
        </el-button>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="acceptanceApplyNumber" title="验收编号"></vxe-table-column>
      <vxe-table-column field="acceptanceName" title="验收名称"></vxe-table-column>
      <vxe-table-column
        field="acceptanceType"
        title="验收类型"
        :formatter="({ cellValue }) => $getLabel(acceptanceTypeList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="acceptanceManName" title="验收人"></vxe-table-column>
      <vxe-table-column field="acceptanceDate" title="验收日期"></vxe-table-column>
      <vxe-table-column
        field="status"
        title="状态"
        :formatter="({ cellValue }) => $getLabel(acceptanceApplyStatusList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="160px">
        <template slot-scope="{ row }">
          <span v-if="$hasPower('QualityAcceptanceCheckApplyEdit') && row.status === 0" style="margin: 0 3px;"
            ><a @click="handleEdit(row.id)">编辑</a></span
          >
          <span v-if="$hasPower('QualityAcceptanceQualityApplyDetail')" style="margin: 0 3px;">
            <a @click="handleDetail(row.id)">查看</a></span
          >
          <span v-if="$hasPower('QualityAcceptanceQualityAcceptDetail') && row.status === 2" style="margin: 0 3px;">
            <a v-if="row.acceptanceManId === $store.state.user.id" @click="handleAcceptDetail(row.id)"
              >验收记录</a
            ></span
          >
          <span v-if="$hasPower('QualityAcceptanceQualityApplyDelete') && row.status === 0" style="margin: 0 3px;"
            ><a @click="handleDelete(row.id)">删除</a></span
          >
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>
<script>
import acceptanceTypeList from '../../lib/acceptanceTypeList'
import acceptanceApplyStatusList from '../../lib/acceptanceApplyStatusList'
import Api from '../../api/index'
export default {
  name: 'AcceptanceApply',
  data() {
    return {
      acceptanceTypeList,
      acceptanceApplyStatusList,
      filterForm: {
        search: '',
        acceptanceType: '',
        projectId: this.$store.state.project.projectId
      },
      request(body) {
        return Api.acceptanceApply.list(body)
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
      this.$router.push({ name: `QualityAcceptanceQualityApplyDetail`, params: { id: id, isCheck: false } })
    },
    //验收记录
    handleAcceptDetail(id) {
      this.$router.push({ name: `QualityAcceptanceQualityAcceptDetail`, params: { id: id, isCheck: false } })
    },
    handleEdit(id) {
      this.$router.push({ name: `QualityAcceptanceCheckApplyEdit`, params: { id: id } })
    },
    async handleDelete(id) {
      await this.$confirm('此操作将删除该验收申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      await Api.acceptanceApply.delete(id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
