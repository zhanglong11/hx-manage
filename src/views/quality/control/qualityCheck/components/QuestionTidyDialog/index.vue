<template>
  <el-dialog
    width="600px"
    :modal="true"
    top="10vh"
    title="问题整改"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
      <el-form-item label="整改人" prop="rectificationManId">
        <SelectUser
          :id.sync="form.rectificationManId"
          :value="form.rectificationManId ? { id: form.rectificationManId, label: form.rectificationManName } : null"
          :name.sync="form.rectificationManName"
          :multiple="false"
        />
      </el-form-item>
      <el-form-item label="整改时间" prop="rectificationTime">
        <el-date-picker v-model="form.rectificationTime" value-format="yyyy-MM-dd" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="备注" prop="rectificationRemark">
        <el-input v-model="form.rectificationRemark" type="textarea" />
      </el-form-item>
      <!--      字段修改 张龙 3-30-->
      <el-form-item label="整改照片" prop="rectificationPhotoIds">
        <FileEdit v-model="form.rectificationPhotoIds" />
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
  name: 'QuestionTidyDialog',
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
          let res = await api.tidy({ ...this.form, ...{ id: this.curId } })
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
