<template>
  <el-select :value="value" placeholder="请选择" @change="val => $emit('input', val)">
    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id" />
  </el-select>
</template>

<script>
export default {
  name: 'SelectDefinition',
  props: {
    value: [String, Number]
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    /**
     任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
     开发人员：李建敏
     日期：2020-3月-17日
     任务类型：2、复制修改代码 （1行）
     **/
    this.axios.workflow.post('activiti/process/definition/list', { page: 1, rows: 1000 }).then(res => {
      this.list = res.data.records
    })
  }
}
</script>
