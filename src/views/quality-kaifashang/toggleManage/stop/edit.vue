<template>
  <div>
    <section class="edit-section is-footer">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="工程名称" prop="engineeringName">
          <div style="display: flex;">
            <el-input v-model="form.engineeringName" />
            <el-button type="text" @click="showStartApply">选择</el-button>
          </div>
        </el-form-item>
        <el-form-item label="停工部位" prop="stopWorkPlace">
          <el-input v-model="form.stopWorkPlace" />
        </el-form-item>
        <el-form-item label="停工时间" prop="stopWorkDate">
          <el-date-picker v-model="form.stopWorkDate" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="停工原因" prop="stopWorkReason">
          <el-input v-model="form.stopWorkReason" type="textarea" />
        </el-form-item>
        <el-form-item label="整改要求" prop="rectificationRequire">
          <el-input v-model="form.rectificationRequire" type="textarea" />
        </el-form-item>
        <!--       根据原型修改 张龙 3-30-->
        <el-form-item label="通知人" prop="notifierId">
          <SelectUser
            :id.sync="form.notifierId"
            :value="form.notifierId ? { id: form.notifierId, label: form.notifierName } : null"
            :name.sync="form.notifierName"
            :multiple="false"
          />
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
    <StartDialog :visible.sync="startDialog" @chooseStart="chooseStart" />
  </div>
</template>

<script>
import StartDialog from './components/StartDialog'
import api from '@/api/quality/toggleManage/stop'
export default {
  name: 'Edit',
  components: { StartDialog },
  data() {
    return {
      startDialog: false,
      form: {},
      rules: {
        engineeringName: [{ required: true, message: '必填' }],
        stopWorkPlace: [{ required: true, message: '必填' }],
        stopWorkReason: [{ required: true, message: '必填' }],
        rectificationRequire: [{ required: true, message: '必填' }],
        stopWorkDate: [{ required: true, message: '必填' }],
        notifierId: [{ required: true, message: '必填' }]
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
          let res = this.$route.params.id ? await api.update({ ...this.form }) : await api.add({ ...this.form })
          if (isAudit) {
            let audit = this.$route.params.id
              ? await api.submitAudit(this.$route.params.id)
              : await api.submitAudit(res.data)
          }
          this.$message.success('操作成功')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    showStartApply() {
      this.startDialog = true
    },
    chooseStart(o) {
      console.log(o)
      this.form = {
        ...this.form,
        ...{
          engineeringName: o.engineeringName,
          startWorkApplyId: o.id
        }
      }
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
