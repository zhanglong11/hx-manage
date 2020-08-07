<template>
  <TreeSelect
    :value="value"
    :options="computedOptions"
    label="name"
    flat
    :multiple="multiple"
    loading-text="加载中..."
    no-options-text="没有选项..."
    :normalizer="node => ({ id: node.taskUniqueId, label: node.name, children: node.children })"
    no-results-text="没有匹配的选项..."
    :disabled="disabled || (elForm || {}).disabled"
    placeholder="请选择"
    @select="$emit('change')"
    @input="val => $emit('input', val)"
  />
</template>

<script>
import treeForEach from '@/utils/treeForEach'

export default {
  name: 'SelectTask',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    value: [String, Number, Array],
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    disableKeys: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    computedOptions() {
      return treeForEach(this.options, e => {
        e.isDisabled = this.disableKeys.includes(e.taskUniqueId)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.vue-treeselect {
  display: inline-block;
  width: 215px;
  font-size: unset;
}
</style>
