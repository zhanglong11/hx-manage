<template>
  <div>
    <div class="tooltips">
      <div></div>
      <div>
        <router-link :to="'form/new'"
          ><el-button v-if="$hasPower('WorkflowFormAdd')" size="mini" type="primary">新建</el-button></router-link
        >
      </div>
    </div>
    <!--
 /**
  任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
  开发人员：李建敏
  日期：2020-3月-17日
  任务类型：2、复制修改代码 （1行）
  **/
  -->
    <Grid :request="request">
      <vxe-table-column title="名称" field="name"></vxe-table-column>
      <vxe-table-column title="创建时间" field="createTime"></vxe-table-column>
      <vxe-table-column title="创建人" field="creatorName"></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <router-link :to="'form/' + row.id"
            ><el-button v-if="$hasPower('WorkflowFormEdit')" size="mini" type="primary">编辑</el-button></router-link
          >
          <el-button v-if="$hasPower('WorkflowFormDelete')" size="mini" type="danger" @click="remove(row)"
            >删除</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
export default {
  name: 'Form',
  data() {
    return {
      request() {
        /**
         任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
         开发人员：李建敏
         日期：2020-3月-17日
         任务类型：2、复制修改代码 （1行）
         **/
        return this.axios.workflow.post('custom/form/list', {}).then(res => res.data)
      }
    }
  },
  methods: {
    remove() {}
  }
}
</script>

<style scoped lang="less"></style>
