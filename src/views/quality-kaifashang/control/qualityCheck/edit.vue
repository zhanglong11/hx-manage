<template>
  <div class="is-footer">
    <el-form ref="form1" label-width="110px" class="form-1" :rules="rules" :model="form" :disabled="!!id">
      <el-form-item label="检查名称" prop="planName">
        <el-input v-model="form.planName"></el-input>
      </el-form-item>
      <el-form-item label="检查数量" prop="inspectNum">
        <el-input v-model="form.inspectNum"></el-input>
      </el-form-item>
      <!-- <el-form-item label="检查项目" prop="inspectItem">
        <el-input v-model="form.inspectItem"></el-input>
      </el-form-item> -->
      <el-form-item label="允许偏差" prop="allowableDeviation">
        <InputNumber v-model="form.allowableDeviation"></InputNumber>
      </el-form-item>
      <el-form-item label="检查性质" prop="planNature">
        <el-select v-model="form.planNature" disabled style="width: 100%;">
          <el-option v-for="e in planNatureList" :key="e.key" :label="e.label" :value="e.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="检查部位" prop="inspectArea">
        <el-input v-model="form.inspectArea" type="textarea" :autosize="{ minRows: 1 }"></el-input>
      </el-form-item> -->
      <el-form-item label="检查内容" prop="inspectContent">
        <el-input v-model="form.inspectContent" type="textarea" :autosize="{ minRows: 1 }"></el-input>
      </el-form-item>
      <el-form-item v-if="!!id" label="检查部门" prop="inspectDeptName">
        <el-input v-model="form.inspectDeptName"></el-input>
      </el-form-item>
      <el-form-item label="检查要求" prop="inspectRequirements">
        <el-input v-model="form.inspectRequirements" type="textarea" :autosize="{ minRows: 1 }"></el-input>
      </el-form-item>
      <el-form-item v-if="!!id" label="计划检查时间" style="width: 100%;">
        <template v-if="form.inspectFrequency">
          <el-tag v-for="e in form.inspectFrequency.split(',').sort()" :key="e" style="margin-right: 4px;">
            {{ e }}
          </el-tag>
        </template>
      </el-form-item>
      <!--
      1、质量/安全计划
      施工：受检单位=项目下机构、受检负责人=项目下人员
      精装修：受检单位=劳务班组、受检负责人=班组负责人（可自动带出）
      2、劳务班组：班组负责人调用项目人员API，进行选择
      -->
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
            v-model="form.beInspectedDeptId"
            :multiple="false"
            valueFormat="id"
            :name.sync="form.beInspectedDeptName"
          ></SelectDepart>
        </el-form-item>
        <el-form-item label="受检负责人" prop="beInspectedPrincipal">
          <SelectUser
            v-model="form.beInspectedPrincipal"
            :multiple="false"
            value-format="id"
            :disableKeys="[$store.state.user.id]"
            :name.sync="form.beInspectedPrincipalName"
          ></SelectUser>
        </el-form-item>
      </template>
      <el-form-item style="width: 100%;" label="附件" prop="planFileId">
        <Upload v-if="!id" v-model="form.planFileId" accept=".jpg,.png,.webp,.gif" multiple is-only-button></Upload>
        <AttachmentDialog v-else :ids="form.planFileId"></AttachmentDialog>
      </el-form-item>
      <el-form-item style="width: 100%;" label="备注" prop="planRemark">
        <el-input v-model="form.planRemark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
      </el-form-item>
    </el-form>
    <el-card style="overflow: auto;">
      <div slot="header" class="card-header">
        <span>检查情况</span>
      </div>
      <el-form ref="form2" :model="form" :rules="rules" class="form-2" label-width="120px">
        <el-form-item label="检查结果" prop="inspectStatus">
          <el-radio-group v-model="form.inspectStatus">
            <el-radio :label="1">合格</el-radio>
            <el-radio :label="2">不合格</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!id" label="检查人">
          <span>{{ $store.state.user.name }}</span>
        </el-form-item>
        <el-form-item v-if="!!id" label="本次检查内容" prop="currentInspectContent">
          <el-input v-model="form.currentInspectContent"></el-input>
        </el-form-item>
        <el-form-item v-if="!!id" label="检查负责人">
          <span>{{ form.inspectPrincipalName }}</span>
        </el-form-item>
        <el-form-item v-if="!!id" label="检查执行人">
          <span>{{ form.inspectExecutorName }}</span>
        </el-form-item>
        <el-form-item label="检查日期" prop="actualInspectTime">
          <el-date-picker v-model="form.actualInspectTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <div v-if="form.inspectStatus === 2">
          <el-form-item label="问题描述" prop="issueDescription">
            <el-input v-model="form.issueDescription" type="textarea" />
          </el-form-item>
          <el-form-item label="问题等级" prop="issueLevel">
            <el-select v-model="form.issueLevel">
              <el-option v-for="e in issueLevelList" :key="e.key" :label="e.label" :value="e.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="紧急程度" prop="emergencyLevel">
            <el-select v-model="form.emergencyLevel">
              <el-option v-for="e in emergencyLevelList" :key="e.key" :label="e.label" :value="e.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="不合格位置">
            <SelectBimComponent @change="handleBimComponentChange">
              {{ floorNameList }}
            </SelectBimComponent>
          </el-form-item>
          <el-form-item label="不合格构件">
            <p>{{ componentIdLength || 0 }}个构件</p>
          </el-form-item>
        </div>
        <el-form-item label="现场照片" prop="taskFileId">
          <Upload v-model="form.taskFileId" accept=".jpg,.png,.webp,.gif" is-only-button multiple></Upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </el-card>
    <div class="footerButton">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>
