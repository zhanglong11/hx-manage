<template>
  <div class="is-Footer white">
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.name }}</span>
        </h6>
        <ul>
          <li>
            <span class="label">培训主题</span>
            <span class="val">{{
              _.get(_.find(paramList.trainThemeType, { value: orderInfo.trainTopic }), 'label')
            }}</span>
          </li>
          <li>
            <span class="label">培训类型</span>
            <span class="val">{{ _.get(_.find(paramList.trainType, { value: orderInfo.trainType }), 'label') }}</span>
          </li>
          <li>
            <span class="label">培训内容（概括）</span>
            <span class="val">{{ orderInfo.trainContent }}</span>
          </li>
          <li>
            <span class="label">开始时间</span>
            <span class="val">{{ orderInfo.startTime }}</span>
          </li>
          <li>
            <span class="label">结束时间</span>
            <span class="val">{{ orderInfo.endTime }}</span>
          </li>
          <li>
            <span class="label">培训地点</span>
            <span class="val">{{ orderInfo.trainAddress }}</span>
          </li>
          <li>
            <span class="label">培训组织单位</span>
            <span class="val">{{ orderInfo.trainCompany }}</span>
          </li>
          <li>
            <span class="label">授课人</span>
            <span class="val">{{ orderInfo.lecturer }}</span>
          </li>
          <li>
            <span class="label">接受培训单位</span>
            <span class="val">{{ orderInfo.recieveTrainCompany }}</span>
          </li>
          <li>
            <span class="label">接受培训人数</span>
            <span class="val">{{ orderInfo.recieveTrainNumber }}</span>
          </li>
          <li>
            <span class="label">考试合格人数</span>
            <span class="val">{{ orderInfo.passExaminationNumber }}</span>
          </li>
          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.createTime }}</span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.createTime }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.files" />
            </span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
      <div class="status-box" style="width: 260px;">
        <el-button @click="showPeopleDialog">上传培训人员表</el-button>
      </div>
    </div>
    <div class="footer-btn">
      <el-button @click="cancel">返回</el-button>
    </div>
    <SelectTrainPeopleDialog :visible.sync="peopleVisible" />
  </div>
</template>

<script>
import SelectTrainPeopleDialog from './components/SelectTrainPeopleDialog'
import paramList from '@/lib/paramList'
import api from '@/api/safe/education/train'
export default {
  name: 'Detail',
  components: { SelectTrainPeopleDialog },
  data() {
    return {
      peopleVisible: false,
      orderInfo: {
        number: 'GB50300-2013',
        type: '国家标准',
        creator: '张静如',
        content: '建筑工程施工质.pdf',
        time: '2020-02-23 10:00:00',
        remark: '这是一段备注'
      },
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
      this.$router.push({ path: 'trainEdit', params: { id } })
    },
    showPeopleDialog() {
      this.peopleVisible = true
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
