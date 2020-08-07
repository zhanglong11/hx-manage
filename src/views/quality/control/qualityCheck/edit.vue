<template>
  <div>
    <div class="info">
      <div class="content">
        <ul>
          <li>
            <span class="label">检查部位</span>
            <span class="val">{{ orderInfo.checkPoint }}</span>
          </li>
          <li>
            <span class="label">检查项目</span>
            <span class="val">{{ orderInfo.checkItem }}</span>
          </li>
          <li>
            <span class="label">检查数量</span>
            <span class="val">{{ orderInfo.checkAmount }}</span>
          </li>
          <li>
            <span class="label">计划时间</span>
            <span class="val">{{ orderInfo.planTime }}</span>
          </li>
          <li>
            <span class="label">验收要求</span>
            <span class="val">{{ orderInfo.rectificationRequire }}</span>
          </li>
          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.creatorName }}</span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.createTime }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val"> <FileList :ids="orderInfo.checkPlanFiles" /></span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.planRemark }}</span>
          </li>
        </ul>
      </div>
    </div>
    <el-card style="overflow: auto;">
      <div slot="header" class="card-header">
        <span>检查情况</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="">
          <el-radio-group v-model="isAgree">
            <el-radio :label="1">没问题</el-radio>
            <el-radio :label="0">有问题</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="isAgree">
          <el-form-item label="检查人" prop="checkManId">
            <SelectUser
              :id.sync="form.checkManId"
              :value="form.checkManId ? { id: form.checkManId, label: form.checkManName } : null"
              :name.sync="form.checkManName"
              :multiple="false"
            />
          </el-form-item>
          <el-form-item label="检查时间" prop="checkTime">
            <el-date-picker v-model="form.checkTime" value-format="yyyy-MM-dd" style="width: 100%;" />
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="问题描述" prop="problemDesc">
            <el-input v-model="form.problemDesc" type="textarea" />
          </el-form-item>
          <el-form-item label="问题等级" prop="problemGrade">
            <SelectList v-model="form.problemGrade" :hasAllOption="false" type="questionLevel" />
          </el-form-item>
          <el-form-item label="紧急程度" prop="urgencyDegree">
            <SelectList v-model="form.urgencyDegree" :hasAllOption="false" type="urgencyDegree" />
          </el-form-item>
          <el-form-item label="检查人" prop="checkManId">
            <SelectUser
              :id.sync="form.checkManId"
              :value="form.checkManId ? { id: form.checkManId, label: form.checkManName } : null"
              :name.sync="form.checkManName"
              :multiple="false"
            />
          </el-form-item>
          <el-form-item label="检查时间" prop="checkTime">
            <el-date-picker v-model="form.checkTime" value-format="yyyy-MM-dd" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="整改时限" prop="rectificationTimeLimit">
            <el-date-picker v-model="form.rectificationTimeLimit" value-format="yyyy-MM-dd" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="整改要求" prop="rectificationRequire">
            <el-input v-model="form.rectificationRequire" type="textarea" />
          </el-form-item>
        </div>
        <el-form-item label="现场照片" prop="checkPhotoIds">
          <FileEdit v-model="form.checkPhotoIds" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </el-card>
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/api/quality/control/qualityCheck'
export default {
  name: 'Edit',
  data() {
    return {
      orderInfo: {},
      isAgree: 1,
      form: {},
      //验证功能 3-30 张龙
      rules: {
        checkManId: [{ required: true, message: '必填' }],
        checkTime: [{ required: true, message: '必填' }],
        problemDesc: [{ required: true, message: '必填' }],
        problemGrade: [{ required: true, message: '必填' }],
        urgencyDegree: [{ required: true, message: '必填' }],
        rectificationTimeLimit: [{ required: true, message: '必填' }],
        rectificationRequire: [{ required: true, message: '必填' }],
        checkPhotoIds: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.params.id, {})
      this.orderInfo = res.data
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.isAgree
            ? await api.updateNo({ ...{ id: this.$route.params.id, ...this.form } })
            : await api.updateHave({ ...{ id: this.$route.params.id, ...this.form } })
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

<style lang="less" scoped>
.form {
  width: 500px;
}
</style>
