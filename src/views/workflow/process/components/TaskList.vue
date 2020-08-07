<template>
  <el-dialog title="流程详情" :visible="visible" @close="$emit('update:visible', false)">
    <ul>
      <li v-for="e in list" :key="e.id">{{ e.taskName }}</li>
    </ul>
  </el-dialog>
</template>

<script>
export default {
  name: 'TaskList',
  props: ['process', 'visible'],
  data() {
    return {
      list: []
    }
  },
  watch: {
    visible(val) {
      val && this.refresh()
    }
  },
  methods: {
    /**
     任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
     开发人员：李建敏
     日期：2020-3月-17日
     任务类型：2、复制修改代码 （1行）
     **/
    refresh() {
      this.axios.workflow
        .post('task/list/', { page: 1, rows: 100, processInstanceId: this.process.processInstanceId, taskStatus: 1 })
        .then(res => {
          this.list = res.data.records
        })
    }
  }
}
</script>
