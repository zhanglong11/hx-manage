<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>停工令:({{ orderInfo.number }})</span>
        </h6>
        <ul>
          <li>
            <span class="label">停工部位</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">停工时间</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">停工原因</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">整改要求</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.time }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.fileIds" />
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
        <p class="status-info">待审核</p>
      </div>
    </div>
    <el-card>
      <div slot="header" class="card-header">
        <span>停工处理</span>
      </div>
      <ul class="handle-info">
        <li>
          <span class="label">处理人</span>
          <span class="val">王建军</span>
        </li>
        <li>
          <span class="label">处理时间</span>
          <span class="val">2019-10-25</span>
        </li>
        <li>
          <span class="label">处理方式</span>
          <span class="val">进行修补</span>
        </li>
        <li>
          <span class="label">附件</span>
          <span class="val">
            XXXX.docx
            <el-link :underline="false" type="primary">点击下载</el-link>
          </span>
        </li>
        <li>
          <span class="label">处理人</span>
          <span class="val"
            >这是一段备注。Blah blah blahLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod
            bibendum laoreet. Proin gravida dolor sit amet lacus accumsan</span
          >
        </li>
      </ul>
    </el-card>
    <el-card>
      <div slot="header" class="card-header">
        <span>复工申请</span>
      </div>
      <ul class="handle-info">
        <li>
          <span class="label">处理人</span>
          <span class="val">王建军</span>
        </li>
        <li>
          <span class="label">复工时间</span>
          <span class="val">2019-10-25</span>
        </li>
        <li>
          <span class="label">附件</span>
          <span class="val">
            XXXX.docx
            <el-link :underline="false" type="primary">点击下载</el-link>
          </span>
        </li>
        <li>
          <span class="label">处理人</span>
          <span class="val"
            >这是一段备注。Blah blah blahLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod
            bibendum laoreet. Proin gravida dolor sit amet lacus accumsan</span
          >
        </li>
      </ul>
    </el-card>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="cancel">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {
        number: 'GB50300-2013',
        type: '国家标准',
        creator: '张静如',
        content: '建筑工程施工质量验收统一标准.pdf',
        time: '2020-02-23 10:00:00',
        remark:
          '这是一段变更备注。Blah blah blahLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan'
      }
    }
  },
  methods: {
    toEdit(id) {
      this.$router.push({ path: 'checkStandardEdit', params: { id } })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.handle-info {
  width: 400px;
  li {
    display: flex;
    .label {
      flex: 0 0 80px;
      margin: 0 10px 10px 0;
      text-align: right;
      color: #747474;
    }
  }
}
</style>
