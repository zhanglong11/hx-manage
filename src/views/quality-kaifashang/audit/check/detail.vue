<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>验收申请:({{ orderInfo.number }})</span>
        </h6>
        <ul>
          <li>
            <span class="label">验收类别</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">自检情况</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">计划验收日期</span>
            <span class="val">{{ orderInfo.time }}</span>
          </li>
          <li>
            <span class="label">创建人</span>
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
        <el-button type="primary" @click="toEdit($route.query.id)">编辑</el-button>
        <p class="status">状态</p>
        <p class="status-info">待审核</p>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
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

<style scoped></style>
