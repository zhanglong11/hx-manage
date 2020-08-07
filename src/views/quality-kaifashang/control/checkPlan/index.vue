<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.search" style="width: 300px;" placeholder="验收要求/创建人"></el-input>
        </el-form-item>
        <el-form-item label="计划时间">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item label="检查性质" prop="planNature">
          <el-select v-model="filterForm.planNature" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in checkNatureList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <template v-if="$hasPower('QualityInspectPlanCommentPCDetail')">
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
          v-if="$hasPower('QualityControlCheckPlanAdd')"
          class="el-icon-plus"
          type="primary"
          @click="$router.push('checkPlanEdit')"
        >
          新建
        </el-button>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="planNum" title="检查计划编号"></vxe-table-column>
      <vxe-table-column field="planName" title="检查计划名称"></vxe-table-column>
      <vxe-table-column
        field="planNature"
        title="检查性质"
        :formatter="({ cellValue }) => $getLabel(checkNatureList, cellValue)"
      ></vxe-table-column>
      <!-- <vxe-table-column field="inspectItem" title="检查项目"></vxe-table-column>
      <vxe-table-column field="inspectArea" title="检查部位"></vxe-table-column> -->
      <vxe-table-column field="inspectContent" title="检查内容"></vxe-table-column>
      <vxe-table-column field="inspectRequirements" title="检查要求"></vxe-table-column>
      <vxe-table-column field="inspectNum" title="检查数量"></vxe-table-column>
      <vxe-table-column field="planStartTime" title="计划开始时间" formatter="ymd"></vxe-table-column>
      <vxe-table-column field="planEndTime" title="计划结束时间" formatter="ymd"></vxe-table-column>
      <vxe-table-column field="inspectDuration" title="检查周期"></vxe-table-column>
      <vxe-table-column field="inspectFrequency" title="检查频率"></vxe-table-column>
      <vxe-table-column
        field="status"
        title="状态"
        :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column
        v-if="$hasPower('QualityInspectPlanCommentPCDetail')"
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
          <template
            v-if="row.status === 0 || (row.status === 2 && moment().format('YYYY-MM-DD HH:mm:ss') < row.planStartTime)"
          >
            <span v-if="$hasPower('QualityControlCheckPlanStart')" style="margin: 0 3px;">
              <a @click="handleStart(row.id)">启用</a></span
            >
            <span v-if="$hasPower('QualityControlCheckPlanEdit')" style="margin: 0 3px;"
              ><a @click="handleEdit(row.id)">编辑</a></span
            >
          </template>
          <template v-if="row.status === 1">
            <span v-if="$hasPower('QualityControlCheckPlanStart')" style="margin: 0 3px;">
              <a @click="handleStop(row.id)">停用</a></span
            >
          </template>
          <!--<template v-if="row.status === 2">
            <span style="margin: 0 3px"> <a @click="handleStart(row.id)">启用</a></span>
          </template>-->
          <span v-if="$hasPower('QualityControlCheckPlanDetail')" style="margin: 0 3px;">
            <a @click="handleDetail(row.id)">查看</a></span
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
import Api from '../../api/index'
export default {
  name: 'CheckPlan',
  data() {
    return {
      checkNatureList,
      statusList,
      filterForm: {
        search: '',
        planNature: '',
        projectId: this.$store.state.project.projectId,
        planTypes: [1]
      },
      request(body) {
        return Api.checkPlan.list(body)
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
      await Api.checkPlan.start(id)
      this.$message.success('启用成功')
      this.refresh()
    },
    async handleStop(id) {
      await Api.checkPlan.stop(id)
      this.$message.success('停用成功')
      this.refresh()
    },
    handleDetail(id) {
      this.$router.push({ name: `QualityControlCheckPlanDetail`, params: { id: id, isCheck: false } })
    },
    handleEdit(id) {
      this.$router.push({ name: `QualityControlCheckPlanEdit`, params: { id: id } })
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
      await Api.checkPlan.delete(id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
