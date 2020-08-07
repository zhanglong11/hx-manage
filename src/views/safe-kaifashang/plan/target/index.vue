<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.keyWords"
            style="width: 340px;"
            placeholder="项目安全指标/危险发生概率/指标完成情况/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="ndicatorAchievingStatus">
          <el-select v-model="filterForm.ndicatorAchievingStatus" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in safeTargetList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <!-- <el-form-item label="年度">
          <el-date-picker
            v-model="filterForm.year"
            type="year"
            placeholder="选择年"
            :default-value="moment().add(-1, 'years')"
            :picker-options="{ disabledDate: disabledTime }"
          >
          </el-date-picker>
        </el-form-item>-->
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-button
          v-if="$hasPower('SafePlanTargetAdd')"
          class="el-icon-plus"
          type="primary"
          @click="$router.push('targetEdit')"
        >
          新建
        </el-button>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="year" title="时间范围" width="200">
        <template slot-scope="{ row }"> {{ row.timeRangeBegin | ymd }}~{{ row.timeRangeEnd | ymd }} </template>
      </vxe-table-column>
      <vxe-table-column field="safetyIndicatorName" title="项目安全指标"></vxe-table-column>
      <vxe-table-column field="specificationNumber" title="事故发生数量">
        <template slot-scope="{ row }">
          {{ row.generalAccidentNum + row.largerAccidentNum + row.greatAccidentNum + row.veryGreatAccidentNum }}
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="ndicatorAchievingStatus"
        title="指标完成情况"
        :formatter="({ cellValue }) => $getLabel(safeTargetList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作" width="160px">
        <template slot-scope="{ row }">
          <span style="margin: 0 3px;">
            <a v-if="$hasPower('SafePlanTargetDetail')" @click="handleDetail(row.id)">查看</a></span
          >
          <template v-if="row.ndicatorAchievingStatus === 2">
            <span style="margin: 0 3px;"
              ><a v-if="$hasPower('SafePlanTargetEdit')" @click="handleEdit(row.id)">编辑</a></span
            >
            <span style="margin: 0 3px;"
              ><a v-if="$hasPower('SafePlanTargetDelete')" @click="handleDelete(row.id)">删除</a></span
            >
          </template>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import safeTargetList from '../../lib/safeTargetList'
import Api from '../../api/index'
export default {
  name: 'CheckPlan',
  data() {
    return {
      safeTargetList,
      filterForm: {
        keyWords: '',
        ndicatorAchievingStatus: '',
        year: '',
        projectId: this.$store.state.project.projectId
      },
      request(body) {
        return Api.safeTarget.list(body)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    disabledTime(time) {
      return !moment(time).isBefore(moment(), 'years')
    },
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    handleDetail(id) {
      this.$router.push({ name: `SafePlanTargetDetail`, params: { id: id, isCheck: false } })
    },
    handleEdit(id) {
      this.$router.push({ name: `SafePlanTargetEdit`, params: { id: id } })
    },
    async handleDelete(id) {
      await this.$confirm('此操作将删除该安全目标, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      await Api.safeTarget.delete(id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
