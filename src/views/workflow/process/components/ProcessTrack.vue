<template>
  <div>
    <img :src="src" alt="" />
  </div>
</template>

<script>
export default {
  name: 'ProcessTrack',
  props: {
    process: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      src: null
    }
  },
  watch: {
    process: {
      immediate: true,
      handler() {
        this.src = ''
        /**
         任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
         开发人员：李建敏
         日期：2020-3月-17日
         任务类型：2、复制修改代码 （1行）
         **/
        this.axios.workflow
          .get('activiti/process/instance/track/' + this.process.processInstanceId, { responseType: 'blob' })
          .then(res => {
            let imgSrc = window.URL.createObjectURL(res)
            this.src = imgSrc
          })
      }
    }
  }
}
</script>

<style scoped lang="less">
img {
  max-width: 100%;
}
</style>
