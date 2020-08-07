<template>
  <div>
    <div>
      <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="width: 200px; margin-right: 10px;">
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="$refs.tree.filter(filterText)">搜索</el-button>
      <el-button @click="filterText = ''">重置</el-button>
    </div>
    <el-tree
      ref="tree"
      class="filter-tree"
      :data="treeData"
      :props="defaultProps"
      highlight-current
      node-key="meteringUnitId"
      default-expand-all
      :filter-node-method="filterNode"
      :render-content="renderContent"
      @node-click="handleNodeClick"
    >
    </el-tree>
  </div>
</template>
<script>
/**
 * id:f0772a8e65ea4ee38024577b33f11392      key:c3b593804051408682f81a45b284f5a5
 任务名称：TASK#2828 3月7号注释
 开发人员：崔洛宜
 日期：2020-03-31
 任务类型：注释(修改树数据获取,后来删除,改为props传递)
 **/
/**
 任务名称：TASK#2829 3月9日注释
 开发人员：崔洛宜
 日期：2020-04-03
 任务类型：注释(后来删除,改为props传递)
 **/
export default {
  name: 'ProjectTree',
  props: {
    /**
     任务名称：TASK#2830 3月10日注释
     开发人员：崔洛宜
     日期：2020-03-10
     任务类型：注释(修改传参)(5)
     **/
    treeData: {
      type: Array,
      default: () => []
    },
    defaultSelectId: {
      type: [Number, String],
      default: ''
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'name'
        }
      }
    }
  },
  data() {
    return {
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    treeData(val) {
      if (val.length > 0) {
        this.$nextTick(() => this.$refs.tree.setCurrentKey(this.defaultSelectId))
      }
    }
  },
  mounted() {},
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(item, node, data) {
      this.$emit('selectNode', item.meteringUnitId)
    },
    renderContent(h, { node, data, store }) {
      return (
        <div
          class={`tree-item ${data.children && data.children.length ? 'disabled' : ''}`}
          onClick={e => this.handleC(e, data.children && data.children.length)}
        >
          {data.name}
        </div>
      )
    },
    handleC(e, disabled) {
      if (disabled) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.contractName {
  display: inline-block;
  min-width: 400px;
}
.greyFont {
  font-size: 16px;
  font-weight: bold;
  color: #999999;
}
/deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #9ecafd;
}
/deep/ .el-tree-node__content:hover {
  background-color: #c1d6f3;
}
.filter-tree {
  /deep/.tree-item {
    &.disabled {
      width: 100%;
      cursor: not-allowed;
      color: #dcdfe6;
    }
  }
}
</style>
