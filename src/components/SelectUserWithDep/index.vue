<!--
    /**
       任务名称：2709/取样单修改
       开发人员：崔洛宜
       日期：2020-03-25
       任务类型：全新代码
       **/
-->

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
        $emit('update:id', val && val.id)
        $emit('update:name', val && val.label)
      }
    "
  />
</template>

<script>
export default {
  name: 'SelectUserWithDep',
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
  computed: {
    treeData() {
      return this.$store.state.departmentUserListWithDep
    }
  },
  created() {
    !this.treeData.length && this.$store.dispatch('getDepartmentUserListWithDep')
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
