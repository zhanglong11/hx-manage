<template>
  <div class="main">
    <Task class="task"></Task>
    <div class="section-wrap">
      <el-card>
        <header slot="header">施工进度影响</header>
        <Grid :pagination="false" :request="request">
          <vxe-table-column type="seq"></vxe-table-column>
          <vxe-table-column title="施工影响名称" field="title"></vxe-table-column>
          <vxe-table-column title="影响范围" field="title"></vxe-table-column>
          <vxe-table-column title="影响值" field="title"></vxe-table-column>
          <vxe-table-column title="单位" field="title"></vxe-table-column>
          <vxe-table-column title="影响开始日期" field="title"></vxe-table-column>
          <vxe-table-column title="影响结束日期" field="title"></vxe-table-column>
          <vxe-table-column title="影响工期（天）" field="title"></vxe-table-column>
          <vxe-table-column title="附件" field="title"></vxe-table-column>
          <vxe-table-column title="备注" field="title"></vxe-table-column>
        </Grid>
        <ul style="margin-top: 15px;">
          <li style="height: 50px;">变更原因:</li>
          <li style="height: 50px;">备注:</li>
        </ul>
      </el-card>
      <el-card>
        <header slot="header">操作记录</header>
        <Log></Log>
      </el-card>
      <el-card>
        <header slot="header">审核</header>
        <el-form label-width="80px">
          <el-form-item label="审核结果">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-input type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary">提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import Task from '@/views/schedule/plan'
import Log from './components/log'
export default {
  name: 'Edit',
  components: { Task, Log },
  data() {
    return {
      request() {
        return Promise.resolve(_.fill(Array(5), { title: '哈哈', createTime: new Date() }))
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

<style lang="less" scoped>
.task {
  background-color: #fff;
  padding: 20px;
}
div.main {
  background-color: #f0f2f5;
  padding: 0;
}
.section-wrap {
  background-color: #f0f2f5;
  > .el-card {
    margin-top: 15px;
  }
}
</style>
