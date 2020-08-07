<!--
  * @任务编号: task2686 || 视频上传与展示
  * @开发人员:张龙
  * @日期:2020-03-23
  * @任务类型: 新代码
  -->
<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="样板名称" prop="templateName" style="width: 400px;">
          <el-input v-model="form.templateName" />
        </el-form-item>
        <el-form-item label="样板工序" prop="templateProcess" style="width: 400px;">
          <el-input v-model="form.templateProcess" :rows="3" type="textarea" />
        </el-form-item>
        <el-form-item label="样板照片" prop="photoFileIds">
          <ImageUpload ref="photoFileIds" v-model="form.photoFileIds" />
        </el-form-item>
        <el-form-item label="操作视频" prop="videoFileIds">
          <div class="video-box">
            <Video
              v-for="item in videoUrl"
              :key="item.id"
              :url="item.url"
              :hasRemove="true"
              @remove="removeVideo(item.id)"
            />
            <FileAddButton
              v-model="form.videoFileIds"
              style="display: flex; justify-content: center; align-items: center;"
            />
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="width: 400px;">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import ImageUpload from '@/components/ImageUpload'
import FileAddButton from './components/FileAddButton'
import api from '@/api/quality/plan/construcModel'
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
      let res = await api.detail(this.$route.params.id, {})
      this.form = res.data
    },
    async submit() {
      this.form.photoFileIds = _.map(this.$refs.photoFileIds.$refs.upload.fileList, e => e.id || e.response.data).join(
        ','
      )
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.$route.params.id ? await api.update({ ...this.form }) : await api.add({ ...this.form })
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
  > div {
    display: flex;
    width: 240px;
    flex-wrap: wrap;
    height: 120px;
  }
}
</style>

<style lang="less">
.edit-section {
  /*width: 400px;*/
}
</style>
