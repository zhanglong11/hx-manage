<template>
  <TreeSelect
    :value="value || null"
    :options="computedList"
    label="name"
    loading-text="加载中..."
    no-options-text="没有选项..."
    no-results-text="没有匹配的选项..."
    placeholder="请选择"
    :alwaysOpen="alwaysOpen"
    :appendToBody="appendToBody"
    :multiple="multiple"
    flat
    style="width: 200px;"
    :disabled="disabled || (elForm || {}).disabled"
    @input="val => $emit('input', val || 0)"
  />
</template>

<script>
import treeForEach from '@/utils/treeForEach'
import treeFilter from '@/utils/treeFilter'
export default {
  name: 'SelectProcessCategory',
  props: {
    value: [Array, String, Number],
    disableKeys: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    alwaysOpen: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    valueKey: {
      type: String,
      default: 'argCode' //  pid 使用 id， 其它分类使用argCode
    }
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  computed: {
    computedList() {
      /**
       任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
       开发人员：李建敏
       日期：2020-3月-17日
       任务类型：2、复制修改代码 （1行）
       **/
      let data = _.cloneDeep(this.$store.state.workflow.processCategoryTree)
      treeForEach(data, e => {
        e.id = e[this.valueKey]
        e.label = e.argText
        if (this.disableKeys.includes(e.id)) {
          delete e.children
        }
      })
      return treeFilter(data, e => !this.disableKeys.includes(e.id))
    }
  },
  created() {
    if (this.computedList.length === 0) {
      /**
       任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
       开发人员：李建敏
       日期：2020-3月-17日
       任务类型：2、复制修改代码 （1行）
       **/
      //this.$store.dispatch('workflow/getProcessCategory')
    }
  }
}
</script>
<style>
.vue-treeselect {
  line-height: 18px;
}
</style>
