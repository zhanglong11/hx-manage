<template>
  <div class="container real-time">
    <el-row :gutter="20">
      <el-col :md="4">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>监控区域</span>
          </div>
          <ul class="type-list">
            <li
              v-for="(item, i) in monitorAreaList"
              :key="i"
              :class="{ active: i === activeArea }"
              @click="clickArea(i, item)"
            >
              <span>•</span>
              <span class="title" v-text="item.label" />
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :md="20">
        <el-card class="box-card">
          <div slot="header" class="clearfix video-header">
            <span v-if="tabIndex === 0" class="video-title">施工现场视角A1</span>
            <span v-if="tabIndex === 0" class="video-name">Camera a-0001</span>
            <span class="video-time">{{ time }}</span>
            <p class="icons">
              <span class="el-icon-video-camera icon" :class="{ active: tabIndex === 0 }" @click="clickTab(0)" />
              <span class="el-icon-menu icon" :class="{ active: tabIndex === 1 }" @click="clickTab(1)" />
            </p>
          </div>

          <!-- 轮播列表 start -->
          <template v-if="tabIndex === 0">
            <div class="video-player big-video-img vjs-custom-skin">
              <video-player
                ref="videoPlayer"
                class="big-video-img"
                :playsinline="true"
                :options="playerOptions"
              ></video-player>
              <!-- <video :src="bigVideo" class="big-video-img" :hasRemove="true" />-->
            </div>
            <div style="margin-top: 20px;">
              <Slick
                v-if="showSlick"
                ref="videoListRef"
                :options="videoListOption"
                @reInit="initSlick"
                @afterChange="changeVideo"
              >
                <div v-for="(item, i) in dataList" :key="i" class="video-list">
                  <span class="icon el-icon-video-camera" />
                  <p>{{ activeAreaName }}-{{ item.deviceName }}-{{ i }}</p>
                </div>
              </Slick>
            </div>
          </template>
          <!-- 轮播列表 end -->

          <!-- 普通列表 start -->
          <template v-else>
            <div class="video-list-img">
              <el-row :gutter="30">
                <template v-for="(item, i) in dataList">
                  <el-col :key="i" :md="6">
                    <div class="box">
                      <!--                      <video :src="item.deviceUrl" class="image" />-->
                      <Video :url="item.deviceUrl" />
                      <p class="title">{{ item.deviceName }}</p>
                      <p class="name">{{ item.deviceNum }}</p>
                    </div>
                  </el-col>
                </template>
              </el-row>
            </div>
            <div class="pagination">
              <p class="total">
                共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }} 页
                <el-button type="text primary" class="el-icon-refresh" @click="queryList()" />
              </p>
              <el-pagination
                background
                layout="sizes, prev, pager, next, jumper"
                :total="total"
                :current-page="queryForm.page"
                :page-size="queryForm.rows"
                :page-sizes="$pageConfig.pageSizes"
                @size-change="changePageSize"
                @current-change="changePageNumber"
              />
            </div>
          </template>
          <!-- 普通列表 end -->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-30
 * @Last Modified by: gengweigang
 */
