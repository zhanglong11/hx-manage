<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="选择单元">
          <el-select v-model="activeProcedureId">
            <el-option v-for="e in procedureList" :key="e.id" :label="e.name" :value="e.id"></el-option>
          </el-select>
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
    </div>
    <!-- 工具栏 end -->

    <vxe-table
      ref="xTree"
      class="table scroll-beauty"
      row-id="id"
      highlight-current-row
      :stripe="false"
      :tree-config="treeConfig"
      :show-overflow="false"
      :data="computedList"
      :loading="tableLoading"
      max-height="90%"
    >
      <vxe-table-column tree-node field="name" width="240px" fixed="left">
        <template v-slot="{ row }">
          <span v-html="row.name || row.mainProcedure"></span>
        </template>
      </vxe-table-column>
      <template v-for="item in configWorkingList">
        <vxe-table-column :key="item.value" :min-width="100" :title="item.label">
          <template v-slot="{ row }">
            <!-- <span v-if="row.volist">{{ _.map(row.volist, 'detailId').includes(item.value) }}</span> -->
            <div
              v-if="row.volist && _.map(row.volist, 'detailId').includes(item.value)"
              class="work-status"
              :style="{
                background:
                  _.find(row.volist, { detailId: item.value }).overDueFlag === 1
                    ? '#f90'
                    : _.find(volistType, { value: _.find(row.volist, { detailId: item.value }).status }).color
              }"
            >
              <span v-if="_.find(row.volist, { detailId: item.value }).status === 0" class="no-start">{{
                _.find(volistType, { value: _.find(row.volist, { detailId: item.value }).status }).label
              }}</span>
              <router-link
                v-else
                :to="`/decoration-progress-smart-decoration/working-procedure-schedule/${activeProcedureId}/${
                  _.find(row.volist, { detailId: item.value }).status === 1 ? 'confirm' : 'detail'
                }/${_.find(row.volist, { detailId: item.value }).scheduleId}`"
                >{{
                  _.find(volistType, { value: _.find(row.volist, { detailId: item.value }).status }).label
                }}</router-link
              >
            </div>
          </template>
        </vxe-table-column>
      </template>
    </vxe-table>
  </div>
</template>

<script>
import { processProgressApi } from '../api/process-progress'
import _ from 'lodash'
import toTree from '@/utils/toTree'
import treeFilter from '@/utils/treeFilter'
import treeForEach from '@/utils/treeForEach'
export default {
  name: 'DecorationProgressProcedureApprovalSmartDecoration',
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
      configWorkingList: [], // 所有工序列表
      volistType: [
        {
          value: 0,
          label: '未开始',
          color: '#ccc'
        },
        {
          value: 1,
          label: '进行中',
          color: '#08f'
        },
        {
          value: 2,
          label: '已完成',
          color: '#0a6'
        }
      ],
      tableLoading: true // 表单loading
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
    activeProcedureId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getDetailsConfigWorking()
        }
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.getProcedureList()
    },
    // 获取工序配置详情
    async getDetailsConfigWorking() {
      let result = await processProgressApi.getConfigDetailName(this.activeProcedureId)
      let datas = result.data
      let list = []
      datas.map(item => {
        list.push({
          value: item.id,
          label: item.mainProcedure
        })
      })
      this.configWorkingList = list
      this.refresh()
    },
    // 加载表格数据
    async refresh() {
      let res = await processProgressApi.getScheduleStatistics(this.activeProcedureId)
      this.originData = _.cloneDeep(res.data)
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
      this.tableLoading = false
    },
    // 工序配置-分页列表
    async getProcedureList() {
      let params = {
        page: 1,
        rows: 1000,
        status: 1,
        projectId: this.projectId
      }
      let result = await processProgressApi.queryConfigListWorking(params)
      let datas = result.data.records || []
      if (!this.activeProcedureId && datas.length) {
        this.activeProcedureId = _.first(datas).id
      }
      if (datas.length === 0) {
        this.tableLoading = false
      }
      console.log(111, datas)
      this.procedureList = datas
    },
    // 搜索
    handleSearch: _.debounce(function (val) {
      this.debounceQ = val
    }, 300)
  }
}
</script>

<style lang="less" scoped>
.table {
  /deep/td {
    height: auto !important;
    padding: 5px !important;
    .vxe-cell {
      padding: 0 !important;
    }
  }
}
.work-status {
  position: relative;
  z-index: 1;
  color: #fff;
  transition: all 0.4s;
  .no-start {
    cursor: no-drop;
    display: block;
    width: 100%;
    height: 100%;
  }
  a {
    color: #fff;
    transition: all 0.4s;
    display: block;
    width: 100%;
    height: 100%;
    &:hover {
      transform: scale(1.3);
    }
  }
  &:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
}
</style>
