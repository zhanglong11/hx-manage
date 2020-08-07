<template>
  <div class="main">
    <!--
/**
bug名称：bug#1209,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220
开发人员：李建敏
日期：2020-3月-23日
任务类型：2、修改代码（30行）
**/
-->
    <div class="tooltips">
      <div>
        <el-form inline>
          <el-form-item>
            <el-input v-model="filterForm.search" placeholder="任务编号/任务名称/填报人"></el-input>
          </el-form-item>
          <el-form-item label="创建日期">
            <el-date-picker
              v-model="filterForm.date"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @input="
                arr => {
                  filterForm.beginTime = arr[0] + ' 00:00:00'
                  filterForm.endTime = arr[1] + ' 23:59:59'
                }
              "
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button @click="() => $refs.table.reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
      <vxe-table-column title="任务编号" field="wbsCode"></vxe-table-column>
      <vxe-table-column title="任务名称" field="taskName"></vxe-table-column>
      <vxe-table-column title="原进度(%)" field="originalProgress"></vxe-table-column>
      <vxe-table-column title="当前进度(%)" field="currentProgress"></vxe-table-column>
      <vxe-table-column title="备注" field="remark"></vxe-table-column>
      <vxe-table-column title="附件" field="fileIds">
        <template v-slot="{ row }">
          <AttachmentDialog :ids.sync="row.fileIds"></AttachmentDialog>
        </template>
      </vxe-table-column>
      <vxe-table-column title="填报人" field="creatorName"></vxe-table-column>
      <vxe-table-column title="填报时间" field="createTime"></vxe-table-column>
    </Grid>
    <div class="footerButton">
      <el-button @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WriteLog',
  data() {
    return {
      date: null,
      filterForm: {},
      request(body) {
        return this.axios.schedule.post('construct/task/reportList', {
          ...body,
          projectId: localStorage.getItem('projectId')
        })
      }
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
