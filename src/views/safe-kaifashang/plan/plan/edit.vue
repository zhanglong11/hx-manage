<template>
  <div class="is-Footer">
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
        <el-form-item label="检查计划名称" prop="planName">
          <el-input v-model="form.planName" class="inputStyle" />
        </el-form-item>
        <el-form-item label="安全计划类型" prop="planType">
          <el-select v-model="form.planType" class="inputStyle">
            <el-option v-for="item in planTypeList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="检查性质" prop="planNature">
          <el-select v-model="form.planNature" class="inputStyle">
            <el-option v-for="item in checkNatureList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <!--<el-form-item label="检查方式" prop="point.checkWay">
          <el-input v-model="form.point.checkWay" />
        </el-form-item>-->
        <el-form-item label="检查内容" prop="inspectContent">
          <el-input v-model="form.inspectContent" type="textarea" class="inputStyle" />
        </el-form-item>
        <el-form-item label="检查要求" prop="inspectRequirements">
          <el-input v-model="form.inspectRequirements" class="inputStyle" />
        </el-form-item>
        <el-form-item label="检查部门" prop="inspectDeptId">
          <SelectDepart
            :id.sync="form.inspectDeptId"
            :multiple="false"
            :value="form.inspectDeptId ? { id: form.inspectDeptId, label: form.inspectDeptName } : null"
            :label.sync="form.inspectDeptName"
            class="inputStyle"
          ></SelectDepart>
        </el-form-item>
        <el-form-item label="检查负责人" prop="inspectPrincipal">
          <SelectUser
            :id.sync="form.inspectPrincipal"
            :multiple="false"
            :value="form.inspectPrincipal ? { id: form.inspectPrincipal, label: form.inspectPrincipalName } : null"
            :name.sync="form.inspectPrincipalName"
            class="inputStyle"
          >
          </SelectUser>
        </el-form-item>
        <el-form-item label="检查执行人" prop="inspectExecutor">
          <SelectUser
            :id.sync="form.inspectExecutor"
            :multiple="true"
            :value="form.initInspectExecutor"
            :name.sync="form.inspectExecutorName"
            valueFormat="object"
            class="inputStyle"
          >
          </SelectUser>
        </el-form-item>
        <template v-if="$store.state.project.projectType === 'decoration'">
          <el-form-item label="受检班组" prop="beInspectedDeptId">
            <SelectGroup
              v-model="form.beInspectedDeptId"
              :name.sync="form.beInspectedDeptName"
              :principal.sync="form.beInspectedPrincipal"
              :principalName.sync="form.beInspectedPrincipalName"
            ></SelectGroup>
          </el-form-item>
          <el-form-item label="受检负责人" prop="beInspectedPrincipal">
            <el-input disabled :value="form.beInspectedPrincipalName"></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="受检部门" prop="beInspectedDeptId">
            <SelectDepart
              :id.sync="form.beInspectedDeptId"
              :multiple="false"
              :value="form.beInspectedDeptId ? { id: form.beInspectedDeptId, label: form.beInspectedDeptName } : null"
              :label.sync="form.beInspectedDeptName"
              class="inputStyle"
            ></SelectDepart>
          </el-form-item>
          <el-form-item label="受检负责人" prop="beInspectedPrincipal">
            <SelectUser
              :id.sync="form.beInspectedPrincipal"
              :multiple="false"
              :value="
                form.beInspectedPrincipal
                  ? { id: form.beInspectedPrincipal, label: form.beInspectedPrincipalName }
                  : null
              "
              :name.sync="form.beInspectedPrincipalName"
              class="inputStyle"
            >
            </SelectUser>
          </el-form-item>
        </template>
        <el-form-item label="计划开始时间" prop="planStartTime">
          <el-date-picker v-model="form.planStartTime" value-format="yyyy-MM-dd" class="inputStyle" />
        </el-form-item>
        <el-form-item label="计划结束时间" prop="planEndTime">
          <el-date-picker v-model="form.planEndTime" value-format="yyyy-MM-dd" class="inputStyle" />
        </el-form-item>
        <el-form-item label="检查周期" prop="inspectDuration">
          <el-input v-model="form.inspectDuration" disabled class="inputStyle" />
        </el-form-item>
        <el-form-item label="检查频率" prop="inspectFrequency">
          <el-date-picker
            ref="inspectFrequency"
            v-model="form.inspectFrequency"
            :disabled="!form.inspectDuration"
            value-format="yyyy-MM-dd"
            type="dates"
            placeholder="选择检查日期"
            class="inputStyle"
            :picker-options="{ disabledDate: disabledTime }"
            @focus="handleFocus"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="附件" prop="fileId">
          <FileEdit v-model="form.fileId" class="inputStyle" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" class="inputStyle" />
        </el-form-item>
      </el-form>
    </section>
    <div class="footer-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
      <!-- <el-button type="primary" @click="submit(1)">保存并提交</el-button>-->
    </div>
  </div>
