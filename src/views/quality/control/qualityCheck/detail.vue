<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>质量检查</span>
        </h6>
        <ul>
          <li>
            <span class="label">检查部位</span>
            <span class="val">{{ orderInfo.checkPoint }}</span>
          </li>
          <li>
            <span class="label">检查项目</span>
            <span class="val">{{ orderInfo.checkItem }}</span>
          </li>
          <li>
            <span class="label">检查数量</span>
            <span class="val">{{ orderInfo.checkAmount }}</span>
          </li>
          <li>
            <span class="label">计划时间</span>
            <span class="val">{{ orderInfo.planTime }}</span>
          </li>
          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.creatorName }}</span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.createTime }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.checkPlanFiles" />
            </span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
      <div class="status-box">
        <p class="status">状态</p>
        <p class="status-info">
          <span class="val">{{
            _.get(_.find(paramList.qualityCheckStatus, { value: orderInfo.status }), 'label')
          }}</span>
        </p>
      </div>
    </div>
    <!--    没问题-->
    <!--    详情情况划分 张龙 3-30-->
    <section v-if="orderInfo.status === 1" style="margin-top: 10px;">
      <el-card>
        <div slot="header" class="card-header">
          <span>检查情况</span>
        </div>
        <div class="info">
          <div class="content">
            <ul>
              <li style="width: 100%;">
                <span class="label">检查人</span>
                <span class="val">{{ orderInfo.checkManName }}</span>
              </li>
              <li style="width: 100%;">
                <span class="label">检查时间</span>
                <span class="val">{{ orderInfo.checkTime }}</span>
              </li>
              <li style="width: 100%;">
                <span class="label">现场照片</span>
                <div class="img-box">
                  <ImageUpload v-model="orderInfo.checkPhotoIds" class="img-upload" :disabled="true" />
                </div>
              </li>
              <li style="width: 100%;">
                <span class="label">备注</span>
                <span class="val">{{ orderInfo.remark }}</span>
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </section>
    <!--    待整改-->
    <section v-if="orderInfo.status > 1" style="margin-top: 10px;">
      <el-card>
        <div slot="header" class="card-header">
          <span>检查情况</span>
        </div>
        <div class="info">
          <div class="content">
            <ul>
              <li>
                <span class="label">检查部位</span>
                <span class="val">{{ orderInfo.checkPoint }}</span>
              </li>
              <li>
                <span class="label">检查项目</span>
                <span class="val">{{ orderInfo.checkItem }}</span>
              </li>
              <li>
                <span class="label">问题等级</span>
                <span class="val">{{ orderInfo.problemGrade }}</span>
              </li>
              <li>
                <span class="label">紧急程度</span>
                <span class="val">{{ orderInfo.urgencyDegree }}</span>
              </li>
              <li>
                <span class="label">问题描述</span>
                <span class="val">{{ orderInfo.problemDesc }}</span>
              </li>
              <li>
                <span class="label">整改期限</span>
                <span class="val">{{ orderInfo.rectificationTime }}</span>
              </li>
              <li>
                <span class="label">整改要求</span>
                <span class="val">{{ orderInfo.rectificationRequire }}</span>
              </li>
              <li>
                <span class="label">检查人</span>
                <span class="val">{{ orderInfo.checkManName }}</span>
              </li>
              <li>
                <span class="label">检查时间</span>
                <span class="val">{{ orderInfo.checkTime }}</span>
              </li>
              <li>
                <span class="label">现场照片</span>
                <div class="img-box">
                  <ImageUpload v-model="orderInfo.checkPhotoIds" class="img-upload" :disabled="true" />
                </div>
              </li>
              <li>
                <span class="label">备注</span>
                <span class="val">{{ orderInfo.remark }}</span>
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </section>
    <!--    待整改-->
    <section v-if="orderInfo.status > 2" style="margin-top: 10px;">
      <el-card>
        <div slot="header" class="card-header">
          <span>整改情况</span>
        </div>
        <div class="info">
          <div class="content">
            <ul>
              <li>
                <span class="label">整改人</span>
                <span class="val">{{ orderInfo.rectificationManName }}</span>
              </li>
              <li>
                <span class="label">整改时间</span>
                <span class="val">{{ orderInfo.rectificationTime }}</span>
              </li>
              <li>
                <span class="label">备注</span>
                <span class="val">{{ orderInfo.rectificationRemark }}</span>
              </li>
              <li>
                <span class="label">整改照片</span>
                <div class="img-box">
                  <ImageUpload v-model="orderInfo.rectificationPhotoIds" class="img-upload" :disabled="true" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </section>
    <!--    待整改-->
    <section v-if="orderInfo.status > 3" style="margin-top: 10px;">
      <el-card>
        <div slot="header" class="card-header">
          <span>复查情况</span>
        </div>
        <div class="info">
          <div class="content">
            <ul>
              <li>
                <span class="label">复查人</span>
                <span class="val">{{ orderInfo.rectificationManName }}</span>
              </li>
              <li>
                <span class="label">复查时间</span>
                <span class="val">{{ orderInfo.rectificationTime }}</span>
              </li>
              <li>
                <span class="label">是否合格</span>
                <span class="val">{{
                  _.get(_.find(paramList.qualityCheckStatus, { value: orderInfo.status }), 'label')
                }}</span>
              </li>
              <li>
                <span class="label">备注</span>
                <span class="val">{{ orderInfo.reviewRemark }}</span>
              </li>
              <li>
                <span class="label">整改照片</span>
                <div class="img-box">
                  <ImageUpload v-model="orderInfo.reviewPhotoIds" class="img-upload" :disabled="true" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/quality/control/qualityCheck'
import paramList from '@/lib/paramList'
import ImageUpload from '@/components/ImageUpload'
export default {
  name: 'Detail',
  components: { ImageUpload },
  data() {
    return {
      orderInfo: {},
      paramList
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
      this.$router.push({ path: 'qualityCheckEdit', query: { id } })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.img-upload {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}
</style>
