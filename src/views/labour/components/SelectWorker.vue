<template>
  <TreeSelect
    :value="value"
    :options="treeData"
    label="name"
    :multiple="multiple"
    :valueFormat="valueFormat"
    loading-text="加载中..."
    no-options-text="没有选项..."
    no-results-text="没有匹配的选项..."
    :disabled="disabled || (elForm || {}).disabled"
    placeholder="请选择"
    disable-branch-nodes
    @input="
      val => {
        $emit('input', val)
      }
    "
  />
</template>

<script>
export default {
  name: 'SelectUser',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    value: [String, Number, Array, Object],
    disabled: {
      type: Boolean,
      default: false
    },
    valueFormat: {
      type: String,
      default: 'object',
      enum: ['id', 'object']
    },
    disableKeys: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      treeData: []
    }
  },
  created() {
    this.axios.labour.post('company/tree', { projectId: localStorage.getItem('projectId') }).then(res => {
      res.data.forEach(e => {
        e.label = e.labourCompanyName
        e.id = e.labourCompanyId
        if (e.list) {
          e.list.forEach(f => {
            f.label = f.labourEmployeeName
            f.id = f.labourEmployeeId
          })
          e.children = e.list
        } else {
          e.children = []
        }
      })
      this.treeData = res.data
    })
  }
}
</script>
<style lang="less">
.vue-treeselect {
  display: inline-block;
  width: 100%;
  font-size: unset;
}
.el-form--inline {
  .vue-treeselect {
    width: 215px;
  }
}
</style>