</template>

<script>
import Api from '../../api/index'
import checkNatureList from '../../lib/checkNatureList'
import planTypeList from '../../lib/planTypeList'
import SelectGroup from '@/views/labour/components/SelectGroup'
export default {
  name: 'Edit',
  components: { SelectGroup },
  data() {
    return {
      checkNatureList,
      planTypeList,
      id: '',
      form: {
        inspectFrequency: []
      },
      rules: {
        planName: [{ required: true, message: '检查名称必填', trigger: 'blur' }],
        planType: [{ required: true, message: '安全计划类型必选', trigger: 'change' }],
        planNature: [{ required: true, message: '检查性质必选', trigger: 'change' }],
        inspectItem: [{ required: true, message: '检查项目必填', trigger: 'blur' }],
        inspectArea: [{ required: true, message: '检查部位必填', trigger: 'blur' }],
        inspectContent: [{ required: true, message: '检查内容必填', trigger: 'blur' }],
        inspectRequirements: [{ required: true, message: '检查要求必填', trigger: 'blur' }],
        inspectDeptId: [{ required: true, message: '检查部门必选', trigger: 'change' }],
        inspectPrincipal: [{ required: true, message: '检查负责人必选', trigger: 'change' }],
        inspectExecutor: [{ required: true, message: '检查执行人必选', trigger: 'change' }],
        beInspectedDeptId: [{ required: true, message: '受检部门必选', trigger: 'change' }],
        beInspectedPrincipal: [{ required: true, message: '受检负责人必选', trigger: 'change' }],
        planStartTime: [{ required: true, message: '计划开始时间不能为空', trigger: 'change' }],
        planEndTime: [{ required: true, message: '计划结束时间不能为空', trigger: 'change' }],
        inspectDuration: [{ required: true, message: '检查周期必填', trigger: 'blur' }],
        inspectFrequency: [{ required: true, message: '检查频次必选', trigger: 'change' }]
      }
    }
  },
  watch: {
    'form.planStartTime'(val) {
      if (val && this.form.planEndTime) {
        this.form.inspectDuration = moment(this.form.planEndTime).diff(moment(val), 'days')
      } else {
        this.form.inspectDuration = null
        this.form.inspectFrequency = []
      }
    },
    'form.planEndTime'(val) {
      if (val && this.form.planStartTime) {
        this.form.inspectDuration = moment(val).diff(moment(this.form.planStartTime), 'days')
      } else {
        this.form.inspectDuration = null
        this.form.inspectFrequency = []
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.refresh()
    }
  },
  methods: {
    disabledTime(time) {
      return !moment(time).isBetween(moment(this.form.planStartTime), moment(this.form.planEndTime), 'days', '[]')
    },
    handleFocus() {
      if (!this.form.inspectDuration) {
        this.$message.info('请先选择日期')
        return
      }
    },
    async refresh() {
      let res = await Api.plan.detail(this.id, {})
      this.form = res.data
      this.form.inspectFrequency = res.data.inspectFrequency.split(',')
      this.form.inspectExecutor = res.data.inspectExecutor.split(',')
      this.form.inspectExecutorName = res.data.inspectExecutorName.split(',')
      this.form.initInspectExecutor = this.form.inspectExecutor.map((i, index) => {
        return {
          id: this.form.inspectExecutor[index],
          name: this.form.inspectExecutorName[index]
        }
      })
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let addForm = { ...this.form, inspectFrequency: this.form.inspectFrequency.join(',') }
          let res = this.id ? await Api.plan.update(addForm) : await Api.plan.add(addForm)
          this.$message.success('保存成功')
          this.$router.back()
        }
      })
    },
    cancel() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less">
@import '../../style.less';
</style>
