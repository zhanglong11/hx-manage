<template>
  <el-dialog
    width="400px"
    :modal="true"
    top="10vh"
    title="请选择"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <div class="treeView">
      <el-input v-model="filterText" placeholder="请输入" style="width: 180px; margin-right: 10px;"> </el-input>
      <el-button type="primary" icon="el-icon-search" @click="$refs.tree.filter(filterText)">搜索</el-button>
      <el-button
        icon="el-icon-refresh-left"
        @click="
          () => {
            filterText = ''
            $refs.tree.filter('')
          }
        "
        >重置</el-button
      >
    </div>
    <el-tree
      ref="tree"
      class="filter-tree"
      node-key="id"
      style="max-height: 400px; overflow-y: auto;"
      show-checkbox
      :data="treeData"
      :props="defaultProps"
      :default-checked-keys="selectedId"
      :filter-node-method="filterNode"
      @check="handleNodeClick"
    />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>
<script>
import Api from '@/views/measureQuantity/api/measure'
export default {
  name: 'SelectTreeMonomer',
  props: {
    visible: {},
    targetType: {
      default: null
    },
    selectedId: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      projectId: localStorage.getItem('projectId'),
      locationIds: [], //选择的房间号
      locationNames: '' //选择的房间号
    }
  },
  watch: {
    targetType: function(val) {
      this.refresh()
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      // let res = await api.tree({})
      // this.treeData = toTree(res.data)
      this.getTreeListInfo()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /*单体树形结构列表*/
    async getTreeListInfo() {
      let res = await Api.getTreeListInfo(this.projectId)
      this.treeData = res.data || []
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    handleNodeClick(node, data) {
      let selectedLeaf = this.$refs.tree.getCheckedNodes().filter(item => item.type === 5)
      this.locationIds = selectedLeaf.map(item => item.id)
      this.locationNames = selectedLeaf.map(item => item.label).join(',')
    },
    submit() {
      if (!this.locationIds.length) {
        this.$message.warning('请最少选择一个房间')
        return
      }
      this.$emit('getTarget', {
        locationIds: this.locationIds,
        locationNames: this.locationNames
      })
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
.filter-tree {
  /deep/.tree-item {
    &.active {
      color: #409eff;
    }
    &.disabled {
      width: 100%;
      cursor: not-allowed;
      color: #dcdfe6;
    }
  }
}
/*/deep/ .el-tree-node {
  .is-leaf + .el-checkbox .el-checkbox__inner {
    display: inline-block;
  }
  /deep/ .el-checkbox .el-checkbox__inner {
    display: none;
  }
}*/
</style>
