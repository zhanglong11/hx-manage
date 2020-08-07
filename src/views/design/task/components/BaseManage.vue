<template>
  <div>
    <Grid
      ref="table"
      highlightCurrentRow
      :pagination="false"
      :request="request"
      @current-change="({ row }) => $emit('change', row.id)"
    >
      <vxe-table-column field="planName" title="名称"></vxe-table-column>
      <vxe-table-column field="savePeriod" title="保存周期"></vxe-table-column>
      <vxe-table-column field="createName" title="保存人"></vxe-table-column>
      <vxe-table-column v-if="type === 'manage'" title="操作">
        <el-popconfirm slot-scope="{ row }" title="确定删除吗？" @onConfirm="remove(row)">
          <el-button slot="reference" style="margin-left: 0;" type="text">删除</el-button>
        </el-popconfirm>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
export default {
  name: 'BaseManage',
  props: {
    type: {
      type: String,
      enum: ['manage', 'import'],
      default: 'manage'
    }
  },
  data() {
    return {
      request() {
        return this.axios.schedule
          .get('schedule/plan/listBase/' + localStorage.getItem('projectId'))
          .then(res => res.data)
      }
    }
  },
  methods: {
    async remove(row) {
      await this.axios.schedule.get('schedule/plan/deleteBase/' + row.id)
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less"></style>