import issueLevelList from './lib/issueLevelList'
import emergencyLevelList from './lib/emergencyLevelList'
import planNatureList from './lib/planNatureList'
import SelectBimComponent from './components/SelectBimComponent'
import SelectGroup from '@/views/labour/components/SelectGroup'
export default {
  name: 'Edit',
  components: { SelectBimComponent, SelectGroup },
  data() {
    return {
      form: {
        projectId: localStorage.getItem('projectId'),
        actualInspectTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        planType: 1,
        planNature: 4
      },
      componentIdLength: null,
      floorNameList: null,
      rules: {
        planName: [{ required: true, message: '必填' }],
        // inspectItem: [{ required: true, message: '必填' }],
        planNature: [{ required: true, message: '必填' }],
        // inspectArea: [{ required: true, message: '必填' }],
        inspectContent: [{ required: true, message: '必填' }],
        inspectRequirements: [{ required: true, message: '必填' }],
        beInspectedDeptId: [{ required: true, message: '必填' }],
        inspectPrincipal: [{ required: true, message: '必填' }],
        beInspectedPrincipal: [{ required: true, message: '必填' }],
        inspectStatus: [{ required: true, message: '必填' }],
        actualInspectTime: [{ required: true, message: '必填' }],
        issueDescription: [{ required: true, message: '必填' }],
        issueLevel: [{ required: true, message: '必填' }],
        emergencyLevel: [{ required: true, message: '必填' }],
        taskFileId: [{ required: true, message: '必填' }],
        currentInspectContent: [{ required: true, message: '必填' }]
      },
      issueLevelList,
      emergencyLevelList,
      planNatureList
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  created() {
    if (this.id) this.refresh()
  },
  methods: {
    async refresh() {
      let res = await this.axios.safety.get('inspect/get/' + this.id)
      this.form = {
        ...this.form,
        ..._.omit(res.data, [
          'inspectStatus',
          'actualInspectTime',
          'issueDescription',
          'issueLevel',
          'emergencyLevel',
          'taskFileId'
        ])
      }
    },
    async submit() {
      if (!this.id) {
        await this.$refs.form1.validate()
      }
      await this.$refs.form2.validate()
      if (this.id) {
        await this.axios.safety.post('inspect/submit', {
          inspectTaskId: this.id,
          ..._.pick(this.form, [
            'inspectStatus',
            'actualInspectTime',
            'issueDescription',
            'issueLevel',
            'emergencyLevel',
            'currentInspectContent',
            'remark'
          ]),
          fileId: this.form.taskFileId
        })
      } else {
        await this.axios.safety.post('inspect/interim/add', this.form)
      }
      this.$message.success('保存成功')
      this.$router.back()
    },
    handleBimComponentChange(param) {
      this.componentIdLength = param.componentIdLength
      this.floorNameList = param.floorNameList
      this.form.bindDTOList = param.bindDTOList
    }
  }
}
</script>

<style lang="less" scoped>
.form-1 {
  // width: 1000px;
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    padding-right: 20px;
    width: 50%;
  }
}
.form-2 {
  width: 500px;
}
</style>
