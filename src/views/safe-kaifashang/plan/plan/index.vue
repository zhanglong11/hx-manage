<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.search"
            style="width: 440px;"
            placeholder="安全计划编号/安全计划名称/检查人/检查部门/通知人/创建人"
          ></el-input>
        </el-form-item>
        <el-form-item label="计划时间">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item label="检查性质" prop="planNature">
          <el-select v-model="filterForm.planNature" style="width: 100%;" placeholder="请选择检查性质">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in checkNatureList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterForm.status" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in statusList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划类型" prop="planType">
          <el-select v-model="planType" style="width: 100%;" placeholder="请选择计划类型">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in planTypeList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <template v-if="$hasPower('SafetyPlanCommentPCDetail')">
          <el-form-item label="批注状态">
            <el-select v-model="filterForm.commentStatus">
              <el-option value="" label="全部"></el-option>
              <el-option :value="1" label="已批注"></el-option>
              <el-option :value="0" label="未批注"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-button
          v-if="$hasPower('SafePlanSafePlanAdd')"
          class="el-icon-plus"
          type="primary"
          @click="$router.push('safePlanEdit')"
        >
          新建
        </el-button>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="planNum" title="安全计划编号"></vxe-table-column>
      <vxe-table-column
        field="planType"
        title="安全计划类型"
        :formatter="({ cellValue }) => $getLabel(planTypeList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="planName" title="安全计划名称"></vxe-table-column>
      <vxe-table-column
        field="planNature"
        title="检查性质"
        :formatter="({ cellValue }) => $getLabel(checkNatureList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="inspectContent" title="检查内容"></vxe-table-column>
      <vxe-table-column field="inspectRequirements" title="检查要求"></vxe-table-column>
      <vxe-table-column field="inspectDeptName" title="检查部门"></vxe-table-column>
      <vxe-table-column field="inspectPrincipalName" title="检查人"></vxe-table-column>
      <vxe-table-column field="planStartTime" title="计划开始时间" formatter="ymd"></vxe-table-column>
      <vxe-table-column field="planEndTime" title="计划结束时间" formatter="ymd"></vxe-table-column>
      <vxe-table-column field="inspectDuration" title="检查周期(天)"></vxe-table-column>
      <vxe-table-column field="inspectFrequency" title="检查频率"></vxe-table-column>
      <vxe-table-column
        field="status"
        title="状态"
        :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column
        v-if="$hasPower('SafetyPlanCommentPCDetail')"
        field="commentStatus"
        title="批注状态"
        width="120px"
      >
        <template slot-scope="scope">
          <span class="comment-status" :class="{ active: scope.row.commentStatus }">{{
            scope.row.commentStatus ? '已批注' : '未批注'
          }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="160px">
        <template slot-scope="{ row }">
          <template v-if="row.status === 0">
            <span style="margin: 0 3px;">
              <a v-if="$hasPower('SafePlanSafePlanStart')" @click="handleStart(row.id)">启用</a></span
            >
            <span style="margin: 0 3px;"
              ><a v-if="$hasPower('SafePlanSafePlanEdit')" @click="handleEdit(row.id)">编辑</a></span
            >
          </template>
          <template v-if="row.status === 1">
            <span style="margin: 0 3px;">
              <a v-if="$hasPower('SafePlanSafePlanStop')" @click="handleStop(row.id)">停用</a></span
            >
          </template>
          <!--<template v-if="row.status === 2">
            <span style="margin: 0 3px"> <a @click="handleStart(row.id)">启用</a></span>
          </template>-->
          <span style="margin: 0 3px;">
            <a v-if="$hasPower('SafePlanSafePlanDetail')" @click="handleDetail(row.id)">查看</a></span
          >
          <!-- <span style="margin: 0 3px"><a @click="handleDelete(row.id)">删除</a></span>
          <span style="margin: 0 3px"><a @click="remove(row)">删除</a></span>-->
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import checkNatureList from '../../lib/checkNatureList'
import statusList from '../../lib/statusList'
import planTypeList from '../../lib/planTypeList'
import Api from '../../api/index'
export default {
  name: 'SafeCheckPlan',
  data() {
    return {
      checkNatureList,
      statusList,
      planTypeList,
      planType: '',
      filterForm: {
        search: '',
        planNature: '',
        status: null,
        projectId: this.$store.state.project.projectId,
        planTypes: [2, 3]
      },
      request(body) {
        return Api.plan.list(body)
      }
    }
  },
  watch: {
    planType: {
      handler(val) {
        this.filterForm.planTypes = [val]
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
    async handleStart(id) {
      await Api.plan.start(id)
      this.$message.success('启用成功')
      this.refresh()
    },
    async handleStop(id) {
      await Api.plan.stop(id)
      this.$message.success('停用成功')
      this.refresh()
    },
    handleDetail(id) {
      this.$router.push({ name: `SafePlanSafePlanDetail`, params: { id: id, isCheck: false } })
    },
    handleEdit(id) {
      this.$router.push({ name: `SafePlanSafePlanEdit`, params: { id: id } })
    },
    async handleDelete(id) {
      await this.$confirm('此操作将删除该计划, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      await Api.plan.delete(id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
