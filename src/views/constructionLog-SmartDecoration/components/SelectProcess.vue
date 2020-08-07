<template>
  <el-dialog
    width="30%"
    :modal="true"
    top="10vh"
    title="请选择"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
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
    <el-tree
      ref="tree"
      class="filter-tree"
      node-key="id"
      style="max-height: 400px; overflow-y: auto;"
      show-checkbox
      default-expand-all
      :data="computedList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      @check="handleNodeClick"
      @check-change="parentModules"
    >
      <span slot-scope="{ node }" class="custom-tree-node">
        <span>{{ node.label || node.name || node.mainProcedure }}</span>
      </span>
    </el-tree>
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>
<script>
import { processProgressApi } from '@/views/decoration-progress-smart-decoration/api/process-progress'
import _ from 'lodash'
import toTree from '@/utils/toTree'
import treeFilter from '@/utils/treeFilter'
import treeForEach from '@/utils/treeForEach'
export default {
  name: 'SelectProcess',
  props: {
    visible: {},
    targetType: {
      default: null
    }
  },
  data() {
    return {
      treeConfig: {
        children: 'children',
        expandAll: true
      },
      defaultProps: {
        children: 'children',
        label: (data, node) => {
          return data.name || data.mainProcedure
        },
        disabled: (data, node) => {
          if (data.type < 6) {
            return !data.leaf
          }
        }
      },
      checkName: '',
      checkId: '',
      q: '', //关键字搜索树状图
      debounceQ: '',
      list: [], //工序的具体信息，用来展示表格数据
      originData: [], //list的副本信息
      procedureList: [],
      activeProcedureId: this.$route.query.id
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    },
    computedList() {
      const searchProps = ['name', 'mainProcedure', 'floorRule']
      if (this.debounceQ) {
        return treeFilter(this.list, (item, parent) => {
          searchProps.forEach(prop => {
            if (item[prop]) {
              item[prop] = item[prop].replace(
                new RegExp(this.debounceQ, 'gi'),
                // match => `<span class="keyword-lighten">${match}</span>`
                match => `${match}`
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
      // let res = await processProgressApi.queryProcedureScheduleList(this.activeProcedureId)
      let res = await this.axios.decoration.get(`working/procedure/floor/schedule/start/list/${this.activeProcedureId}`)
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
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
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
          if (!this.activeProcedureId && res.data.records.length) {
            this.activeProcedureId = _.first(res.data.records).id
          }
          this.procedureList = res.data.records
        })
    },
    //
    // 开工是以单楼层为单位的，设置单元，户型，单体不可用
    checkMethod({ row }) {
      return row.mainProcedure && !row.actualStartTime
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    handleNodeClick(node, data) {
      // console.log('选中节点data', data.checkedNodes)
      this.checkName = data.checkedNodes.map(item => {
        return _.last(item.ancestorNames) + '-' + item.mainProcedure
      })
      this.checkId = data.checkedNodes.map(item => item.locationId)
    },
    //节点选择状态发生改变时
    parentModules(data, checkbox, node) {
      // console.log(data)
      if (checkbox) {
        this.$refs.tree.setCheckedKeys([data.id])
        this.uniqueValue = this.$refs.tree.getCheckedKeys()
      } else {
        this.uniqueValue = this.$refs.tree.getCheckedKeys()
        if (this.uniqueValue.length === 0) {
          this.uniqueValue = ''
        }
      }
    },
    submit() {
      if (this.checkName.length) {
        this.$emit('getTarget', {
          label: this.checkName.join(','),
          id: this.checkId.join(',')
        })
        this.$emit('update:visible', false)
      } else {
        this.$message.info('请选择工序')
        return
      }
    },
    start() {
      const row = this.$refs.xTree.getRadioRecord()
      processProgressApi.start(row.scheduleId).then(res => {
        this.$message.success('操作成功')
        this.refresh()
      })
    },
    handleSearch: _.debounce(function (val) {
      this.debounceQ = val
    }, 300)
  }
}
</script>

<style scoped lang="less">
/deep/ .el-tree-node {
  .is-leaf + .el-checkbox .el-checkbox__inner {
    display: inline-block;
  }
  /deep/ .el-checkbox .el-checkbox__inner {
    display: none;
  }
}
</style>
