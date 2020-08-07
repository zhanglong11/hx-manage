<template>
  <div class="is-Footer white">
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.templateName }}</span>
        </h6>
        <div class="infoWrapper">
          <el-row class="rowLine">
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">操作工序</div>
                <div class="lrCellValue">{{ orderInfo.templateProcess }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine">
            <el-col :span="20">
              <div class="lrCellInfo">
                <div class="lrCellLabel">样板照片</div>
                <div class="lrCellValue">
                  <div class="img-box">
                    <ImageUpload v-model="orderInfo.photoFileIds" class="img-upload" :disabled="true" />
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine">
            <el-col :span="20">
              <div class="lrCellInfo">
                <div class="lrCellLabel">操作视频</div>
                <div class="lrCellValue">
                  <div class="video-box">
                    <Video v-for="item in videoUrl" :key="item.id" :url="item.url" />
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine">
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">创建人</div>
                <div class="lrCellValue">{{ orderInfo.creatorName }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine">
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">创建时间</div>
                <div class="lrCellValue">{{ orderInfo.createTime }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowLine">
            <el-col :span="12">
              <div class="lrCellInfo">
                <div class="lrCellLabel">备注</div>
                <div class="lrCellValue">{{ orderInfo.remark }}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 批注组件 start -->
    <template v-if="$hasPower('QualityModelCommentPCDetail')">
      <AddComments :id="id" type="QualityAcceptanceTemplate" :canAdd="$hasPower('QualityModelCommentPCAdd')" />
    </template>
    <!-- 批注组件 start -->
    <div class="footer-btn">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>
<script>
import ImageUpload from '@/components/ImageUpload'
import Api from '../../api/index'
import fileApi from '@/api/file'
export default {
  name: 'Detail',
  components: { ImageUpload },
  data() {
    return {
      orderInfo: {},
      videoUrl: []
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
      let res = await Api.qualityModel.detail(this.$route.params.id)
      this.orderInfo = res.data
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
<style lang="less">
@import '../../style.less';
</style>
