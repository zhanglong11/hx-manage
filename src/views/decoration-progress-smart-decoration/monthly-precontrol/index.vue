<template>
  <div class="no-padding main">
    <el-card class="aside" header="月度">
      <DrawingLibrary @change="handleTreeChange"></DrawingLibrary>
    </el-card>
    <el-card header="材料使用明细" class="content">
      <Grid ref="table" auto-search :request="request" :filterForm.sync="filterForm">
        <vxe-table-column type="seq" width="60px" title="序号" />
        <vxe-table-column field="materialCode" title="材料编码" />
        <vxe-table-column field="materialName" title="材料名称"></vxe-table-column>
        <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
        <vxe-table-column field="unit" title="单位"></vxe-table-column>
        <vxe-table-column field="materialBrand" title="品牌" />
        <vxe-table-column field="planConsumeNum" title="计划用材"></vxe-table-column>
        <vxe-table-column field="actualConsumeNum" title="实际用材"></vxe-table-column>
      </Grid>
    </el-card>
  </div>
</template>

<script>
import DrawingLibrary from './components/DrawingLibrary'
export default {
  name: 'MonthlyPrecontrol',
  components: {
    DrawingLibrary
  },
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request: body => {
        return this.axios.working.post('working/procedure/schedule/consume/monthlyDetails', body)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    submit() {},
    remove() {},
    async handleTreeChange(params) {
      this.filterForm = _.assign({}, this.filterForm, params)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.main {
  display: flex;
  .aside {
    flex-shrink: 0;
    width: 300px;
    margin-right: 15px;
    /deep/ .el-card__body {
      padding: 0;
    }
  }
  .content {
    flex: 1;
  }
}
</style>
