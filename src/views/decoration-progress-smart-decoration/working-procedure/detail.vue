<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card top">
      <div slot="header">
        <span>规则配置详情</span>
      </div>
      <el-row :gutter="15">
        <el-col :span="24" :lg="12">
          <el-form label-width="110px" label-position="left">
            <el-form-item label="名称">{{ detail.name }} </el-form-item>
            <el-form-item label="模板分类"
              >{{ $getLabelFromArg('templateCategory', detail.templateCategory) }}
            </el-form-item>
            <el-form-item label="模板名称">{{ detail.templateName }} </el-form-item>
            <el-form-item label="开始时间">{{ detail.planStartTime }} </el-form-item>
            <el-form-item label="创建时间">{{ detail.createTime }} </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24" :lg="12">
          <vxe-table :data="detail.drawList" max-height="300px">
            <vxe-table-column type="seq" width="60" align="center" title="序号" />
            <vxe-table-column field="drawingName" title="图纸" />
            <vxe-table-column field="procedureNum" title="工序数量"> </vxe-table-column>
            <vxe-table-column field="duration" title="工期(天)"> </vxe-table-column>
          </vxe-table>
        </el-col>
      </el-row>
    </el-card>
    <el-card header="工序配置">
      <vxe-table ref="table" :data="detail.detailList">
        <vxe-table-column type="seq" width="60px" title="序号"></vxe-table-column>
        <vxe-table-column field="mainProcedure" title="工序名称" />
        <vxe-table-column field="floorRule" title="工序规则" />
        <vxe-table-column field="duration" title="工期(天)" />
      </vxe-table>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      configId: this.$route.params.configId,
      scheduleId: this.$route.params.scheduleId,
      detail: {},
      id: this.$route.params.id
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.axios.working.get('working/procedure/config/view/' + this.id).then(res => {
        res.data.detailList = _.sortBy(res.data.detailList, 'floorRule')
        res.data.drawList = _.unionBy(res.data.drawList, 'drawingId')
        this.detail = res.data
      })
    },
    async submit() {
      await this.$refs.table.validate()
    }
  }
}
</script>
<style lang="less" scoped></style>
