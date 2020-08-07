<template>
  <el-dialog
    width="800px"
    :modal="true"
    top="10vh"
    title="请选择"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <el-tree
      class="filter-tree"
      :expand-on-click-node="false"
      default-expand-all
      :data="treeData"
      :props="defaultProps"
      :render-content="renderContent"
      @node-click="handleNodeClick"
    />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '@/views/quality-kaifashang/api'
import toTree from '@/utils/toTree'
export default {
  name: 'SelectTargetResolveDialog',
  props: {
    visible: {},
    targetType: {
      default: null
    }
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        label: 'engineeringName'
      },
      checkName: null,
      checkId: null,
      checkNumber: null
    }
  },
  watch: {
    targetType: function (val) {
      this.refresh()
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      console.log(this.targetType)
      let res = await Api.targetResolve.tree({})
      this.treeData = toTree(res.data)
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    handleNodeClick(node, data) {
      this.checkName = node.engineeringName
      this.checkNumber = node.engineeringNumber
      this.checkId = node.id
      this.length = node?.children?.length || 0
    },
    submit() {
      this.$emit('getTarget', { name: this.checkName, number: this.checkNumber, id: this.checkId, length: this.length })
      this.$emit('update:visible', false)
    },
    // renderContent(h, { node, data, store }) {
    //   return (
    //     <div
    //       class={data.engineeringDivide !== this.targetType ? 'disabled tree-item' : 'tree-item'}
    //       onClick={e => this.handle(e, data)}
    //     >
    //       {data.engineeringName}
    //     </div>
    //   )
    // },
    renderContent(h, { node, data, store }) {
      return (
        <div
          class={`tree-item ${this.checkId === data.id ? 'active' : ''} ${
            !_.isNil(this.targetType) && data.engineeringDivide !== this.targetType ? 'disabled' : ''
          }`}
          onClick={e => this.handle(e, data)}
        >
          {data.engineeringName}
        </div>
      )
    },
    handle(e, data) {
      if (!_.isNil(this.targetType) && data.engineeringDivide !== this.targetType) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
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
</style>
