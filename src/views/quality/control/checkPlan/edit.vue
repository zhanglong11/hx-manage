<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
        <el-form-item label="检查计划名称" prop="checkPlanName">
          <el-input v-model="form.checkPlanName" />
        </el-form-item>
        <el-form-item label="检查部位" prop="point.checkPoint">
          <el-input v-model="form.point.checkPoint" />
        </el-form-item>
        <el-form-item label="检查性质" prop="checkNature">
          <el-select v-model="form.checkNature" style="width: 100%;">
            <el-option :value="2" label="一般检查" />
            <el-option :value="3" label="阶段性检查" />
            <el-option :value="4" label="专项检查" />
          </el-select>
        </el-form-item>
        <el-form-item label="检查项目" prop="point.checkItem">
          <el-input v-model="form.point.checkItem" />
        </el-form-item>
        <el-form-item label="检查方式" prop="point.checkWay">
          <el-input v-model="form.point.checkWay" />
        </el-form-item>
        <el-form-item label="检查数量" prop="point.checkAmount">
          <el-input-number v-model="form.point.checkAmount" :controls="false" style="width: 100%;" />
          <!--          <InputNumber v-model="form.point.checkAmount" />-->
        </el-form-item>
        <el-form-item label="允许偏差" prop="point.allowableDeviation">
          <el-input-number v-model="form.point.allowableDeviation" :controls="false" style="width: 100%;" />
          <!--          <InputNumber v-model="form.point.allowableDeviation" />-->
        </el-form-item>
        <el-form-item label="计划时间" prop="planTime">
          <el-date-picker v-model="form.planTime" value-format="yyyy-MM-dd" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="验收要求" prop="acceptanceRequire">
          <el-input v-model="form.acceptanceRequire" type="textarea" />
        </el-form-item>
        <el-form-item label="上传" prop="fileIds">
          <FileEdit v-model="form.fileIds" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(null)">保存</el-button>
      <el-button type="primary" @click="submit(1)">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/quality/control/checkPlan'
export default {
  name: 'Edit',
  data() {
    return {
      form: {
        point: {}
      },
      /*
       * @任务编号:验证功能
       * @开发人员:张龙
       * @日期:2020-03-27
       * @任务类型: 修改代码
       */
      rules: {
        checkPlanName: [{ required: true, message: '必填' }],
        checkNature: [{ required: true, message: '必填' }],
        'point.checkPoint': [{ required: true, message: '必填' }],
        'point.checkItem': [{ required: true, message: '必填' }],
        'point.checkWay': [{ required: true, message: '必填' }],
        'point.checkAmount': [{ required: true, message: '必填' }],
        'point.allowableDeviation': [{ required: true, message: '必填' }],
        acceptanceRequire: [{ required: true, message: '必填' }],
        planTime: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.params.id, {})
      this.form = res.data
    },
    async submit(isAudit) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let addForm = { ...this.form, ...{ status: isAudit ? 1 : 0 }, ...{ pointAddDTO: this.form.point } }
          let editForm = {
            ...this.form,
            ...{ status: isAudit ? 1 : 0 },
            ...{ pointEditDTO: { ...this.form.point, ...{ id: this.form.id } } }
          }
          let res = this.$route.params.id ? await api.update(editForm) : await api.add(addForm)
          // if (isAudit) {
          //   let audit = this.$route.params.id
          //     ? await api.submitAudit(this.$route.params.id)
          //     : await api.submitAudit(res.data)
          // }
          this.form.pointInfo = {}
          this.$message.success('保存成功')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less">
.edit-section {
  width: 400px;
}
</style>
