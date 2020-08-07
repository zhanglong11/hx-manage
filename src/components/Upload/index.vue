<template>
  <!-- /**
  任务名称：2868/修改bug
  开发人员：李建敏
  日期：2020-3月-7日
  任务类型：2、复制修改代码 （10行）
  **/-->
  <div>
    <el-upload
      ref="upload"
      class="upload"
      :data="data"
      :drag="!isOnlyButton"
      :action="action"
      :headers="headers"
      :value="value"
      name="file"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :show-file-list="showFileList"
      :auto-upload="autoUpload && !raw"
      :on-error="handleError"
      :on-remove="handleRemove"
      :multiple="multiple"
      :accept="accept"
      :limit="limit"
      :on-change="handleChange"
    >
      <template v-if="!isOnlyButton">
        <i class="el-icon-upload" :style="{ marginTop: accept ? '20px' : '40px' }" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </template>
      <template v-if="isOnlyButton">
        <div style="text-align: left;">
          <el-button slot="trigger" size="small" type="primary" icon="el-icon-upload2">{{ btnText }}</el-button>
        </div>
      </template>
    </el-upload>
    <p v-if="accept" class="accept">
      支持扩展名: <span>{{ accept }}</span>
    </p>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import api from '@/api/file'
import axios from '@/utils/axios'
export default {
  name: 'Upload',
  props: {
    // 额外参数
    data: {
      type: Object
    },
    // 上传地址
    action: {
      type: String,
      default: axios.file.defaults.baseURL + '/file/commonFile/upload'
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    value: [Object, Array, File, String],
    // 多选
    multiple: {
      type: Boolean,
      default: false
    },
    raw: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    name: {
      type: String
    },
    isOnlyButton: {
      type: Boolean,
      default: false
    },
    // 接受上传的文件类型（thumbnail-mode 模式下此参数无效）
    accept: {
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: '上传文件'
    },
    // 最大允许上传个数
    limit: {
      type: Number,
      default: 9
    }
  },
  data() {
    return {
      fileList: [],
      headers: {
        'x-access-token': getToken()
      },
      hasInit: false
    }
  },
  watch: {
    fileList: {
      deep: true,
      handler() {
        if (this.raw) {
          this.$emit('input', this.multiple || this.limit > 1 ? this.fileList.map(e => e.raw) : this.fileList[0].raw)
        } else {
          const val =
            this.multiple || this.limit > 1
              ? this.fileList
                  .filter(e => e?.response?.data || e.id)
                  .map(e => e.id || e.response.data)
                  .join(',')
              : this.fileList[0]?.response?.data
          if (val) {
            this.$emit('input', val)
          }
        }
      }
    },
    value() {
      if (this.hasInit) return false
      if (this.value && !this.raw) {
        api.getFileList(this.value.split(',')).then(res => {
          res.data.forEach(e => (e.name = e.fileName))
          this.fileList = res.data
          this.hasInit = true
        })
      }
    }
  },
  methods: {
    handleChange(file, fileList) {
      console.log(111)
      this.fileList = this.multiple || this.limit > 1 ? fileList : [file]
    },
    handleRemove(file, fileList) {
      if (file && file.status === 'success') {
        this.fileList = fileList
      }
    },
    async beforeUpload(file) {
      console.log(222)
      if (this.accept) {
        if (!_.some(this.accept.split(','), string => file.name.toLowerCase().includes(string.toLowerCase()))) {
          this.$message.error('文件格式错误，只允许' + this.accept)
          this.fileList.splice(-1, 1)
          return Promise.reject()
        }
      }
    },
    handleError(error) {
      console.log(333)
      this.$message.error(error.status + '：' + error.message)
    },
    submit() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped lang="less">
.accept {
  color: #999;
}
</style>
