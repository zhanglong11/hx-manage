<template>
  <el-dialog :visible="visible" title="发起流程" destroy-on-close @close="$emit('update:visible', false)">
    {{ definition }}

    <fm-generate-form v-if="jsonData" ref="generateForm" :data="jsonData"></fm-generate-form>
    <footer slot="footer">
      <el-button size="mini" type="primary" @click="submit">提交</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'InitProcess',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    definition: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      jsonData: null,
      form: {}
    }
  },
  watch: {
    visible(val) {
      if (val) {
        // 使用调休表单测试
        /**
         任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
         开发人员：李建敏
         日期：2020-3月-17日
         任务类型：2、复制修改代码 （1行）
         **/
        this.axios.workflow.get('custom/form/get/' + '5e65e0647939683954e57b2e').then(async res => {
          this.jsonData = JSON.parse(res.data.template)
        })
      } else {
        this.jsonData = null
      }
    }
  },
  methods: {
    async submit() {
      let data = await this.$refs.generateForm.getData()
      this.$emit('submit', data)
    }
  }
}
</script>

<style scoped lang="less"></style>
