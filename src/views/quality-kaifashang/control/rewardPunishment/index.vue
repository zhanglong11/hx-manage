<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="" prop="search">
          <el-input
            v-model="filterForm.search"
            style="width: 350px;"
            placeholder="奖惩编号/奖惩名称/奖惩人员/所属部门/事由/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="奖惩日期" prop="happenTime">
          <DateRange :startTime.sync="filterForm.happenBeginTime" :endTime.sync="filterForm.happenEndTime" />
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item label="奖惩" prop="type">
          <el-select v-model="filterForm.type" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in rewardPunishTypeList" :key="item.value" :value="item.value" :label="item.label" />
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
          v-if="$hasPower('QualityControlRewardPunishmentAdd')"
          class="el-icon-plus"
          type="primary"
          @click="$router.push('rewardPunishmentEdit')"
        >
          新建
        </el-button>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="number" title="奖惩编号"></vxe-table-column>
      <vxe-table-column field="name" title="奖惩名称"></vxe-table-column>
      <vxe-table-column field="personnelName" title="奖惩人员"></vxe-table-column>
      <vxe-table-column field="departmentName" title="所属部门"></vxe-table-column>
      <vxe-table-column field="reason" title="事由"></vxe-table-column>
      <vxe-table-column field="happenDate" title="奖惩日期" formatter="ymd"></vxe-table-column>
      <vxe-table-column
        field="type"
        title="奖惩"
        :formatter="({ cellValue }) => $getLabel(rewardPunishTypeList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="money" title="金额(元)"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作" width="160px">
        <template slot-scope="{ row }">
          <span v-if="$hasPower('QualityControlRewardPunishmentEdit')" style="margin: 0 3px;"
            ><a @click="handleEdit(row.id)">编辑</a></span
          >
          <span v-if="$hasPower('QualityControlRewardPunishmentDetail')" style="margin: 0 3px;">
            <a @click="handleDetail(row.id)">查看</a></span
          >
          <span v-if="$hasPower('QualityControlRewardPunishmentDelete')" style="margin: 0 3px;"
            ><a @click="handleDelete(row.id)">删除</a></span
          >
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import rewardPunishTypeList from '../../lib/rewardPunishTypeList'
import Api from '../../api'
export default {
  name: 'RewardPunishment',
  data() {
    return {
      rewardPunishTypeList,
      filterForm: {
        search: '',
        type: null
      },
      request(body) {
        return Api.rewardPunish.list(body)
      }
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    handleDetail(id) {
      this.$router.push({ name: `QualityControlRewardPunishmentDetail`, params: { id: id, isCheck: false } })
    },
    handleEdit(id) {
      this.$router.push({ name: `QualityControlRewardPunishmentEdit`, params: { id: id } })
    },
    async handleDelete(id) {
      await this.$confirm('此操作将删除该奖惩, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      await Api.rewardPunish.delete(id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>
<style scoped lang="less">
@import '~@/styles/common';
</style>
