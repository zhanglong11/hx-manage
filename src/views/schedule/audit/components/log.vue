<template>
  <div>
    <Grid :pagination="{ page: 1, rows: 5 }" :request="request">
      <vxe-table-column type="seq" width="60px"></vxe-table-column>
      <vxe-table-column title="操作人" field="title"></vxe-table-column>
      <vxe-table-column title="操作时间" formatter="toDateString" field="createTime"></vxe-table-column>
      <vxe-table-column title="操作类型" field="title"></vxe-table-column>
      <vxe-table-column title="操作内容" field="title"></vxe-table-column>
      <vxe-table-column title="附件" field="title"></vxe-table-column>
    </Grid>
  </div>
</template>

<script>
export default {
  name: 'Log',
  data() {
    return {
      request() {
        return Promise.resolve({
          total: 100,
          records: _.fill(Array(5), { title: '哈哈', createTime: new Date() })
        })
      }
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {}
  }
}
</script>

<style lang="less" scoped></style>
