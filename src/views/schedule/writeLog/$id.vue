<template>
  <!--/**
  任务名称：2868/修改bug
  开发人员：李建敏
  日期：2020-3月-7日
  任务类型：1.全新代码
  **/-->
  <!--
/**
bug名称：bug#1209,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220
开发人员：李建敏
日期：2020-3月-23日
任务类型：2、修改代码（50%）
**/
-->
  <div class="main">
    <div>
      <el-form ref="taskForm" label-positon="left" label-width="120px" disabled>
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="task.name"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" prop="type">
          <el-radio-group v-model="task.type">
            <el-radio :label="2">里程碑任务</el-radio>
            <el-radio :label="1">一般任务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="父级" prop="parentTaskUniqueId">
          <el-input v-model="task.pidName"></el-input>
        </el-form-item>
        <el-form-item label="任务编号" prop="wbsCode">
          <el-input v-model="task.wbsCode" disabled style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item label="前置任务" prop="preTaskId">
          <el-input v-model="task.preTaskName"></el-input>
        </el-form-item>
        <el-form-item label="计划开始时间" prop="planStartTime">
          <el-date-picker v-model="task.planStartTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="计划结束时间" prop="planEndTime">
          <el-date-picker v-model="task.planEndTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="工期" prop="planDuration">
          <InputNumber v-model="task.planDuration" disabled unit="天"> </InputNumber>
        </el-form-item>
        <el-form-item label="实际开始时间" prop="actualStartTime">
          <el-date-picker v-model="task.actualStartTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="实际结束时间" prop="actualEndTime">
          <el-date-picker v-model="task.actualEndTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="实际工期" prop="actualDuration">
          <input-number v-model="task.realityDuration" disabled unit="天"> </input-number>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-form ref="form1" :model="form" label-positon="left" label-width="120px" :rules="rules">
        <el-form-item label="当前进度" prop="actualProgress">
          <InputNumber v-model="form.actualProgress" :min="0" :max="100" unit="%"></InputNumber>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="fileIds">
          <Upload v-model="form.fileIds" multiple></Upload>
        </el-form-item>
      </el-form>
    </div>
    <el-card v-if="$route.meta.showAffectManage" style="margin-top: 10px;">
      <header slot="header">施工进度影响</header>
      <vxe-table
        ref="affectTable"
        max-height="280px"
        show-overflow
        border
        :data="effectList"
        :edit-config="type === 'edit' ? { trigger: 'click', mode: 'row', showStatus: true } : {}"
        :edit-rules="validRules"
      >
        <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
        <vxe-table-column title="施工影响名称" field="effectName" :editRender="{ name: 'ElInput' }"></vxe-table-column>
        <vxe-table-column title="影响范围" field="effectScope" :editRender="{ name: 'ElInput' }"></vxe-table-column>
        <vxe-table-column title="影响值" field="effectValue" :editRender="{ name: 'ElInputNumber' }"></vxe-table-column>
        <vxe-table-column title="单位" field="unit" :editRender="{ name: 'ElInput' }"></vxe-table-column>
        <vxe-table-column
          width="260px"
          title="影响日期"
          range-separator="至"
          field="daterange"
          :edit-render="{
            name: 'ElDatePicker',
            props: { type: 'daterange', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd HH:mm:ss' }
          }"
        ></vxe-table-column>
        <vxe-table-column
          title="影响工期(天)"
          field="effectDuration"
          :editRender="{ name: 'ElInputNumber' }"
        ></vxe-table-column>
        <vxe-table-column title="附件" field="fileIds">
          <template v-slot="{ row }">
            <AttachmentDialog accept=".jpg,.png,.gif,.webp,.bmp" manage :ids.sync="row.fileIds"></AttachmentDialog>
          </template>
        </vxe-table-column>
        <vxe-table-column title="备注" field="remark" :editRender="{ name: 'ElInput' }"></vxe-table-column>
        <vxe-table-column v-if="type === 'edit'" title="操作">
          <el-button
            slot-scope="{ rowIndex }"
            icon="el-icon-delete"
            type="danger"
            @click="effectList.splice(rowIndex, 1)"
          ></el-button>
        </vxe-table-column>
      </vxe-table>
      <div v-if="type === 'edit'" class="add-row" @click="addAffect"><i class="el-icon-plus"></i>添加</div>
      <el-form
        ref="form2"
        :disabled="type === 'view'"
        style="margin-top: 15px; width: 600px;"
        :model="form"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item v-if="$route.meta.showChangeReason" label="变更原因" prop="changeReason">
          <el-input v-model="form.changeReason"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.desp" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div style="height: 50px; background-color: unset;"></div>
    <footer class="main-footer">
      <el-button size="normal" @click="$router.go(-1)">取消</el-button>
      <el-button size="normal" type="primary" @click="submit">保存</el-button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'WriteLogDetail',
  data() {
    return {
      type: 'edit',
      task: {},
      form: {
        taskId: this.$route.query.taskId,
        actualProgress: 0
      },
      effectList: [],
      validRules: {
        effectName: [{ required: true, message: '必填' }]
      },
      rules: {
        actualProgress: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    taskId() {
      return this.$route.query.taskId
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      if (this.taskId) {
        this.axios.schedule.get('construct/task/get/' + this.taskId).then(res => {
          this.task = res.data
          this.form.actualProgress = res.data.actualProgress * 100
        })
      }
    },
    addAffect() {
      this.effectList.push({
        effectName: '',
        effectScope: '',
        effectValue: '',
        unit: '',
        effectDuration: 0,
        fileIds: '',
        remark: '',
        daterange: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:00')],
        isNew: true
      })
    },
    async submit() {
      this.effectList.forEach(e => {
        e.beginDate = e.daterange[0]
        e.endDate = e.daterange[1]
      })
      await this.$refs.affectTable.validate()
      await this.$refs.form1.validate()
      await this.$refs.form2.validate()
      await this.axios.schedule.post('construct/task/report', {
        ...this.form,
        addEffectList: this.effectList,
        taskId: this.taskId
      })
      this.$message.success('保存成功')
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
div.main {
  background-color: #f0f2f5;
  padding: 0;
  > * {
    background-color: #fff;
    padding: 25px;
    > .el-form {
      width: 600px;
    }
  }
}
.add-row {
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
  font-size: 14px;
  line-height: 30px;
  border: 1px dashed #ddd;
  margin-top: -1px;
  i {
    margin-right: 8px;
  }
  text-align: center;
}
.main-footer {
  text-align: right;
  z-index: 100;
  position: absolute;
  bottom: 0;
  width: calc(100% - 40px);
  background-color: #fff;
  margin-top: 15px;
  padding: 10px !important;
}
</style>
