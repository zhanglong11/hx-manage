<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.search" placeholder="检查人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="问题等级">
          <el-select v-model="filterForm.issueLevel">
            <el-option v-for="e in issueLevelList" :key="e.value" :label="e.label" :value="e.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="紧急程度">
          <el-select v-model="filterForm.emergencyLevel">
            <el-option v-for="e in emergencyLevelList" :key="e.value" :label="e.label" :value="e.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.inspectStatus">
            <el-option v-for="e in inspectStatusList" :key="e.value" :label="e.label" :value="e.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检查日期">
          <DateRange :startTime.sync="filterForm.startTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <template v-if="$hasPower('QualityInspectRecordCommentPCDetail')">
          <el-form-item label="批注状态">
            <el-select v-model="filterForm.commentStatus">
              <el-option value="" label="全部"></el-option>
              <el-option :value="1" label="已批注"></el-option>
              <el-option :value="0" label="未批注"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-button-group>
          <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
        </el-button-group>
        <br />
        <el-button
          v-if="$hasPower('QualityControlQualityCheckAdd')"
          icon="el-icon-plus"
          type="primary"
          @click="$router.push('qualityCheck/add')"
          >质量巡检</el-button
        >
      </el-form>
    </div>
    <div>
      <Grid ref="table" row-id="inspectTaskId" page-use-query :request="request" :filter-form.sync="filterForm">
        <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
        <vxe-table-column field="planName" title="质量计划"></vxe-table-column>
        <!-- <vxe-table-column field="inspectArea" title="检查部位"></vxe-table-column> -->
        <vxe-table-column
          field="planNature"
          title="检查性质"
          :formatter="({ cellValue }) => $getLabel(planNatureList, cellValue)"
        ></vxe-table-column>
        <vxe-table-column field="inspectContent" title="检查内容"></vxe-table-column>
        <vxe-table-column field="inspectPrincipalName" title="检查人"></vxe-table-column>
        <vxe-table-column field="planInspectTime" title="计划检查日期" formatter="ymd"></vxe-table-column>
        <vxe-table-column
          field="inspectStatus"
          title="状态"
          :formatter="({ cellValue }) => $getLabel(inspectStatusList, cellValue)"
        ></vxe-table-column>
        <vxe-table-column
          field="rectifyStatus"
          title="整改状态"
          :formatter="({ cellValue }) => $getLabel(rectifyStatusList, cellValue)"
        ></vxe-table-column>
        <vxe-table-column
          v-if="$hasPower('QualityInspectRecordCommentPCDetail')"
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
        <vxe-table-column title="操作">
          <template v-slot="{ row }">
            <el-button
              v-if="
                $hasPower('QualityControlQualityCheckInspect') &&
                row.rectifyStatus === 0 &&
                row.userType === 1 &&
                moment().isSameOrAfter(row.planInspectTime)
              "
              type="text"
              @click="$router.push('qualityCheck/' + row.inspectTaskId)"
            >
              检查
            </el-button>
            <el-button
              v-if="
                $hasPower('QualityControlQualityCheckOrder') && [2, 6].includes(row.rectifyStatus) && row.userType === 1
              "
              type="text"
              @click="showReleaseDialog(row)"
            >
              下达
            </el-button>
            <el-button
              v-if="$hasPower('QualityControlQualityRectify') && [3].includes(row.rectifyStatus) && row.userType === 2"
              type="text"
              @click="showRectifyDialog(row)"
            >
              整改
            </el-button>
            <el-button
              v-if="$hasPower('QualityControlQualityCheckRecheck') && row.rectifyStatus === 4 && row.userType === 1"
              type="text"
              @click="showReviewDialog(row)"
            >
              复查
            </el-button>
            <el-button
              v-if="$hasPower('QualityControlQualityCheckDetail')"
              type="text"
              @click="$router.push('qualityCheck/' + row.inspectTaskId + '/view')"
              >查看</el-button
            >
          </template>
        </vxe-table-column>
      </Grid>
    </div>
    <RectifyDialog :row="activeRow" :visible.sync="rectifyDialogVisible" />
    <ReviewDialog :row="activeRow" :visible.sync="reviewDialogVisible" />
    <ReleaseDialog :row="activeRow" :visible.sync="releaseDialogVisible" />
  </div>
</template>

<script>
import RectifyDialog from './components/RectifyDialog'
import ReviewDialog from './components/ReviewDialog'
import ReleaseDialog from './components/ReleaseDialog'
import issueLevelList from './lib/issueLevelList'
import emergencyLevelList from './lib/emergencyLevelList'
import planNatureList from './lib/planNatureList'
import inspectStatusList from './lib/inspectStatusList'
import rectifyStatusList from './lib/rectifyStatusList'
export default {
  name: 'QualityCheck',
  components: {
    RectifyDialog,
    ReviewDialog,
    ReleaseDialog
  },
  data() {
    return {
      rectifyDialogVisible: false, //整改
      reviewDialogVisible: false, //复查
      releaseDialogVisible: false, //下达
      activeId: null,
      activeRow: {},
      filterForm: {
        planType: 1,
        projectId: localStorage.getItem('projectId')
      },
      request(body) {
        return this.axios.safety.post('inspect/list', body)
      },
      issueLevelList,
      emergencyLevelList,
      planNatureList,
      inspectStatusList,
      rectifyStatusList
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    showReleaseDialog(row) {
      this.activeRow = row
      this.releaseDialogVisible = true
    },
    showRectifyDialog(row) {
      this.activeRow = row
      this.rectifyDialogVisible = true
    },
    showReviewDialog(row) {
      this.activeRow = row
      this.reviewDialogVisible = true
    }
  }
}
</script>

<style scoped></style>
