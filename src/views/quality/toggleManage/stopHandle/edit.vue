<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>停工令:({{ orderInfo.number }})</span>
        </h6>
        <ul>
          <li>
            <span class="label">停工部位</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">停工时间</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">停工原因</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">整改要求</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.time }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.fileIds" />
            </span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
      <div class="status-box">
        <el-button type="primary" @click="toEdit($route.query.id)">编辑</el-button>
        <p class="status">状态</p>
        <p class="status-info">待审核</p>
      </div>
    </div>
    <el-card>
      <div slot="header" class="card-header">
        <span>停工处理</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="处理人" prop="number">
          <SelectList v-model="form.type" :hasAllOption="false" type="selfCheckTypeList" />
        </el-form-item>
        <el-form-item label="处理方式" prop="number">
          <SelectList v-model="form.type" :hasAllOption="false" type="selfCheckTypeList" />
        </el-form-item>
        <el-form-item label="处理时间" prop="planDate">
          <el-date-picker v-model="form.planDate" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="附件" prop="file">
          <FileEdit v-model="form.fileIds" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
        <el-form-item label="申请复工" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.status" label="申请人" prop="remark">
          <SelectList v-model="form.type" :hasAllOption="false" type="selfCheckTypeList" />
        </el-form-item>
        <el-form-item v-if="form.status" label="复工时间" prop="planDate">
          <el-date-picker v-model="form.planDate" style="width: 100%;" />
        </el-form-item>
        <el-form-item v-if="form.status" label="复工资料" prop="file">
          <FileEdit v-model="form.fileIds" />
        </el-form-item>
        <el-form-item v-if="form.status" label="备注" prop="remark">
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
export default {
  name: 'Edit',
  data() {
    return {
      orderInfo: {},
      form: {
        number: null,
        name: null,
        type: null,
        file: null,
        remark: null,
        status: 1
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
          title: '隐蔽工程编号',
          slots: {
            default: ({ row }) => [<el-input v-model={row.number} />]
          }
        },
        {
          field: 'name',
          title: '隐蔽工程项目',
          slots: {
            default: ({ row }) => [<el-input v-model={row.number} />]
          }
        },
        {
          field: 'count',
          title: '隐蔽检验日期',
          slots: {
            default: ({ row }) => [<el-input v-model={row.count} />]
          }
        },
        {
          field: 'planTime',
          title: '验收意见',
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
.form {
  width: 400px;
}

.btn-box {
  margin-top: 10px;
  text-align: left;
}
</style>
