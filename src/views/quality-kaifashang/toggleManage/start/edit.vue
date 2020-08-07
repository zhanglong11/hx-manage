<template>
  <div>
    <section class="edit-section is-footer">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="工程名称" prop="engineeringName">
          <div style="display: flex;">
            <el-input v-model="form.engineeringName" />
            <el-button type="text" @click="showTargetDialog"> 选择</el-button>
          </div>
        </el-form-item>
        <el-form-item label="开工日期" prop="planStartDate">
          <el-date-picker v-model="form.planStartDate" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="附件" prop="fileIds">
          <FileEdit v-model="form.fileIds" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </section>
    <div class="btn-box footerButton">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(null)">保存</el-button>
      <el-button type="primary" @click="submit(1)">保存并提交</el-button>
    </div>
    <SelectTargetResolveDialog :target-type="1" :visible.sync="visible" @getTarget="getTarget" />
  </div>
</template>

<script>
import api from '@/api/quality/toggleManage/start'
export default {
  name: 'Edit',
  data() {
    return {
      form: {},
      //验证功能 张龙 3-30
      rules: {
        engineeringName: [{ required: true, message: '必填' }],
        planStartDate: [{ required: true, message: '必填' }],
        fileIds: [{ required: true, message: '必填' }]
      },
      visible: false
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
          let res = this.$route.params.id ? await api.update({ ...this.form }) : await api.add({ ...this.form })
          if (isAudit) {
            let audit = this.$route.params.id
              ? await api.submitAudit(this.$route.params.id)
              : await api.submitAudit(res.data)
          }
          this.$message.success('保存成功')
          this.$router.go(-1)
        }
      })
    },
    getTarget(o) {
      this.form = {
        ...this.form,
        ...{
          engineeringName: o.name,
          qualityTargetDecomposeId: o.id
        }
      }
    },
    showTargetDialog() {
      this.visible = true
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less">
.edit-section {
  width: 650px;
}

.btn-box {
  margin-top: 10px;
  text-align: left;
}
</style>
