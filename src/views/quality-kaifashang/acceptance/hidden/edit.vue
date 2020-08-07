<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
        <el-form-item label="隐蔽工程编号" prop="number">
          <el-input v-model="form.number" />
        </el-form-item>
        <el-form-item label="隐蔽项目" prop="number">
          <el-input v-model="form.number" />
        </el-form-item>
        <el-form-item label="隐蔽检查日期" prop="planDate">
          <el-date-picker v-model="form.planDate" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="验收意见" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
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
          <span>隐蔽部位明细</span>
        </div>
        <EditTable v-model="tableData" :tableColumn="tableColumn" :validRules="validRules" />
      </el-card>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="primary" @click="submit">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
import EditTable from '@/components/EditTable'
export default {
  name: 'Edit',
  components: { EditTable },
  data() {
    return {
      form: {
        number: null,
        name: null,
        type: null,
        file: null,
        remark: null
      },
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
          title: '隐蔽部位',
          slots: {
            default: ({ row }) => [<el-input v-model={row.number} />]
          }
        },
        {
          field: 'name',
          title: '隐蔽内容',
          slots: {
            default: ({ row }) => [<el-input v-model={row.number} />]
          }
        },
        {
          field: 'count',
          title: '验收意见',
          slots: {
            default: ({ row }) => [<el-input v-model={row.count} />]
          }
        },
        {
          field: 'planTime',
          title: '备注',
          slots: {
            default: ({ row }) => [<el-input v-model={row.planTime} />]
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
    }
  }
}
</script>

<style lang="less">
.edit-section {
  width: 400px;
}
</style>
