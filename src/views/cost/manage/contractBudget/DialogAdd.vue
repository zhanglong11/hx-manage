<!--
    /**
   任务名称：TASK#2827 3月6号注释
   开发人员：崔洛宜
   日期：2020-03-31
   任务类型：注释(添加新加弹窗,新页面)
   **/
-->
<template>
  <el-dialog
    :title="isAdd ? '新建合同预算' : '修改合同预算'"
    :visible="visible"
    width="600px"
    top="10px"
    @close="$emit('close')"
  >
    <div style="width: 400px; margin: 0 auto;">
      <el-form ref="form" :model="form" :rules="formRule">
        <el-form-item label="合同预算名称" label-width="120px" prop="name" style="margin-right: 20px;">
          <el-input v-model="form.name" placeholder="请输入合同预算名称" class="inputStyle"> </el-input>
        </el-form-item>
        <el-form-item label="选择现场签证" label-width="120px" prop="siteAccessId" style="margin-right: 20px;">
          <!--
              /**
             任务名称：TASK#2828 3月7号注释
             开发人员：崔洛宜
             日期：2020-03-31
             任务类型：注释(修改参数传递)
         **/
          -->
          <SceneVisaSelect
            v-model="form.siteAccessId"
            :hasAll="false"
            :clearable="true"
            class="inputStyle"
            @creator="e => (form.creator = e)"
            @contractId="e => (form.contractId = e)"
          ></SceneVisaSelect>
        </el-form-item>
        <el-form-item label="创建人" label-width="120px" prop="creatorName" style="margin-right: 20px;">
          <el-input v-model="form.creatorName" disabled placeholder="请输入创建人" class="inputStyle"> </el-input>
        </el-form-item>
        <el-form-item label="创建日期" label-width="120px" prop="startDate" style="margin-right: 20px;">
          <el-date-picker
            v-model="form.createTime"
            disabled
            type="date"
            placeholder="请选择创建日期"
            class="inputStyle"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" label-width="120px" prop="remark" style="margin-right: 20px;">
          <el-input
            v-model="form.remark"
            type="textarea"
            class="inputStyle"
            placeholder="备注"
            :autosize="{ minRows: 4, maxRows: 6 }"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">下一步</el-button>
      <el-button @click="$emit('close')">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'DialogAdd',
  components: {},
  /**
   任务名称：TASK#2831 3月11号注释
   开发人员：崔洛宜
   日期：2020-03-11
   任务类型：注释(修改接收参数)(1)
   **/
  props: ['visible', 'formData', 'isAdd'],
  data() {
    return {
      form: {
        siteAccessId: '',
        creator: '',
        creatorName: '',
        createTime: '',
        remark: '',
        contractId: ''
      },
      formRule: {
        name: [{ required: true, message: '请输入预算名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    /**
         任务名称：TASK#2831 3月11号注释
         开发人员：崔洛宜
         日期：2020-03-11
         任务类型：注释(修改接收参数)(1)
         **/
    this.form = { ...this.formData }
    this.form.creatorName = this.$store.getters.name || 'admin'
    this.form.createTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss')
  },
  methods: {
    handleSubmit() {
      console.log(this.form)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form)
        } else {
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.inputStyle {
  width: 300px;
}
</style>
