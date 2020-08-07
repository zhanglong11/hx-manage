<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>工序详情</span>
      </div>
      <el-form label-width="110px" label-position="left">
        <el-form-item label="工序位置">{{ detail.locationName }} </el-form-item>
        <el-form-item label="工序名称">{{ detail.name }} </el-form-item>
        <el-form-item label="工序编号">{{ detail.floorNum }} </el-form-item>
        <el-form-item label="计划开始时间">{{ detail.planStartTime }} </el-form-item>
        <el-form-item label="计划工期(天)">{{ detail.planEndTime }} </el-form-item>
        <el-form-item></el-form-item>
        <el-form-item label="实际开始时间">{{ detail.actualStartTime }} </el-form-item>
        <el-form-item label="工序阶段">{{ detail.constructStage }} </el-form-item>
        <el-form-item label="创建时间">{{ detail.createTime }} </el-form-item>
        <el-form-item label="实际结束时间">{{ detail.actualEndTime }} </el-form-item>
        <el-form-item label="确认人">{{ detail.confirmorName }} </el-form-item>
        <el-form-item label="附件"><AttachmentDialog :ids="detail.fileId"></AttachmentDialog> </el-form-item>
        <el-form-item label="实际工期(天)">{{ detail.actualDuration }} </el-form-item>
      </el-form>
    </el-card>
    <el-card header="工序耗材">
      <vxe-table ref="table" :data="detail.consumeDTOList">
        <vxe-table-column type="seq" width="60px"></vxe-table-column>
        <vxe-table-column title="编码" field="materialCode"></vxe-table-column>
        <vxe-table-column title="名称" field="materialName"></vxe-table-column>
        <vxe-table-column title="规格型号" field="specification"></vxe-table-column>
        <vxe-table-column title="单位" field="unit"></vxe-table-column>
        <vxe-table-column title="库存数量" field="materialAmount"></vxe-table-column>
        <vxe-table-column title="计划耗材量" field="planConsumeNum"></vxe-table-column>
        <vxe-table-column title="实际用量">
          <template v-slot="{ row }">
            <span :style="{ color: row.actualConsumeNum <= row.planConsumeNum ? '#25CC70' : '#FF0000' }">
              {{ row.actualConsumeNum }}
            </span>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script>
import { processProgressApi } from '../api/process-progress'
export default {
  data() {
    return {
      configId: this.$route.params.configId,
      scheduleId: this.$route.params.scheduleId,
      detail: {
        consumeDTOList: [{}]
      }
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      processProgressApi.queryProcedureScheduleDetail(this.scheduleId).then(res => {
        this.detail = res.data
      })
    },
    async submit() {
      await this.$refs.table.validate()
      this.axios.working
        .post('working/procedure/floor/schedule/confirm', {
          configId: this.$route.params.configId,
          consumeAddDTOList: this.detail.consumeDTOList,
          fileId: this.detail.fileId,
          locationName: this.detail.locationName,
          remark: this.detail.remark,
          scheduleId: this.$route.params.scheduleId
        })
        .then(res => {
          this.$message.success('操作成功')
          this.$router.back()
        })
    }
  }
}
</script>
<style lang="less" scoped>
.el-form {
  width: 900px;
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    width: 33.3%;
  }
}
</style>