import Slick from 'vue-slick'
import 'slick-carousel/slick/slick.css'
import Api from '@/views/equipment-monitoring/api/work-bench'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'EquipmentMonitoringRealTimeList',
  components: {
    Slick
  },
  data() {
    // 这里存放数据
    return {
      showSlick: false,
      time: '',
      activeArea: 0,
      activeAreaName: this.$getArgList('monitorArea').length && this.$getArgList('monitorArea')[0].label,
      bigVideo: '',
      videoListOption: {
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: true,
        focusOnSelect: true
      },
      tabIndex: 0,
      queryForm: {
        monitorArea: this.$getArgList('monitorArea').length && this.$getArgList('monitorArea')[0].value,
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [],
      total: 0,
      playerOptions: {
        //playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'application/x-mpegURL', //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: '' //url地址
          }
        ],
        poster: '../../static/images/test.jpg', //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      }
    }
  },
  computed: {
    //监控区域
    monitorAreaList() {
      return this.$getArgList('monitorArea') || []
    }
  },
  created() {
    this.queryList()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    setInterval(() => {
      this.time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }, 1000)
    Object.assign(this.queryFormBack, this.queryForm)
    this.initSlick()
  },
  // 方法集合
  methods: {
    async clickArea(i, item) {
      this.queryForm.monitorArea = item.value
      this.activeAreaName = item.label
      this.activeArea = i
      this.showSlick = false
      await this.queryList()
      this.showSlick = true
    },
    // 初始化轮播图
    initSlick() {
      this.$nextTick(() => {
        this.$refs.videoListRef.reSlick()
      })
    },
    // 切换视频
    changeVideo(event, slick, index) {
      //const height = 300 * (index + 1)
      //this.bigVideo = this.dataList[index].deviceUrl || 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
      this.playerOptions.sources[0].src = 'http://ngrok3.gim6d.com:20013/video882.m3u8'
      // this.dataList[index].deviceUrl || 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
      // this.dataList[index].deviceUrl || 'http://ngrok3.gim6d.com:20013/video882.m3u8'
      this.playerOptions.poster = this.dataList[index].capturePicture
    },
    // 切换显示方式
    clickTab(e) {
      this.tabIndex = e
      this.queryList()
    },
    // 查询列表
    async queryList() {
      let queryData
      let projectId = localStorage.getItem('projectId')
      if (this.tabIndex === 0) {
        queryData = { ...this.queryForm, page: 1, rows: 10000, projectId: projectId }
      } else {
        queryData = { ...this.queryForm }
      }
      let result = await Api.getRealMonitorList(queryData)
      this.dataList = result.data || []
      //this.dataList = new Array(10).fill(result.data[0])
      //this.bigVideo = this.dataList[0].deviceUrl || 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
      // this.playerOptions.sources[0].src = 'https://cdn.letv-cdn.com/2018/12/05/JOCeEEUuoteFrjCg/playlist.m3u8'
      this.playerOptions.sources[0].src = this.dataList[0].deviceUrl || 'http://ngrok3.gim6d.com:20013/video882.m3u8'
      this.playerOptions.poster = result.data[0].capturePicture
      this.showSlick = true
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryList()
    },
    // 重置
    reset() {
      Object.assign(this.queryForm, this.queryFormBack)
      this.queryList()
    },
    // 当前页码改变
    changePageNumber(pageNumber) {
      this.queryForm.page = pageNumber
      this.queryList()
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.page = 1
      this.queryForm.rows = pageSize
      this.queryList()
    },
    // 查看详情
    toDetails() {},
    // 删除视频
    deleteVideo(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {})
        .catch(() => {})
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
@import url('../../styles/color.less');
.real-time {
  padding: 0 !important;
  background: none !important;
}
.type-list {
  min-height: 720px;
  li {
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 20%;
    border-bottom: 1px @line solid;
    cursor: pointer;
    transition: all 0.3s;
    .title {
      margin-left: 5px;
      font-size: 14px;
    }
    &:hover,
    &.active {
      background: @main-color;
      color: #fff;
    }
  }
}
.video-header {
  display: flex;
  align-items: center;
  .video-name {
    margin-left: 20px;
    font-size: 14px;
    color: @main-sub-color;
  }
  .video-time {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: @sub-base-color;
  }
  .icons {
    font-size: 20px;
    color: @sub-base-color;
    .icon {
      margin-left: 10px;
      cursor: pointer;
      &.active {
        color: @main-color;
      }
    }
  }
}
.big-video {
  margin-bottom: 20px;
  .big-video-img {
    width: 100%;
    height: 590px;
  }
}

.video-list {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px @line solid;
  height: 100px;
  transition: all 0.3s;
  cursor: pointer;
  .icon {
    font-size: 36px;
    color: @sub-base-color;
  }
  &.active {
    border-color: @main-color;
    box-shadow: 0 0 5px @main-color;
  }
}
.video-list-img {
  padding: 20px;
  .box {
    margin-bottom: 30px;
    border: 1px @line solid;
    border-radius: 6px 6px 0 0;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    .image {
      width: 100%;
      height: 300px;
      border-radius: 6px 6px 0 0;
    }
    .title,
    .name {
      margin: 10px 0;
      padding-left: 20px;
    }
    .name {
      color: @sub-color;
    }
    &:hover {
      border-color: @main-color;
      box-shadow: 0 0 5px @main-color;
    }
  }
}
.slick-slider {
  display: flex;
  align-items: center;
  /deep/.slick-arrow {
    font-size: 0;
    border: 0;
    background: none;
    outline: none;
    cursor: pointer;
    color: @sub-base-color;
    &:after {
      content: '\e6de';
      font-family: element-icons !important;
      font-size: 40px;
      font-weight: bold;
    }
    &.slick-next {
      &:after {
        content: '\e6e0';
      }
    }
    &:hover {
      color: @main-color;
    }
  }
  /deep/.slick-list {
    width: 100%;
    text-align: left;
  }
  /deep/ .slick-track {
    width: 100%;
    float: left;
  }
  /deep/.slick-slide {
    min-width: 200px;
    padding: 0 10px;
  }
  /deep/ .slick-current {
    .video-list {
      border-color: @main-color;
      box-shadow: 0 0 5px @main-color;
    }
  }
}
</style>
