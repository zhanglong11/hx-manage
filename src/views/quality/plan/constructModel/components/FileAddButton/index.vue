<!--
  * @任务编号: task2686 || 播放器上传组件
  * @开发人员:张龙
  * @日期:2020-03-23
  * @任务类型: 新代码
  -->
<template>
  <div>
    <el-upload
      ref="upload"
      class="upload"
      :action="action"
      :headers="headers"
      name="file"
      :show-file-list="false"
      :auto-upload="autoUpload"
      :on-success="handleSuccess"
      :multiple="multiple"
      :accept="accept"
    >
      <template>
        <el-button>上传视频</el-button>
      </template>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import api from '@/api/file'
import axios from '@/utils/axios'
export default {
  name: 'FileAddButton',
  props: {
    // 已上传文件ids
    value: {
      type: String,
      default: null
    },
    // 额外参数
    // 上传地址
    action: {
      type: String,
      default: axios.file.defaults.baseURL + '/file/commonFile/upload'
    },
    // 多选
    multiple: {
      type: Boolean,
      default: true
    },
    type: {
      //  文件模块类型
      type: Number
    },
    // 验证
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
      default: 1
    }
  },
  data() {
    return {
      fileList: [],
      headers: {
        'x-access-token': getToken()
      }
    }
  },
  methods: {
    handleSuccess(res) {
      if (res.code === 200) {
        this.$emit('input', [...this.value.split(','), res.data].join(','))
      }
    }
  }
}
</script>
