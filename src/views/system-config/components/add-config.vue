<template>
  <div>
    <el-dialog :title="modalTitle" :visible.sync="modalStatus" width="640px" @close="onClose()">
      <el-form ref="formRef" :model="formData" :rules="formRules" :label-width="formLabelWidth">
        <el-form-item v-if="isGroup" label="参数编码" prop="argCode">
          <el-input
            v-model="formData.argCode"
            :disabled="!!formData.id"
            placeholder="请输入参数编码"
            autocomplete="off"
            class="form-input"
          />
        </el-form-item>
        <el-form-item label="参数名字" prop="argText">
          <el-input v-model="formData.argText" placeholder="请输入参数名字" autocomplete="off" class="form-input" />
        </el-form-item>
        <!-- <el-form-item label="参数分组" prop="argGroup">
          <el-input
            v-model="formData.argGroup"
            :disabled="!isGroup"
            placeholder="请输入参数分组"
            autocomplete="off"
            class="form-input"
          />
        </el-form-item> -->
        <el-form-item v-if="!isGroup" label="颜色或图标">
          <el-input
            v-model="formData.field"
            placeholder="请输入十六进制颜色码(#000000)或图标代码"
            autocomplete="off"
            class="form-input"
          />
          <ul class="color-list">
            <li style="background-color: #f54d4d;" @click="formData.field = '#f54d4d'"></li>
            <li style="background-color: #009944;" @click="formData.field = '#009944'"></li>
            <li style="background-color: #eac80d;" @click="formData.field = '#eac80d'"></li>
          </ul>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose()">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="save()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
  任务名称：【智慧工地2.0-前端】系统参数模块切图及功能开发
  开发人员：耿为刚
  日期：2020-04-02
  任务类型：全新代码
**/
import { systemConfigApi } from '../api/system-config'

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    // 模态框状态
    value: {
      type: Boolean,
      default: false
    },
    // 模态框标题
    modalTitle: {
      type: String,
      default: ''
    },
    // 模态框数据
    modalData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否是分组
    isGroup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    //这里存放数据
    return {
      modalStatus: false,
      formLabelWidth: '120px',
      // 表单提交数据
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
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  // 监控data中的数据变化
  watch: {
    value(val) {
      this.modalStatus = val
      if (!val) {
        this.formData = {
          argCode: '',
          argGroup: '',
          argText: '',
          module: 'construction-2.0',
          parentId: 0,
          projectId: '',
          remark: '',
          field: ''
        }
        this.$refs['formRef'].resetFields()
      } else {
        this.formData = { ...this.formData, ...this.modalData }
      }
    },
    modalData(val) {
      this.formData = Object.assign({}, val)
    },
    isGroup: {
      immediate: true,
      handler(val) {
        this.formRules.argCode[0].required = val
      }
    }
  },
  mounted() {
    Object.assign(this.formDataBack, this.formData)
  },
  //方法集合
  methods: {
    // 关闭模态框
    onClose() {
      this.$emit('onClose')
    },
    // 保存
    save() {
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
        this.formData.projectId = this.projectId
        this.formData.argFlag = this.isGroup ? 1 : 0
        if (this.isGroup) {
          this.formData.argGroup = this.formData.argCode
        }
        if (this.formData.argCode === '') {
          delete this.formData.argCode
        }
        if (this.formData.id) {
          await systemConfigApi.updateArg(this.formData)
        } else {
          await systemConfigApi.addArg(this.formData)
        }
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        Object.assign(this.formData, this.formDataBack)
        this.$store.dispatch('setSystemConfigStorage')
        this.onClose()
        this.$emit('onChange', this.isGroup)
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    }
  } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.color-list {
  margin-top: 8px;
  li {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 8px;
  }
}
</style>
