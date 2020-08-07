<template>
  <el-dialog
    width="600px"
    :modal="true"
    top="10vh"
    title="添加"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
      <el-form-item label="申请人" prop="repriseManId">
        <SelectUser
          :id.sync="form.repriseManId"
          :value="form.repriseManId ? { id: form.repriseManId, label: form.repriseManName } : null"
          :name.sync="form.repriseManName"
          :multiple="false"
        />
      </el-form-item>
      <el-form-item label="复工时间" prop="repriseDate">
        <el-date-picker v-model="form.repriseDate" value-format="yyyy-MM-dd" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="复工资料" prop="file">
        <FileEdit v-model="form.fileIds" />
      </el-form-item>
      <el-form-item label="备注" prop="repriseRemark">
        <el-input v-model="form.repriseRemark" type="textarea" />
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import api from '@/api/quality/toggleManage/stop'
export default {
  name: 'ResetApplyDialog',
  props: {
    visible: {},
    curId: {}
  },
  data() {
    return {
      form: {
        repriseFileIds: '111'
      },
      rules: {
        name: [{ required: true, message: '必填' }],
        order: [{ required: true, message: '必填' }]
      }
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await api.resetApply({ ...this.form, ...{ id: this.curId } })
          this.$message.success('操作成功')
          this.$emit('update:visible', false)
          this.$parent.getList()
        }
      })
    }
  }
}
</script>

<style scoped></style>
