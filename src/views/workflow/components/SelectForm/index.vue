<template>
  <el-select :value="value" placeholder="请选择" @change="val => $emit('input', val)">
    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id" />
  </el-select>
</template>

<script>
export default {
  name: 'SelectForm',
  props: {
    value: [String, Number]
  },
  computed: {
    list() {
      /**
       任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
       开发人员：李建敏
       日期：2020-3月-17日
       任务类型：2、复制修改代码 （1行）
       **/
      return this.$store.state.workflow.formList
    }
  }
}
</script>
