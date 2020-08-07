<template>
  <div class="is-Footer white">
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="160px">
        <el-form-item label="时间范围" prop="planTime">
          <el-date-picker
            v-model="form.planTime"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="inputStyle"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目安全指标名称" prop="safetyIndicatorName">
          <el-input v-model="form.safetyIndicatorName" class="inputStyle" />
        </el-form-item>
        <el-form-item label="事故发生数量" required>
          <div>
            <div style="display: flex;">
              <div style="flex: 1;">
                <el-form-item label="一般事故数量" label-width="150px" prop="generalAccidentNum">
                  <el-input v-model.number="form.generalAccidentNum" />
                </el-form-item>
              </div>
              <div style="flex: 1;">
                <el-form-item label="较大事故数量" label-width="150px" prop="largerAccidentNum">
                  <el-input v-model.number="form.largerAccidentNum" />
                </el-form-item>
              </div>
            </div>
            <div style="display: flex;">
              <div style="flex: 1;">
                <el-form-item label="重大事故数量" label-width="150px" prop="greatAccidentNum">
                  <el-input v-model.number="form.greatAccidentNum" />
                </el-form-item>
              </div>
              <div style="flex: 1;">
                <el-form-item label="特别重大事故数量" label-width="150px" prop="veryGreatAccidentNum">
                  <el-input v-model.number="form.veryGreatAccidentNum" />
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form-item>
        <!--  <el-form-item label="指标完成情况" prop="ndicatorAchievingStatus">
          <el-select v-model="form.ndicatorAchievingStatus" class="inputStyle">
            <el-option v-for="item in safeTargetList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" class="inputStyle" />
        </el-form-item>
      </el-form>
    </section>
    <div class="footer-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(null)">保存</el-button>
    </div>
  </div>
</template>

<script>
import safeTargetList from '../../lib/safeTargetList'
import Api from '../../api/index'
export default {
  name: 'Edit',
  data() {
    return {
      safeTargetList,
      form: {
        planTime: []
      },
      rules: {
        planTime: [{ required: true, message: '时间范围必选', trigger: 'change' }],
        safetyIndicatorName: [{ required: true, message: '项目安全指标名称必填', trigger: 'blur' }],
        riskIncidence: [{ required: true, message: '必填' }],
        ndicatorAchievingStatus: [{ required: true, message: '指标完成情况必选', trigger: 'change' }],
        generalAccidentNum: [
          { required: true, message: '必填', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ],
        largerAccidentNum: [
          { required: true, message: '必填', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ],
        greatAccidentNum: [
          { required: true, message: '必填', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ],
        veryGreatAccidentNum: [
          { required: true, message: '必填', trigger: 'blur' },
          { type: 'number', message: '必须为数字值' }
        ]
      }
    }
  },
  watch: {},
  created() {
    if (this.$route.params.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await Api.safeTarget.detail(this.$route.params.id, {})
      this.form = { ...res.data, planTime: [res.data.timeRangeBegin, res.data.timeRangeEnd] }
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.$route.params.id
            ? await Api.safeTarget.update({
                ...this.form,
                timeRangeBegin: this.form.planTime[0],
                timeRangeEnd: this.form.planTime[1]
              })
            : await Api.safeTarget.add({
                ...this.form,
                timeRangeBegin: this.form.planTime[0],
                timeRangeEnd: this.form.planTime[1]
              })
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
@import '../../style.less';
</style>
