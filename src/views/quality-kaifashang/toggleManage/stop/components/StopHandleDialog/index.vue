<template>
  <el-dialog
    width="600px"
    :modal="true"
    top="10vh"
    title="停工处理"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
      <el-form-item label="处理人" prop="disposeManId">
        <SelectUser
          :id.sync="form.disposeManId"
          :value="form.disposeManId ? { id: form.disposeManId, label: form.disposeManName } : null"
          :name.sync="form.disposeManName"
          :multiple="false"
        />
      </el-form-item>
      <el-form-item label="处理方式" prop="disposeType">
        <SelectList v-model="form.disposeType" :hasAllOption="false" type="stopHandleType" />
      </el-form-item>
      <el-form-item label="处理时间" prop="disposeDate">
        <el-date-picker v-model="form.disposeDate" value-format="yyyy-MM-dd" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="附件" prop="file">
        <FileEdit v-model="form.fileIds" />
      </el-form-item>
      <el-form-item label="备注" prop="disposeRemark">
        <el-input v-model="form.disposeRemark" type="textarea" />
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
  name: 'StopHandleDialog',
  props: {
    visible: {},
    curId: {}
  },
  data() {
    return {
      form: {
        disposeFileIds: '111'
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
          let res = await api.stopHandle({ ...this.form, ...{ id: this.curId } })
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
