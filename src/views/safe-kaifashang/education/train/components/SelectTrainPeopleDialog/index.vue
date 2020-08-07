<template>
  <el-dialog
    width="1100px"
    :modal="true"
    top="10vh"
    title="上传培训人员表"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" class="form" label-width="100px">
      <el-form-item label="附件" prop="remark">
        <FileEdit v-model="form.fileIds" />
      </el-form-item>
    </el-form>
    <EditTable
      v-model="tableData"
      :tableColumn="tableColumn"
      :validRules="validRules"
      :isRemove="false"
      :isAdd="false"
    />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'SelectTrainPeopleDialog',
  props: {
    visible: {}
  },
  data() {
    return {
      form: {},
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'checkName',
          title: '姓名'
        },
        {
          field: 'type',
          title: '工种'
        },
        {
          field: 'age',
          title: '工龄'
        },
        {
          field: 'remark',
          title: '考核情况',
          slots: {
            default: ({ row }) => [<SelectList v-model={row.remark} type="selfCheckTypeList" />]
          }
        }
      ],
      tableData: [
        {
          id: 1,
          checkName: '2月份检查计划',
          type: '木工',
          age: 3,
          remark: ''
        }
      ],
      validRules: {
        name: [{ required: true, message: '必填' }],
        remark: [{ required: true, message: '必填' }]
      }
    }
  },
  methods: {
    handleTabClick(tab) {},
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    submit() {
      this.$message.success('操作成功')
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped></style>
