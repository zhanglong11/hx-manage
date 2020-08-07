<template>
  <div class="is-Footer white">
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="样板名称" prop="templateName">
          <el-input v-model="form.templateName" class="inputStyle" />
        </el-form-item>
        <el-form-item label="样板工序" prop="templateProcess">
          <el-input v-model="form.templateProcess" :rows="3" type="textarea" class="inputStyle" />
        </el-form-item>
        <el-form-item label="样板照片" prop="photoFileIds">
          <ImageUpload ref="photoFileIds" v-model="form.photoFileIds" />
        </el-form-item>
        <el-form-item label="操作视频" prop="videoFileIds">
          <div class="video-box inputStyle">
            <Video
              v-for="item in videoUrl"
              :key="item.id"
              :url="item.url"
              :hasRemove="true"
              @remove="removeVideo(item.id)"
            />
          </div>
          <FileAddButton v-model="form.videoFileIds" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" class="inputStyle" />
        </el-form-item>
      </el-form>
    </section>
    <div class="footer-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import ImageUpload from '@/components/ImageUpload'
import FileAddButton from './components/FileAddButton'
import Api from '../../api/index'
import fileApi from '@/api/file'
export default {
  name: 'Edit',
  components: { ImageUpload, FileAddButton },
  data() {
    return {
      form: {
        templateName: '',
        templateProcess: '',
        photoFileIds: null,
        remark: '',
        videoFileIds: null
      },
      videoUrl: [],
      rules: {
        templateName: [{ required: true, message: '必填' }],
        templateProcess: [{ required: true, message: '必填' }]
      }
    }
  },
  watch: {
    'form.videoFileIds'(v) {
      if (v) {
        console.log(v)
        this.getFileUrl(v)
      } else {
        this.videoUrl = []
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await Api.qualityModel.detail(this.$route.params.id, {})
      this.form = res.data
    },
    async submit() {
      this.form.photoFileIds = _.map(this.$refs.photoFileIds.$refs.upload.fileList, e => e.id || e.response.data).join(
        ','
      )
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.$route.params.id
            ? await Api.qualityModel.update({ ...this.form })
            : await Api.qualityModel.add({ ...this.form })
          this.$message.success('保存成功')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    removeVideo(id) {
      const videoUrl = this.form.videoFileIds
        .split(',')
        .filter(l => l !== id)
        .join(',')
      this.form.videoFileIds = videoUrl
    },
    getFileUrl(v) {
      this.videoUrl = []
      v.split(',').map(async i => {
        const res = await fileApi.getFileList([i])
        if (v.includes(i)) {
          this.videoUrl.push({ id: i, url: res.data[0].fileUrl })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.video-box {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 7px;
  > div {
    width: 240px;
    margin-bottom: 10px;
  }
}
.edit-section form {
  width: auto;
}
</style>

<style lang="less">
@import '../../style.less';
</style>
