<!--
 * @Description: 新增账号/重命名
 * @Version: 
 * @Autor: 
 * @Date: 2020-02-16 17:17:57
 * @LastEditTime : 2020-02-16 17:46:30
 -->
<template>
  <div>
    <el-dialog
      :title="creatFolderForm.id ? '重命名' : '新建文件夹'"
      :visible.sync="creatFolderFlag"
      width="500"
      @close="creatFolderClose"
    >
      <el-form ref="creatFolder" :model="creatFolderForm" label-width="120px" :rules="creatFolderRules">
        <el-form-item label="文件夹名称" prop="name">
          <el-input v-model="creatFolderForm.name"></el-input>
        </el-form-item>
        <el-form-item v-if="!creatFolderForm.id && creatFolderForm.id != 0" label="标签" prop="fileTag">
          <el-tag
            v-for="tag in dynamicTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
            >{{ tag }}</el-tag
          >
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增标签</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="creatFolderFlag = false">取 消</el-button>
        <el-button type="primary" @click="creatFolderSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/design/file'
export default {
  name: 'Rename',
  props: {
    taskUniqueId: {},
    pid: {},
    departmentId: {}
  },
  data() {
    return {
      creatFolderRules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      inputVisible: false,
      // 新建文件夹只有自定义部门才可以进行
      creatFolderForm: {
        departmentId: null, //一级id
        fileTag: '',
        id: '',
        name: '',
        pid: '',
        projectId: localStorage.getItem('projectId'),
        taskUniqueId: '' //里程碑id
      },
      creatFolderFlag: false,
      dynamicTags: [],
      inputValue: ''
    }
  },
  methods: {
    show(form) {
      if (form) {
        for (let key in form) {
          this.creatFolderForm[key] = form[key]
        }
      }

      this.creatFolderFlag = true
    },
    // 新增文件modal close
    creatFolderClose() {
      this.creatFolderFlag = false
      this.$refs.creatFolder.resetFields()
      this.dynamicTags = []
      this.creatFolderForm.fileTag = ''
    },
    // tag新增
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    // 新增标签
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 新增标签
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 新增+重命名点击确认
    creatFolderSure() {
      this.$refs.creatFolder.validate(valid => {
        if (valid) {
          if (this.creatFolderForm.id) {
            //重命名
            this.rename()
          } else {
            //新增
            this.addFolderSubmit()
          }
        }
      })
    },
    async rename() {
      let obj = {
        id: this.creatFolderForm.id,
        name: this.creatFolderForm.name,
        type: this.creatFolderForm.type
      }
      let res = await api.rename(obj)
      this.addFolderSuccess()
    },
    // 新增确认
    async addFolderSubmit() {
      let fileTag = this.dynamicTags.join(',')
      this.creatFolderForm.departmentId = this.departmentId
      this.creatFolderForm.taskUniqueId = this.taskUniqueId
      this.creatFolderForm.fileTag = fileTag
      this.creatFolderForm.pid = this.pid
      this.creatFolderForm.module = 'unit'
      let res = await api.addFolder(this.creatFolderForm)
      this.addFolderSuccess()
    },
    // 成功后操作
    addFolderSuccess() {
      this.creatFolderForm.id = null
      this.creatFolderForm.type = null
      this.creatFolderFlag = false
      this.$refs.creatFolder.resetFields()
      this.$emit('success')
    }
  }
}
</script>

<style lang="less" scoped></style>
