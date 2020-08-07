<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>确认工序</span>
      </div>
      <el-form label-width="110px" label-position="left">
        <el-form-item label="工序位置">{{ detail.locationName }} </el-form-item>
        <el-form-item label="工序名称">{{ detail.name }} </el-form-item>
        <el-form-item label="工序编号">{{ detail.floorNum }} </el-form-item>
        <el-form-item label="计划开始时间">{{ detail.planStartTime }} </el-form-item>
        <el-form-item label="计划工期(天)">{{ detail.planEndTime }} </el-form-item>
        <el-form-item></el-form-item>
        <el-form-item label="工序阶段">{{ detail.constructStage }} </el-form-item>
        <el-form-item label="实际开始时间">{{ detail.actualStartTime }} </el-form-item>
        <el-form-item label="附件" style="width: 100%;">
          <FileEdit v-model="form.fileId"></FileEdit>
        </el-form-item>
        <el-form-item label="备注" style="width: 100%;">
          <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card header="工序耗材">
      <vxe-table
        ref="table"
        :data="form.consumeAddDTOList"
        :edit-rules="validRules"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
      >
        <vxe-table-column type="seq" width="60px"></vxe-table-column>
        <vxe-table-column title="编码" field="materialCode"></vxe-table-column>
        <vxe-table-column title="名称" field="materialName"></vxe-table-column>
        <vxe-table-column title="规格型号" field="specification"></vxe-table-column>
        <vxe-table-column title="单位" field="unit"></vxe-table-column>
        <vxe-table-column title="库存数量" field="materialAmount"></vxe-table-column>
        <vxe-table-column title="计划耗材量" field="planConsumeNum"></vxe-table-column>
        <vxe-table-column
          title="实际用量"
          field="actualConsumeNum"
          :edit-render="{ name: '$input', props: { type: 'number' } }"
        ></vxe-table-column>
        <vxe-table-column v-if="!!_.find(form.consumeAddDTOList, { isAdd: true })" title="操作2" width="100">
          <template v-slot="{ row, $rowIndex }">
            <el-button v-if="row.isAdd" type="text" @click="form.consumeAddDTOList.splice($rowIndex, 1)"
              >删除</el-button
            >
          </template>
        </vxe-table-column>
      </vxe-table>
      <SelectMaterial :checkedKeys="_.map(form.consumeAddDTOList, 'materialCode')" @change="handleMaterialChange">
        <div class="add" @click="materialdialogVisible = true">+ 添加</div>
      </SelectMaterial>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="$router.back()">取 消</el-button>
      <el-button size="lg" type="primary" @click="submit">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { processProgressApi } from '../api/process-progress'
import SelectMaterial from '../components/SelectMaterial'
import upsert from 'upsert-many'

export default {
  name: 'ProgressScheduleConfirmSmartDecoration',
  components: { SelectMaterial },
  data() {
    return {
      configId: this.$route.params.configId,
      scheduleId: this.$route.params.scheduleId,
      detail: {},
      form: {
        consumeAddDTOList: []
      },
      // validRules: {
      //   actualConsumeNum: [{ required: true, message: '必填' }]
      // },
      // 甲供材清单相关
      materialdialogVisible: false,
      materialList: []
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      processProgressApi.queryProcedureScheduleDetail(this.scheduleId).then(res => {
        this.detail = res.data
        this.form.consumeAddDTOList = res.data.consumeDTOList
        this.form.locationName = res.data.locationName
        this.form.scheduleId = this.$route.params.scheduleId
      })
    },
    async submit() {
      await this.$refs.table.validate()
      this.axios.working.post('working/procedure/floor/schedule/confirm', this.form).then(res => {
        this.$message.success('操作成功')
        this.$router.back()
      })
    },
    handleMaterialChange(list) {
      list.forEach(e => {
        e.isAdd = true
        e.planConsumeNum = 0
        e.actualConsumeNum = null
      })
      upsert(this.form.consumeAddDTOList, list, 'materialId')
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
.add {
  width: 90%;
  padding: 5px;
  font-size: 14px;
  margin: 20px auto 0;
  text-align: center;
  border: 1px dashed #409eff;
  color: #409eff;
  cursor: pointer;
}
</style>
