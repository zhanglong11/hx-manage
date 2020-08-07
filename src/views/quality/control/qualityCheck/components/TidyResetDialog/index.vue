<template>
  <el-dialog
    width="600px"
    :modal="true"
    top="10vh"
    title="整改复查"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
      <el-form-item label="复查人" prop="reviewManId">
        <SelectUser
          :id.sync="form.reviewManId"
          :value="form.reviewManId ? { id: form.reviewManId, label: form.reviewManName } : null"
          :name.sync="form.reviewManName"
          :multiple="false"
        />
      </el-form-item>
      <el-form-item label="复查时间" prop="reviewTime">
        <el-date-picker v-model="form.reviewTime" value-format="yyyy-MM-dd" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="是否合格" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="5">合格</el-radio>
          <el-radio :label="4">不合格</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="reviewRemark">
        <el-input v-model="form.reviewRemark" type="textarea" />
      </el-form-item>
      <el-form-item label="复查照片" prop="reviewPhotoIds">
        <FileEdit v-model="form.reviewPhotoIds" />
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import api from '@/api/quality/control/qualityCheck'
export default {
  name: 'TidyResetDialog',
  props: {
    visible: {},
    curId: {}
  },
  data() {
    return {
      form: {},
      rules: {}
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await api.reset({ ...this.form, ...{ id: this.curId } })
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
