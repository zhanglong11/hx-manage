<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.templateName }}</span>
        </h6>
        <ul>
          <li style="width: 100%;">
            <span class="label">操作工序</span>
            <span>{{ orderInfo.templateProcess }}</span>
          </li>
          <li style="width: 100%;">
            <span class="label">样板照片</span>
            <div class="img-box">
              <ImageUpload v-model="orderInfo.photoFileIds" class="img-upload" :disabled="true" />
            </div>
          </li>
          <li style="width: 100%;">
            <span class="label">操作视频</span>
            <div class="video-box">
              <Video v-for="item in videoUrl" :key="item.id" :url="item.url" />
            </div>
          </li>
          <li style="width: 100%;">
            <span class="label">创建人</span>
            <span>{{ orderInfo.creatorName }}</span>
          </li>
          <li style="width: 100%;">
            <span class="label">创建时间</span>
            <span>{{ orderInfo.createTime }}</span>
          </li>
          <li style="width: 100%;">
            <span class="label">备注</span>
            <span>{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
/*
 * @任务编号:2686||图片上传组件
 * @开发人员:张龙
 * @日期:2020-03-24
 * @任务类型:修改代码
 */
import paramList from '@/lib/paramList'
import ImageUpload from '@/components/ImageUpload'
import api from '@/api/quality/plan/construcModel'
import fileApi from '@/api/file'
export default {
  name: 'Detail',
  components: { ImageUpload },
  data() {
    return {
      orderInfo: {
        templateName: '',
        templateProcess: '',
        creatorName: '',
        createTime: '',
        remark: ''
      },
      videoUrl: [],
      paramList
    }
  },
  watch: {
    'orderInfo.videoFileIds'(v) {
      if (v) {
        this.getFileUrl(v)
      } else {
        this.videoUrl = []
      }
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.query.id)
      this.orderInfo = res.data
    },
    toEdit(id) {
      this.$router.push({ path: 'constructModelEdit', query: { id } })
    },
    cancel() {
      this.$router.go(-1)
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

<style scoped lang="less">
.img-box {
  display: inline-block;
  img {
    width: 140px;
    height: 140px;
    margin-right: 10px;
  }
}
.video-box {
  display: flex;
  flex-wrap: wrap;
  > div {
    display: flex;
    width: 240px;
    flex-wrap: wrap;
    height: 120px;
    margin-right: 10px;
  }
}
.img-upload {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}
</style>
