<template>
  <div>
    <el-button type="text" size="mini" @click="modalTypeStatus = true">添加</el-button>
    <!-- 添加模板分类 - 模态框 start -->
    <el-dialog :title="modalTitle" :visible.sync="modalTypeStatus" width="640px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="参数编码" prop="argCode">
          <el-input v-model="formData.argCode" autocomplete="off" placeholder="请输入参数编码" />
        </el-form-item>
        <el-form-item label="参数名字" prop="argText">
          <el-input v-model="formData.argText" autocomplete="off" placeholder="请输入参数名字" />
        </el-form-item>
        <el-form-item v-if="groupList.label" label="颜色或图标">
          <el-input
            v-model="formData.field"
            placeholder="请输入十六进制颜色码(#000000)或图标代码"
            autocomplete="off"
            class="form-input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalTypeStatus = false">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加模板分类 - 模态框 end -->
  </div>
</template>

<script>
/**
  任务名称：增加全局添加分类组件
  开发人员：耿为刚
  日期：2020-04-08
  任务类型：全新代码
**/
import { systemConfigApi } from '@/views/system-config/api/system-config'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    // 参数分组
    group: {
      type: String,
      default: ''
    }
  },
  data() {
    //这里存放数据
    return {
      modalTypeStatus: false,
      modalTitle: '添加',
      formData: {
        argCode: '',
        argGroup: '',
        argText: '',
        module: 'construction-2.0',
        parentId: 0,
        projectId: '',
        remark: '',
        field: ''
      },
      formDataBack: {},
      formRules: {
        argCode: [{ required: true, message: '请输入参数编码', trigger: 'blur' }],
        argText: [{ required: true, message: '请输入参数名字', trigger: 'blur' }]
      },
      isLoading: false // 防止多次提交
    }
  },
  computed: {
    groupList() {
      return this.$store.state.systemConfig.config[this.group] || {}
    },
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  watch: {
    group(val) {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  //方法集合
  methods: {
    init() {
      Object.assign(this.formDataBack, this.formData)
      this.modalTitle = this.groupList.label ? `添加${this.groupList.label}` : '添加分组'
    },
    // 保存
    save() {
      this.formData.projectId = this.projectId
      this.formData.parentId = this.groupList.label ? this.groupList.id : 0
      this.formData.argGroup = this.groupList.label ? this.groupList.argGroup : this.formData.argCode
      this.formData.argFlag = this.groupList.label ? 0 : 1
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.saveSuccess()
        } else {
          this.$message({
            type: 'error',
            message: '请完善表单!'
          })
          return false
        }
      })
    },
    // 保存 - 异步
    async saveSuccess() {
      try {
        this.isLoading = true
        await systemConfigApi.addArg(this.formData)
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        Object.assign(this.formData, this.formDataBack)
        this.$store.dispatch('setSystemConfigStorage')
        this.isLoading = false
        this.modalTypeStatus = false
      } catch (e) {
        this.isLoading = false
        this.modalTypeStatus = false
      }
    }
  } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
