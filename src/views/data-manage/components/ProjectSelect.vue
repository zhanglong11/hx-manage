<!--
/**
任务名称：TASK#2893 健康管理接口对接
开发人员：崔洛宜
日期：2020-04-07
任务类型：1、全新代码
**/
-->
<template>
  <el-select :value="value" :disabled="disabled" :clearable="clearable" @change="val => $emit('input', val)">
    <template v-if="hasAll">
      <el-option :value="null" label="全部"> </el-option>
    </template>
    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"> </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ProjectSelect',
  props: {
    hasAll: {
      type: Boolean,
      default: true
    },
    value: [String, Number],
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    list() {
      return this.$store.state.dataManage.projectList
    }
  },
  created() {
    if (!this.$store.state.dataManage.projectList.length) {
      this.$store.dispatch('dataManage/getProjectList')
    }
  }
}
</script>
<style lang="less" scoped></style>
