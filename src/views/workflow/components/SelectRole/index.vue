<!--
@author 李建敏
@date 2020/02/24 创建
@date 2020/03/13 修改  3行  设置options对应的objectKey，并给el-select默认设置multiple
-->

<template>
  <TreeSelect
    :value="value"
    :options="list"
    label="name"
    loading-text="加载中..."
    no-options-text="没有选项..."
    no-results-text="没有匹配的选项..."
    placeholder="请选择"
    multiple
    flat
    disable-branch-nodes
    :disabled="disabled || elForm.disabled"
    @input="val => $emit('input', val)"
  />
</template>

<script>
import treeForEach from '@/utils/treeForEach'

export default {
  name: 'SelectRole',
  props: {
    value: [String, Number, Array],
    disabled: {
      type: Boolean
    },
    elForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    list() {
      let data = _.cloneDeep(this.$store.state.workflow.roleCategory)
      treeForEach(data, e => {
        e.value = e.id
        e.label = e.name
        e.isUser = !e.children
        if (e.isUser) delete e.children
      })
      return data
    }
  },
  created() {
    this.$store.dispatch('workflow/getRoleCategory')
  }
}
</script>
