<!--
    /**
 任务名称：TASK#2848 【智慧工地2.0-前端】资料管理》项目资料》列表、新增、编辑、详情切图及功能开发
 开发人员：崔洛宜
 日期：2020-04-01
 任务类型：上传文件弹窗
 **/
-->
<template>
  <el-dialog title="上传" :visible="visible" width="600px" top="10vh" @close="$emit('close')">
    <div class="formWrapper">
      <el-form ref="form" :inline="true" :model="form">
        <div>
          <el-form-item label="备注" label-width="100" prop="remark" style="margin-right: 20px;">
            <el-input v-model="form.remark" placeholder="备注" style="width: 260px;"> </el-input>
          </el-form-item>
          <el-form-item label="上传" label-width="100">
            <FileUploadWithImg
              v-model="form.fileIds"
              :multiple="false"
              :limit="1"
              :fileRecover="fileUrlList"
              :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png']"
              @fileName="e => (form.fileName = e)"
            ></FileUploadWithImg>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import FileUploadWithImg from '@/components/FileUploadWithImg'
import Api from '../api/work-bench'
export default {
  name: 'UploadDialog',
  components: { FileUploadWithImg },
  props: ['visible'],

  data() {
    return {
      form: {
        remark: '',
        fileIds: [],
        fileName: ''
      },
      fileUrlList: []
    }
  },
  created() {},
  methods: {
    /**
     任务名称：TASK#2841 【智慧工地2.0-前端】资料管理》集团资料》列表、新增、编辑、详情切图及功能开发
     开发人员：崔洛宜
     日期：2020-04-02
     任务类型：优化细节(文件上传判断,传参)
     **/
    handleSubmit() {
      if (!this.form.fileIds.length) {
        this.$message.info('请选择上传文件')
      } else {
        this.$emit('submit', this.form)
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
