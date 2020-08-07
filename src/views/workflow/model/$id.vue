<template>
  <Bpmn :id="$route.params.id" v-bind="$props" />
</template>

<script>
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （1行）
 **/
import Bpmn from '@/views/workflow/components/Bpmn'
export default {
  name: 'Item',
  components: { Bpmn }
}
</script>
