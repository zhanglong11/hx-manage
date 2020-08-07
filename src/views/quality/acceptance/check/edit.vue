<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="所属分项" prop="year">
          <div style="display: flex;">
            <el-input />
            <el-button type="text" @click="showProjectDialog">选择分项工程</el-button>
          </div>
        </el-form-item>
        <el-form-item label="检验批编号" prop="number">
          <el-input v-model="form.number" />
        </el-form-item>
        <el-form-item label="检验批名称" prop="number">
          <el-input v-model="form.number" />
        </el-form-item>
        <el-form-item label="检验批部位" prop="number">
          <el-input v-model="form.number" />
        </el-form-item>
        <el-form-item label="检验批容量" prop="number">
          <el-input v-model="form.number" />
        </el-form-item>
        <el-form-item label="施工依据" prop="number">
          <el-input v-model="form.number" />
        </el-form-item>
        <el-form-item label="验收依据" prop="year">
          <div style="display: flex;">
            <el-input />
            <el-button type="text">选择</el-button>
          </div>
        </el-form-item>
        <el-form-item label="验收日期" prop="planDate">
          <el-date-picker v-model="form.planDate" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="附件" prop="file">
          <FileEdit v-model="form.fileIds" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </section>
    <section>
      <el-card>
        <div slot="header" class="card-header">
          <span>检验批验收明细</span>
        </div>
        <EditTable v-model="tableData" :tableColumn="tableColumn" :validRules="validRules" />
      </el-card>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="primary" @click="submit">保存并提交</el-button>
    </div>
    <SelectProjectDialog :visible.sync="projectVisible" />
  </div>
</template>

<script>
import SelectProjectDialog from './components/SelectProjectDialog'
export default {
  name: 'Edit',
  components: { SelectProjectDialog },
  data() {
    return {
      form: {
        number: null,
        name: null,
        type: null,
        file: null,
        remark: null
      },
      projectVisible: false,
      rules: {
        number: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }],
        type: [{ required: true, message: '必填' }],
        planDate: [{ required: true, message: '必填' }],
        file: [{ required: true, message: '必填' }]
      },
      tableColumn: [
        {
          field: 'number',
          title: '验收项目',
          slots: {
            default: ({ row }) => [<el-input v-model={row.number} />]
          }
        },
        {
          field: 'name',
          title: '项目种类',
          slots: {
            default: ({ row }) => [<el-input v-model={row.number} />]
          }
        },
        {
          field: 'count',
          title: '设计要求及规范规定',
          slots: {
            default: ({ row }) => [<el-input v-model={row.count} />]
          }
        },
        {
          field: 'planTime',
          title: '实际抽样数量',
          slots: {
            default: ({ row }) => [<el-input v-model={row.planTime} />]
          }
        },
        {
          field: 'planTime',
          title: '检查记录',
          slots: {
            default: ({ row }) => [<el-input v-model={row.planTime} />]
          }
        },
        {
          field: 'planTime',
          title: '施工单位检查结果',
          slots: {
            default: ({ row }) => [<SelectList v-model={row.remark} type="selfCheckTypeList" />]
          }
        }
      ],
      tableData: [
        {
          id: 1,
          number: 'JC0001',
          name: '2月份检查计划',
          count: '300',
          planTime: '2019-2-30',
          check: '符合设计要求',
          file: '',
          creator: '张佑轩',
          time: '2020/1/11'
        }
      ],
      validRules: {
        number: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message.success('操作成功')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    showProjectDialog() {
      this.projectVisible = true
    }
  }
}
</script>

<style lang="less">
.edit-section {
  width: 400px;
}
</style>
