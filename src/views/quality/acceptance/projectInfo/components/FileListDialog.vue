<template>
  <el-dialog
    width="800px"
    :modal="true"
    top="10vh"
    title="已上传文件"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <FileList v-if="fileIds" :ids="fileIds" />
    <footer slot="footer">
      <el-button type="primary" @click="$emit('update:visible', false)">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'SelectTargetResolveDialog',
  props: {
    visible: {},
    fileIds: {}
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped></style>
