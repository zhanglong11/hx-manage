<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="选择房间">
          <el-input v-model="locationNames" placeholder="请选择" @focus="selectVisible = true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="q"
            style="width: 350px;"
            placeholder="请输入单体/单元/楼层/户型搜索"
            @input="handleSearch"
          />
        </el-form-item>
      </el-form>
      <div>
        <el-button
          v-if="$hasPower('ProcedureScheduleTreeSmartDecoration')"
          :disabled="!activeProcedureId"
          type="primary"
          @click="$router.push('working-procedure-schedule/' + activeProcedureId + '/tree')"
        >
          查看进度
        </el-button>
      </div>
    </div>
    <!-- 工具栏 end -->
    <vxe-table
      ref="xTree"
      class="table scroll-beauty"
      row-id="id"
      :show-header-overflow="true"
      column-min-width="140px"
      highlight-current-row
      :tree-config="treeConfig"
      :data="computedList"
    >
      <vxe-table-column title="工序名称" tree-node field="name" width="240px" align="left">
        <template v-slot="{ row }">
          <span v-html="row.name || row.mainProcedure"></span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="floorRule" type="html" title="工序规则"> </vxe-table-column>
      <vxe-table-column field="startTime" type="html" title="计划开始时间"></vxe-table-column>
      <vxe-table-column field="endTime" title="计划结束时间"></vxe-table-column>
      <vxe-table-column field="planDuration" title="计划工期"> </vxe-table-column>
      <vxe-table-column field="planDuration" title="开工状态">
        <template v-slot="{ row }">
          <span v-if="row.status === 0">未开始</span>
          <span v-else-if="row.status === 1">进行中</span>
          <span v-else-if="row.status === 2">已完成</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="actualStartTime" title="实际开始时间"></vxe-table-column>
      <vxe-table-column field="actualEndTime" title="实际结束时间"> </vxe-table-column>
      <vxe-table-column field="actualDuration" title="实际工期" width="80"></vxe-table-column>
      <vxe-table-column field="overDueFlag" title="是否延期" width="80">
        <template v-slot="{ row }">
          <span v-if="row.status === 1">是</span>
          <span v-else-if="row.status === 0">否</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="工序状态" width="80">
        <template v-slot="{ row }">
          <span v-if="!row.floorRule && row.status === 2">自动确认</span>
          <!-- 针对工序 -->
          <span v-else-if="row.status === 2">已确认</span>
          <span v-else-if="row.status === 1">待确认</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="confirmorName" title="确认人" width="100"></vxe-table-column>
      <vxe-table-column title="操作" width="80">
        <template v-slot="{ row }">
          <el-button
            v-if="$hasPower('ProgressStartSmartDecoration') && row.mainProcedure && !row.actualStartTime"
            type="text"
            @click="start(row)"
            >开 工</el-button
          >
          <!--已完工且是工序才可以查看-->
          <router-link
            v-if="
              row.status === 2 &&
              row.mainProcedure &&
              $hasPower('ProgressScheduleDetailSmartDecoration') &&
              row.actualStartTime
            "
            :to="'working-procedure-schedule/' + activeProcedureId + '/detail/' + row.scheduleId"
            >查看</router-link
          >
          <el-button
            v-else-if="row.status === 1 && row.prevStatus === 1"
            type="text"
            disabled
            title="上一个确认之后这个才可以确认"
            >确认</el-button
          >
          <router-link
            v-else-if="row.status === 1 && $hasPower('ProgressScheduleConfirmSmartDecoration')"
            :to="'working-procedure-schedule/' + activeProcedureId + '/confirm/' + row.scheduleId"
            >确认</router-link
          >
        </template>
      </vxe-table-column>
    </vxe-table>
    <!--选择单元-->
    <SelectTreeMonomer
      v-if="selectVisible"
      :visible.sync="selectVisible"
      :selectedId="locationIds"
      @getTarget="getTarget"
    />
  </div>
</template>

<script>
import { processProgressApi } from '../api/process-progress'
import _ from 'lodash'
import toTree from '@/utils/toTree'
import treeFilter from '@/utils/treeFilter'
import treeForEach from '@/utils/treeForEach'
import SelectTreeMonomer from '../components/SelectTreeMonomer'
export default {
  name: 'DecorationProgressProcedureApprovalSmartDecoration',
  components: { SelectTreeMonomer },
  data() {
    return {
      treeConfig: {
        children: 'children',
        expandAll: true
      },
      q: '', //关键字搜索树状图
      debounceQ: '',
      list: [], //工序的具体信息，用来展示表格数据
      originData: [], //list的副本信息
      procedureList: [],
      activeProcedureId: this.$route.query.id,
      selectVisible: false,
      locationNames: '', //选择的房间名
      locationIds: [] //选择的房间id
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    },
    computedList() {
      this.$nextTick(() => {
        this.$refs.xTree.setAllTreeExpansion(true)
      })
      const searchProps = ['name', 'mainProcedure', 'floorRule']
      if (this.debounceQ) {
        return treeFilter(this.list, (item, parent) => {
          searchProps.forEach(prop => {
            if (item[prop]) {
              item[prop] = item[prop].replace(
                new RegExp(this.debounceQ, 'gi'),
                match => `<span class="keyword-lighten">${match}</span>`
              )
            }
          })
          return (
            _.includes(item.name, this.debounceQ) ||
            _.includes(_.get(parent, 'name', ''), this.debounceQ) ||
            _.includes(item.mainProcedure, this.debounceQ)
          )
        })
      } else {
        return this.list
      }
    }
  },
  watch: {
    locationNames: {
      immediate: true,
      handler(val) {
        if (val) {
          this.refresh()
        }
      }
    }
  },
  created() {
    this.getProcedureList()
  },
  methods: {
    async refresh() {
      //let res = await processProgressApi.queryProcedureScheduleList(this.activeProcedureId)
      let res = await processProgressApi.queryProcedureScheduleListByLocationIds({
        locationIds: this.locationIds,
        projectId: this.projectId
      })
      this.originData = _.cloneDeep(res.data)
      res.data.forEach(e => {
        if (e.volist) {
          e.children = e.volist
        }
      })
      let list = toTree(res.data, 'pid')
      treeForEach(list, (item, parent, index) => {
        if (index !== 0) {
          item.prevStatus = parent.children[index - 1].status
          item.prevActualStartTime = parent.children[index - 1].actualStartTime
        } else {
          item.isFirst = true
        }
      })
      this.list = list
    },
    getProcedureList() {
      processProgressApi
        .queryConfigListWorking({
          page: 1,
          rows: 1000,
          status: 1,
          projectId: localStorage.getItem('projectId')
        })
        .then(res => {
          /*if (!this.activeProcedureId && res.data.records.length) {
            this.activeProcedureId = _.first(res.data.records).id
          }*/
          this.procedureList = res.data.records
        })
    },
    start(row) {
      processProgressApi.start(row.scheduleId).then(res => {
        this.$message.success('操作成功')
        this.refresh()
      })
    },
    handleSearch: _.debounce(function (val) {
      this.debounceQ = val
    }, 300),
    getTarget(data) {
      this.locationNames = data.locationNames
      this.locationIds = data.locationIds
    }
  }
}
</script>

<style lang="less" scoped></style>
